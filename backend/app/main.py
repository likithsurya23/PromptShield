from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db.database import db_manager
from app.routes import analytics, auth, health, scan
from app.security.ml_detector import MLDetector
from app.security.scanner import PromptScanner

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize single PromptScanner instance
scanner = PromptScanner()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager:
    1. Connects to MongoDB Atlas / Local instance asynchronously.
    2. Loads PromptShield DistilBERT V2 once into memory during startup.
    3. Handles graceful cleanup on shutdown.
    """
    logger.info("Initializing PromptShield Security Engine...")

    # 1. Connect to MongoDB
    await db_manager.connect()

    # 2. Load ML detector
    try:
        detector = MLDetector()
        scanner.set_ml_detector(detector)
        app.state.scanner = scanner
        app.state.model_loaded = True
        logger.info("PromptShield DistilBERT V2 model loaded and ready for inference.")
    except Exception as e:
        logger.error(f"Failed to load ML Detector at startup: {e}")
        app.state.scanner = scanner
        app.state.model_loaded = False

    yield

    # Cleanup
    logger.info("Shutting down PromptShield Security Engine...")
    await db_manager.close()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="PromptShield — LLM Prompt-Injection Firewall, Security Engine, and Audit API",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration
origins = [
    settings.FRONTEND_URL,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers under /api/v1
app.include_router(health.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1")
app.include_router(scan.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")


@app.get("/", tags=["Root"])
def root():
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/api/v1/health",
        "auth": "/api/v1/auth/login",
        "scans": "/api/v1/scans"
    }