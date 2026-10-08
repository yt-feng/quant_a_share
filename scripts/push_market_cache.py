"""Publish an already committed snapshot, retrying explicit GitHub server errors.

Retries reuse the same commit and the repository's existing push destination.
Transport, authentication, policy and branch-divergence failures stop immediately.
"""

import re
import subprocess
import sys
import time


SERVER_ERROR = re.compile(
    r"remote:\s*Internal Server Error"
    r"|\[remote rejected\].*\(Internal Server Error\)"
    r"|(?:requested URL returned error:|RPC failed; HTTP)\s*(?:500|502|503|504)\b",
    re.IGNORECASE,
)
NON_RETRYABLE = re.compile(
    r"non-fast-forward|fetch first|authentication failed|permission denied"
    r"|protected branch|repository rule|GH013|GH006|pre-receive hook declined"
    r"|could not resolve|failed to connect|timed? out|timeout"
    r"|SSL|TLS|certificate|HTTP\s*(?:401|403)|error:\s*(?:401|403)",
    re.IGNORECASE,
)
RETRY_DELAYS = (10, 30)


def publish(*, run=subprocess.run, sleep=time.sleep, log=print):
    """Return a process exit status without rebuilding, rebasing or force pushing."""
    for attempt in range(len(RETRY_DELAYS) + 1):
        try:
            result = run(
                ["git", "push"], capture_output=True, text=True,
                timeout=120, check=False,
            )
        except (OSError, subprocess.TimeoutExpired) as error:
            log(f"Snapshot publication stopped: {error}")
            return 1

        output = f"{result.stdout or ''}\n{result.stderr or ''}"
        if output.strip():
            log(output.rstrip())
        if result.returncode == 0:
            log(f"Snapshot published (push attempt {attempt + 1}).")
            return 0

        if not SERVER_ERROR.search(output) or NON_RETRYABLE.search(output):
            log("Snapshot publication stopped; this failure is not a GitHub server error.")
            return 1
        if attempt == len(RETRY_DELAYS):
            log("Snapshot publication failed after 3 attempts; keep the recovery artifact.")
            return 1
        delay = RETRY_DELAYS[attempt]
        log(f"GitHub server error; retrying the same snapshot push in {delay}s.")
        sleep(delay)
    return 1


if __name__ == "__main__":
    sys.exit(publish())
