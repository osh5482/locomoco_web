"""
config.py - 설정 관리 모듈
locomoco 포트폴리오 웹사이트
"""

import os
from pathlib import Path
from typing import Dict, Any

# 프로젝트 루트 디렉토리 설정
BASE_DIR = Path(__file__).resolve().parent.parent

# 기본 설정값
DEFAULT_CONFIG = {
    # 데이터베이스 설정
    "DATABASE_URL": f"sqlite:///{BASE_DIR}/locomoco.db",
    # 관리자 인증 설정
    "ADMIN_USERNAME": "locomoco",
    "ADMIN_PASSWORD": "admin123",
    # 파일 업로드 설정
    "UPLOAD_DIR": str(BASE_DIR / "app" / "static" / "assets" / "images"),
    "ALLOWED_EXTENSIONS": [".jpg", ".jpeg", ".png"],
    "MAX_UPLOAD_SIZE": 5 * 1024 * 1024,  # 5MB
    # 언어 설정
    "DEFAULT_LANGUAGE": "ko",
    "SUPPORTED_LANGUAGES": ["ko", "ja", "en"],
}


# 환경 변수에서 설정값 가져오기
def get_config() -> Dict[str, Any]:
    """
    환경 변수 또는 기본값에서 설정값 가져오기
    """
    config = DEFAULT_CONFIG.copy()

    # 환경 변수에서 값 가져와 덮어쓰기
    for key in config:
        env_key = f"LOCOMOCO_{key}"
        if env_key in os.environ:
            config[key] = os.environ[env_key]

    return config


# 공통 경로 정의
def get_paths() -> Dict[str, Path]:
    """
    애플리케이션에 필요한 경로들 반환
    """
    profile_dir = Path(DEFAULT_CONFIG["UPLOAD_DIR"]) / "profile"
    portfolio_dir = Path(DEFAULT_CONFIG["UPLOAD_DIR"]) / "portfolio"

    # 디렉토리 존재 확인 및 생성
    profile_dir.mkdir(parents=True, exist_ok=True)
    portfolio_dir.mkdir(parents=True, exist_ok=True)

    return {
        "base_dir": BASE_DIR,
        "static_dir": BASE_DIR / "app" / "static",
        "template_dir": BASE_DIR / "app" / "templates",
        "profile_dir": profile_dir,
        "portfolio_dir": portfolio_dir,
    }


# 설정 인스턴스
config = get_config()
paths = get_paths()
