"""
main.py - FastAPI 앱 진입점 (리팩토링)
locomoco 포트폴리오 웹사이트
"""

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pathlib import Path

# 내부 모듈 가져오기
from app.database.db import init_db
from app.routers import views, admin
from app.routers.api import language
from app.routers.api.admin import about, work, profile
from app.middleware.stats import StatsMiddleware

# Base 디렉토리 설정
BASE_DIR = Path(__file__).resolve().parent

# FastAPI 앱 인스턴스 생성
app = FastAPI(title="locomoco Portfolio")

# 템플릿 설정
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

# 정적 파일 마운트
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")

# 미들웨어 추가
app.add_middleware(StatsMiddleware)

# 라우터 포함
app.include_router(views.router)
app.include_router(admin.router)
app.include_router(language.router, prefix="/api", tags=["language"])
app.include_router(about.router, prefix="/api/admin", tags=["admin", "about"])
app.include_router(work.router, prefix="/api/admin", tags=["admin", "work"])
app.include_router(profile.router, prefix="/api/admin", tags=["admin", "profile"])


# 애플리케이션 시작 시 실행
@app.on_event("startup")
def startup_event():
    # 데이터베이스 초기화
    init_db()


# 앱 실행 (직접 실행할 때만)
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
