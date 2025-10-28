from fastapi import APIRouter
from app.api.routes import comment, edit, explain, deploy, compile, parse, get_vulnerability, gen_deploy_code

api_router = APIRouter()
api_router.include_router(comment.router, prefix="/comment", tags=["comment"])
api_router.include_router(edit.router, prefix="/edit", tags=["edit"])
api_router.include_router(explain.router, prefix="/explain", tags=["explain"])
api_router.include_router(gen_deploy_code.router, prefix="/generatedeploycode", tags=["generatedeploycode"])
api_router.include_router(deploy.router, prefix="/deploy", tags=["deploy"])
api_router.include_router(compile.router, prefix="/compile", tags=["compile"])
api_router.include_router(parse.router, prefix="/parse-solidity", tags=["parse-solidity"])
api_router.include_router(get_vulnerability.router, prefix="/get-vulnerability", tags=["get-vulnerability"])