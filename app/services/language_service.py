"""
language_service.py - 언어 관련 서비스
locomoco 포트폴리오 웹사이트
"""

from typing import Dict, Any
from sqlalchemy.orm import Session

from app.database.models import Language, UITranslation
from app.config import config


def get_language(db: Session, lang_code: str = None) -> Language:
    """
    언어 코드에 해당하는 언어 모델 가져오기

    Args:
        db: 데이터베이스 세션
        lang_code: 언어 코드 (ko, ja, en)

    Returns:
        Language: 언어 모델
    """
    # 언어 코드가 없으면 기본 언어 사용
    if not lang_code:
        lang_code = config["DEFAULT_LANGUAGE"]

    # 언어 ID 조회
    language = db.query(Language).filter(Language.code == lang_code).first()

    # 해당 언어가 없으면 기본 언어로
    if not language:
        language = (
            db.query(Language)
            .filter(Language.code == config["DEFAULT_LANGUAGE"])
            .first()
        )

    return language


def get_translations(db: Session, lang_code: str = None) -> Dict[str, str]:
    """
    언어 코드에 해당하는 번역 데이터 가져오기

    Args:
        db: 데이터베이스 세션
        lang_code: 언어 코드 (ko, ja, en)

    Returns:
        dict: 번역 키-값 딕셔너리
    """
    # 언어 ID 조회
    language = get_language(db, lang_code)

    # 해당 언어의 모든 번역 데이터 조회
    translations = (
        db.query(UITranslation).filter(UITranslation.language_id == language.id).all()
    )

    # 키-값 형태로 변환
    trans_dict = {t.key: t.value for t in translations}

    return trans_dict


def set_language(lang_code: str) -> Dict[str, Any]:
    """
    언어 설정 변경

    Args:
        lang_code: 언어 코드 (ko, ja, en)

    Returns:
        dict: 응답 메시지
    """
    # 지원되는 언어인지 확인
    if lang_code not in config["SUPPORTED_LANGUAGES"]:
        lang_code = config["DEFAULT_LANGUAGE"]

    return {"status": "success", "message": f"Language set to {lang_code}"}
