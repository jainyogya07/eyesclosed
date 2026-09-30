"""Tiny in-memory TTL cache for hot panchayat intelligence payloads."""
from __future__ import annotations

import time
from threading import Lock
from typing import Any, Optional, Tuple

class TTLCache:
    def __init__(self, ttl_seconds: int = 45, max_items: int = 128):
        self.ttl = ttl_seconds
        self.max_items = max_items
        self._store: dict[str, Tuple[float, Any]] = {}
        self._lock = Lock()

    def get(self, key: str) -> Optional[Any]:
        now = time.monotonic()
        with self._lock:
            item = self._store.get(key)
            if not item:
                return None
            expires_at, value = item
            if expires_at < now:
                self._store.pop(key, None)
                return None
            return value

    def set(self, key: str, value: Any) -> None:
        with self._lock:
            if len(self._store) >= self.max_items:
                oldest = min(self._store.items(), key=lambda kv: kv[1][0])[0]
                self._store.pop(oldest, None)
            self._store[key] = (time.monotonic() + self.ttl, value)


twin_cache = TTLCache(ttl_seconds=45)
