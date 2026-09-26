"""
Provenance Tracking and Inference Auditing Service for Kisaan Ki Yash.
Ensures zero-fabrication traceability for all intelligence model inferences.
"""
import datetime
from typing import List, Optional, Dict, Any
from backend.app.schemas.provenance import ProvenanceInfo
from backend.app.infrastructure.logging import log_audit_event

class ProvenanceService:
    @staticmethod
    def create_inference_provenance(
        model_id: str,
        model_version: str,
        artifact_hash: str,
        dataset_version: str,
        feature_set: List[str],
        baseline_reference: Optional[str] = None,
        source: str = "in_situ_aws",
        agent_id: str = "inference_service",
        task_id: Optional[str] = None,
        confidence: Optional[float] = None,
        result_summary: Optional[Dict[str, Any]] = None,
        status: str = "COMPLETED"
    ) -> ProvenanceInfo:
        """
        Creates an immutable provenance token and records an audit log entry.
        """
        utc_timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        provenance = ProvenanceInfo(
            dataset_version=dataset_version,
            model_version=model_version,
            artifact_sha256=artifact_hash,
            artifact_hash=artifact_hash,
            source=source if source != "in_situ_aws" else "MODEL_REGISTRY",
            timestamp=utc_timestamp,
            feature_set=feature_set,
            baseline_reference=baseline_reference
        )

        log_audit_event(
            action=f"INFERENCE_{model_id}",
            model_id=model_id,
            status=status,
            agent_id=agent_id,
            task_id=task_id or f"inf_{model_id.lower()}",
            dataset_version=dataset_version,
            model_version=model_version,
            result=result_summary or {},
            confidence=confidence
        )

        return provenance

provenance_service = ProvenanceService()
