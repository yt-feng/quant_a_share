"""Offline publication regressions, including real local bare Git repositories."""

import importlib.util
from pathlib import Path
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("push_market_cache", ROOT / "scripts/push_market_cache.py")
publisher = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(publisher)

SERVER_REJECTION = """remote: Internal Server Error
remote: Request ID 7C10:7B98C:10AA2EC:15C6E7D:6AC679BC
 ! [remote rejected] main -> main (Internal Server Error)
error: failed to push some refs to 'https://github.com/example/repo'
"""


def result(code=0, stderr=""):
    return subprocess.CompletedProcess(["git", "push"], code, "", stderr)


class PublishTests(unittest.TestCase):
    def replay(self, responses):
        calls, delays, logs = [], [], []
        responses = iter(responses)

        def run(command, **kwargs):
            calls.append((command, kwargs))
            response = next(responses)
            if isinstance(response, Exception):
                raise response
            return response

        status = publisher.publish(run=run, sleep=delays.append, log=logs.append)
        self.assertTrue(all(command == ["git", "push"] for command, _ in calls))
        self.assertTrue(all(options["timeout"] == 120 for _, options in calls))
        return status, calls, delays, logs

    def test_exact_observed_server_rejection_then_success(self):
        status, calls, delays, _ = self.replay([result(1, SERVER_REJECTION), result()])
        self.assertEqual((status, len(calls), delays), (0, 2, [10]))

    def test_immediate_success_does_not_wait(self):
        status, calls, delays, _ = self.replay([result()])
        self.assertEqual((status, len(calls), delays), (0, 1, []))

    def test_server_outage_is_bounded_and_stays_failed(self):
        status, calls, delays, _ = self.replay([result(1, SERVER_REJECTION)] * 3)
        self.assertEqual((status, len(calls), delays), (1, 3, [10, 30]))

    def test_explicit_http_server_errors_can_recover(self):
        for code in (500, 502, 503, 504):
            with self.subTest(code=code):
                status, calls, _, _ = self.replay([
                    result(1, f"fatal: The requested URL returned error: {code}"), result(),
                ])
                self.assertEqual((status, len(calls)), (0, 2))

    def test_other_failures_never_retry(self):
        errors = (
            "! [rejected] main -> main (fetch first)",
            "! [rejected] main -> main (non-fast-forward)",
            "fatal: Authentication failed", "Permission denied (publickey)",
            "remote: error: GH013: Repository rule violations found",
            "remote: error: GH006: Protected branch update failed",
            "! [remote rejected] main -> main (pre-receive hook declined)",
            "fatal: The requested URL returned error: 403",
            "fatal: unable to access repository: SSL certificate problem",
            "fatal: TLS handshake timeout", "fatal: Could not resolve host",
            "fatal: Failed to connect to github.com", "fatal: Operation timed out",
            "error: RPC failed; HTTP 429", "error: failed to push some refs",
            SERVER_REJECTION + "fatal: SSL certificate problem",
        )
        for error in errors:
            with self.subTest(error=error):
                status, calls, delays, _ = self.replay([result(1, error)])
                self.assertEqual((status, len(calls), delays), (1, 1, []))

    def test_process_timeout_or_launch_error_stops(self):
        for error in (subprocess.TimeoutExpired(["git", "push"], 120), OSError("git missing")):
            with self.subTest(error=str(error)):
                status, calls, delays, _ = self.replay([error])
                self.assertEqual((status, len(calls), delays), (1, 1, []))


class LocalGitTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.remote = self.root / "origin.git"
        self.repo = self.root / "checkout"
        self.git(self.root, "init", "--bare", str(self.remote))
        self.git(self.root, "init", "-b", "main", str(self.repo))
        self.git(self.repo, "config", "user.name", "Cache test")
        self.git(self.repo, "config", "user.email", "cache-test@example.invalid")
        (self.repo / "snapshot.json").write_text('{"generation":1}\n')
        self.git(self.repo, "add", "snapshot.json")
        self.git(self.repo, "commit", "-m", "Initial snapshot")
        self.git(self.repo, "remote", "add", "origin", str(self.remote))
        self.git(self.repo, "push", "-u", "origin", "main")
        (self.repo / "snapshot.json").write_text('{"generation":2}\n')
        self.git(self.repo, "commit", "-am", "Update snapshot")

    def git(self, cwd, *args):
        return subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True, check=True).stdout.strip()

    def test_accepted_push_with_server_error_response_reuses_same_commit(self):
        expected_sha = self.git(self.repo, "rev-parse", "HEAD")
        calls = []

        def run(command, **kwargs):
            completed = subprocess.run(command, cwd=self.repo, **kwargs)
            calls.append(command)
            self.assertEqual(completed.returncode, 0)
            # Simulate the remote accepting the commit but returning a 500 to the client.
            return result(1, SERVER_REJECTION) if len(calls) == 1 else completed

        status = publisher.publish(run=run, sleep=lambda _: None, log=lambda _: None)
        self.assertEqual(status, 0)
        self.assertEqual(len(calls), 2)
        self.assertEqual(self.git(self.remote, "rev-parse", "refs/heads/main"), expected_sha)
        self.assertEqual(self.git(self.repo, "rev-parse", "HEAD"), expected_sha)
        self.assertEqual(self.git(self.remote, "rev-list", "--count", "main"), "2")

    def test_concurrent_remote_commit_is_preserved(self):
        other = self.root / "other"
        self.git(self.root, "clone", "-b", "main", str(self.remote), str(other))
        self.git(other, "config", "user.name", "Concurrent test")
        self.git(other, "config", "user.email", "concurrent@example.invalid")
        (other / "unrelated.txt").write_text("Keep this concurrent change\n")
        self.git(other, "add", "unrelated.txt")
        self.git(other, "commit", "-m", "Concurrent change")
        self.git(other, "push")
        expected_sha = self.git(other, "rev-parse", "HEAD")
        calls, delays = [], []

        def run(command, **kwargs):
            calls.append(command)
            return subprocess.run(command, cwd=self.repo, **kwargs)

        status = publisher.publish(run=run, sleep=delays.append, log=lambda _: None)
        self.assertEqual((status, len(calls), delays), (1, 1, []))
        self.assertEqual(self.git(self.remote, "rev-parse", "refs/heads/main"), expected_sha)
        self.assertEqual(self.git(self.repo, "status", "--porcelain"), "")


if __name__ == "__main__":
    unittest.main()
