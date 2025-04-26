"""
security.py - 인증 관련 유틸리티
locomoco 포트폴리오 웹사이트
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import secrets

from app.config import config

# 기본 인증 설정
security = HTTPBasic()


def get_current_username(credentials: HTTPBasicCredentials = Depends(security)) -> str:
    """
    HTTP 기본 인증을 통해 현재 사용자 이름 확인

    Args:
        credentials: HTTP Basic Auth 자격 증명

    Returns:
        str: 인증된 사용자 이름

    Raises:
        HTTPException: 인증 실패시 401 오류
    """
    # 설정에서 관리자 자격 증명 가져오기
    correct_username = config["ADMIN_USERNAME"]
    correct_password = config["ADMIN_PASSWORD"]

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
