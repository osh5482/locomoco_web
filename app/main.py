from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import os
import secrets
from pathlib import Path

# FastAPI 앱 인스턴스 생성
app = FastAPI(title="locomoco Portfolio")

# 템플릿 및 정적 파일 디렉토리 설정
BASE_DIR = Path(__file__).resolve().parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")

# 기본 인증 설정 (임시 방식, 실제로는 환경 변수나 설정 파일에서 로드해야 함)
security = HTTPBasic()


def get_current_username(credentials: HTTPBasicCredentials = Depends(security)):
    # 여기서는 간단히 하드코딩된 사용자 이름/비밀번호를 사용 (실제로는 더 안전한 방법 사용)
    correct_username = "locomoco"
    correct_password = "admin123"

    # 사용자 이름과 비밀번호 검증 (보안을 위해 timing-attack 방지 로직 사용)
    is_username_correct = secrets.compare_digest(credentials.username, correct_username)
    is_password_correct = secrets.compare_digest(credentials.password, correct_password)

    if not (is_username_correct and is_password_correct):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="잘못된 사용자 이름 또는 비밀번호",
            headers={"WWW-Authenticate": "Basic"},
        )

    return credentials.username


# 라우트 정의
@app.get("/")
async def index(request: Request):
    """
    메인 페이지 (About) 렌더링
    """
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/admin")
async def admin(request: Request, username: str = Depends(get_current_username)):
    """
    관리자 페이지 렌더링 - 기본 인증 필요
    """
    return templates.TemplateResponse(
        "admin.html", {"request": request, "username": username}
    )


@app.get("/work")
async def work(request: Request):
    """
    작품 포트폴리오 페이지 렌더링
    """
    return templates.TemplateResponse("work.html", {"request": request})


@app.get("/contact")
async def contact(request: Request):
    """
    연락처 페이지 렌더링
    """
    return templates.TemplateResponse("contact.html", {"request": request})


# 폼 데이터 처리용 모델 (나중에 구현)
# from pydantic import BaseModel, EmailStr
#
# class ContactForm(BaseModel):
#     name: str
#     email: EmailStr
#     phone: str = None
#     message: str
#
# @app.post("/api/contact")
# async def submit_contact(contact_data: ContactForm):
#     """
#     연락처 폼 제출 처리 (나중에 구현)
#     """
#     # 이메일 전송 또는 DB 저장 구현
#     return {"status": "success", "message": "메시지가 성공적으로 전송되었습니다."}

# 앱 실행 (직접 실행할 때만)
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
