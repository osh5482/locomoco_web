from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path

# FastAPI 앱 인스턴스 생성
app = FastAPI(title="locomoco Portfolio")

# 템플릿 및 정적 파일 디렉토리 설정
BASE_DIR = Path(__file__).resolve().parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")

# 라우트 정의
@app.get("/")
async def index(request: Request):
    """
    메인 페이지 (About) 렌더링
    """
    return templates.TemplateResponse("index.html", {"request": request})

# 추가 라우트 (나중에 구현)
@app.get("/work")
async def work(request: Request):
    # 작업 포트폴리오 페이지 (나중에 구현)
    return {"message": "Work page - Coming soon"}

@app.get("/contact")
async def contact(request: Request):
    # 연락처 페이지 (나중에 구현)
    return {"message": "Contact page - Coming soon"}

# 앱 실행 (직접 실행할 때만)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)