"""
db.py - 데이터베이스 연결 및 초기화 (리팩토링)
locomoco 포트폴리오 웹사이트
"""

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, scoped_session
import os
from typing import Generator

from app.config import config
from app.database.models import Base
from app.database.seed import create_initial_data

# SQLite 엔진 생성
engine = create_engine(
    config["DATABASE_URL"],
    connect_args={
        "check_same_thread": False
    },  # SQLite에서 다중 스레드 지원을 위한 설정
)


# SQLite의 외래키 제약 활성화
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()


# 세션 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db_session = scoped_session(SessionLocal)


# 데이터베이스 종속성 (FastAPI에서 사용)
def get_db() -> Generator:
    """FastAPI 엔드포인트에서 사용할 데이터베이스 세션 제공"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 데이터베이스 초기화 함수
def init_db() -> None:
    """데이터베이스 및 테이블 초기화"""
    # 모든 테이블 생성
    Base.metadata.create_all(bind=engine)

    # 세션 생성
    db = SessionLocal()

    try:
        # 초기 데이터 생성
        create_initial_data(db)
    finally:
        db.close()
