"""
Storage utilities and cryptographic file integrity verification.
"""
import os
import hashlib
from typing import Tuple

def compute_sha256(file_path: str) -> str:
    """Calculates SHA-256 hash of a file."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(65536):
            sha256.update(chunk)
    return sha256.hexdigest()

def verify_file_integrity(file_path: str, expected_hash: str) -> Tuple[bool, str]:
    """
    Verifies that the file at file_path has the expected SHA-256 hash.
    Returns (is_valid, actual_hash).
    """
    actual_hash = compute_sha256(file_path)
    return (actual_hash == expected_hash, actual_hash)
