"""
Kisaan Ki Yash - Backend Application Entrypoint.
FastAPI REST service powering the 10-model agricultural intelligence stack.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.app.config import settings
from backend.app.infrastructure.logging import logger
from backend.app.services.model_registry import model_registry

# Route imports
from backend.app.api.routes.health import router as health_router
from backend.app.api.routes.models import router as models_router
from backend.app.api.routes.predictions import router as predictions_router
from backend.app.api.routes.grid import router as grid_router
from backend.app.api.routes.panchayat import router as panchayat_router
from backend.app.api.routes.weather import router as weather_router
from backend.app.api.routes.precipitation import router as precipitation_router
from backend.app.api.routes.soil import router as soil_router
from backend.app.api.routes.crop import router as crop_router
from backend.app.api.routes.irrigation import router as irrigation_router
from backend.app.api.routes.yield_forecast import router as yield_router
from backend.app.api.routes.hazards import router as hazards_router
from backend.app.api.routes.flood import router as flood_router
from backend.app.api.routes.decisions import router as decisions_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Verify integrity of all frozen model artifacts
    logger.info("[STARTUP] Initializing Kisaan Ki Yash Intelligence Backend...")
    verification = model_registry.verify_frozen_artifacts()
    logger.info(f"[STARTUP] Frozen artifact verification status: {verification}")
    yield
    # Shutdown
    logger.info("[SHUTDOWN] Terminating Kisaan Ki Yash Intelligence Backend.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "1-km Hyperlocal Agricultural & Climate Intelligence Platform REST API. "
        "Enforces strict data provenance, uncertainty bounds, spatial CRS standards (EPSG:32644), "
        "and sequential model lifecycle governance."
    ),
    lifespan=lifespan
)

# Enable CORS for the React/Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API v1 routes
prefix = settings.API_V1_PREFIX
app.include_router(health_router, prefix=prefix)
app.include_router(models_router, prefix=prefix)
app.include_router(predictions_router, prefix=prefix)
app.include_router(grid_router, prefix=prefix)
app.include_router(panchayat_router, prefix=prefix)
app.include_router(weather_router, prefix=prefix)
app.include_router(precipitation_router, prefix=prefix)
app.include_router(soil_router, prefix=prefix)
app.include_router(crop_router, prefix=prefix)
app.include_router(irrigation_router, prefix=prefix)
app.include_router(yield_router, prefix=prefix)
app.include_router(hazards_router, prefix=prefix)
app.include_router(flood_router, prefix=prefix)
app.include_router(decisions_router, prefix=prefix)

@app.get("/")
def root():
    return {
        "message": "Welcome to Kisaan Ki Yash 1-km Intelligence API",
        "docs_url": "/docs",
        "health_url": f"{prefix}/health",
        "models_url": f"{prefix}/models"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
