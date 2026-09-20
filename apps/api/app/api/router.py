from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.models.schemas import (
    RepositoryAnalysis, DependencyGraph, ImpactRequest, ImpactReport,
    ArchaeologyRequest, ArchaeologyReport
)
from app.services.analysis_service import AnalysisService
from app.search.opensearch_client import opensearch_engine

router = APIRouter(prefix="/api")

@router.post("/repositories/analyze", response_model=RepositoryAnalysis)
def analyze_repository(repo_path: Optional[str] = None):
    try:
        return AnalysisService.analyze_repository(repo_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/repositories/demo", response_model=RepositoryAnalysis)
def get_demo_repository():
    try:
        return AnalysisService.analyze_repository(None)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/investigations/impact", response_model=ImpactReport)
def investigate_impact(req: ImpactRequest):
    try:
        return AnalysisService.investigate_impact(req)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/investigations/archaeology", response_model=ArchaeologyReport)
def investigate_archaeology(req: ArchaeologyRequest):
    try:
        return AnalysisService.investigate_archaeology(req)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/evidence/search")
def search_evidence(query: str = Query(..., min_length=1), limit: int = 10):
    return opensearch_engine.search_evidence(query, limit)
