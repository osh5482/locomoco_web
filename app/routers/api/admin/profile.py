"""
profile.py - 프로필 이미지 관리자 API 라우터
locomoco 포트폴리오 웹사이트
"""

from fastapi import APIRouter, Depends, File, UploadFile
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.utils.security import get_current_username
from app.services import update_profile_image

router = APIRouter()


@router.post("/profile-image")
async def upload_profile_image_api(
    profile_image: UploadFile = File(...),
    username: str = Depends(get_current_username),
    db: Session = Depends(get_db),
):
    """
    프로필 이미지 업로드 API

    Args:
        profile_image: 업로드할 이미지 파일
        username: 인증된 관리자 사용자명
        db: 데이터베이스 세션

    Returns:
        JSONResponse: 업로드 결과
    """
    result = update_profile_image(db=db, profile_image=profile_image)
    return JSONResponse(content=result)
