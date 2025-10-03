from fastapi import APIRouter
from app.api.routes import comment, edit, explain, deploy, compile

api_router = APIRouter()
api_router.include_router(comment.router, prefix="/comment", tags=["comment"])
api_router.include_router(edit.router, prefix="/edit", tags=["edit"])
api_router.include_router(explain.router, prefix="/explain", tags=["explain"])
api_router.include_router(deploy.router, prefix="/deploy", tags=["deploy"])
api_router.include_router(compile.router, prefix="/compile", tags=["compile"])
# api_router.include_router(assets.router, prefix="/assets", tags=["assets"])
# api_router.include_router(addresses.router, prefix="/addresses", tags=["addresses"])