"""
Data and model provenance tracking schemas.
"""
from typing import Optional, List
from pydantic import BaseModel, Field

class ProvenanceInfo(BaseModel):
    source: str = Field(default="MODEL_REGISTRY", description="Physical data source or registry origin")
    artifact_sha256: str = Field(default="none", description="Cryptographic SHA-256 hash of loaded model artifact")
    artifact_hash: Optional[str] = Field(default=None, description="Legacy alias for artifact_sha256")
    dataset_version: Optional[str] = Field(default="tiny_pilot_v1", description="Version of dataset used for training/inference")
    model_version: Optional[str] = Field(default="0.1.0-pilot", description="Semantic or pilot model version")
    timestamp: Optional[str] = Field(default=None, description="ISO 8601 UTC timestamp of prediction generation")
    feature_set: List[str] = Field(default_factory=list, description="List of physical predictor features used")
    baseline_reference: Optional[str] = Field(default=None, description="Benchmark comparator (e.g. Coarse NWP, Persistence)")
