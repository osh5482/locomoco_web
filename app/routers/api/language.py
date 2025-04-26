"""
language.py - 언어 설정 API 라우터
locomoco 포트폴리오 웹사이트
"""

from fastapi import APIRouter, Form
from fastapi.responses import JSONResponse

from app.services import set_language

router = APIRouter()


@router.post("/set-language")
async def set_language_api(lang_code: str = Form(...)):
    """
    언어 설정 변경 API

    Args:
        lang_code: 언어 코드 (ko, ja, en)

    Returns:
        JSONResponse: 설정 변경 결과
    """
    response_data = set_language(lang_code)

    response = JSONResponse(response_data)

    # 쿠키 설정 (1년 유효)
    response.set_cookie(key="preferred_language", value=lang_code, max_age=31536000)

    return response
