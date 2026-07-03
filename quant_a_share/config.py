from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

try:
    from dotenv import load_dotenv
except ImportError:  # pragma: no cover
    load_dotenv = None


ROOT_DIR = Path(__file__).resolve().parents[1]
STATE_DIR = ROOT_DIR / ".quant_a_share"
CACHE_DIR = STATE_DIR / "cache"

if load_dotenv is not None:
    load_dotenv(ROOT_DIR / ".env")


@dataclass(frozen=True)
class AppConfig:
    tushare_token: str = os.getenv("TUSHARE_TOKEN", "").strip()
    state_dir: Path = STATE_DIR
    cache_dir: Path = CACHE_DIR


def ensure_dirs() -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
