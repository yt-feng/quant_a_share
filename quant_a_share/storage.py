from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from .config import STATE_DIR, ensure_dirs


def _path(name: str) -> Path:
    ensure_dirs()
    return STATE_DIR / name


def read_json(name: str, default: Any) -> Any:
    path = _path(name)
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return default


def write_json(name: str, value: Any) -> None:
    path = _path(name)
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def get_watchlists() -> dict[str, list[str]]:
    return read_json("watchlists.json", {"全部": []})


def save_watchlists(data: dict[str, list[str]]) -> None:
    if "全部" not in data:
        data = {"全部": [], **data}
    write_json("watchlists.json", data)


def get_strategies() -> list[dict[str, Any]]:
    return read_json("strategies.json", [])


def save_strategies(data: list[dict[str, Any]]) -> None:
    write_json("strategies.json", data)


def get_qimen_jobs() -> list[dict[str, Any]]:
    return read_json("qimen_jobs.json", [])


def save_qimen_jobs(data: list[dict[str, Any]]) -> None:
    write_json("qimen_jobs.json", data)


def get_wallet() -> dict[str, Any]:
    return read_json(
        "wallet.json",
        {
            "points": 100.0,
            "frozen": 0.0,
            "charged": 100.0,
            "spent": 0.0,
            "orders": [],
        },
    )


def save_wallet(data: dict[str, Any]) -> None:
    write_json("wallet.json", data)
