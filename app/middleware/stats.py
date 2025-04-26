"""
stats.py - 방문 통계 미들웨어
locomoco 포트폴리오 웹사이트
"""

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
from sqlalchemy.orm import Session
from datetime import date

from app.database.db import SessionLocal
from app.database.models import SiteStats


class StatsMiddleware(BaseHTTPMiddleware):
    """방문자 수 통계를 기록하는 미들웨어"""

    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next):
        # API 요청은 통계에서 제외
        if request.url.path.startswith("/api"):
            return await call_next(request)

        # 관리자 페이지는 통계에서 제외
        if request.url.path.startswith("/admin"):
            return await call_next(request)

        # 정적 파일은 통계에서 제외
        if request.url.path.startswith("/static"):
            return await call_next(request)

        # 페이지 ID 결정 (기본값: home)
        page_id = "home"

        if request.url.path.startswith("/work"):
            page_id = "work"
        elif request.url.path.startswith("/contact"):
            page_id = "contact"

        # 응답 먼저 처리
        response = await call_next(request)

        # 응답이 성공일 경우에만 통계 기록
        if response.status_code == 200:
            await self._record_visit(page_id)

        return response

    async def _record_visit(self, page_id: str):
        """페이지 방문 통계 기록"""
        # 세션 시작
        db = SessionLocal()

        try:
            # 오늘 날짜 가져오기
            today = date.today()

            # 오늘 해당 페이지에 대한 통계 기록 찾기
            stat = (
                db.query(SiteStats)
                .filter(SiteStats.visit_date == today, SiteStats.page_id == page_id)
                .first()
            )

            # 있으면 업데이트, 없으면 새로 생성
            if stat:
                stat.visit_count += 1
            else:
                new_stat = SiteStats(visit_date=today, page_id=page_id, visit_count=1)
                db.add(new_stat)

            db.commit()
        except Exception as e:
            db.rollback()
            print(f"방문 통계 기록 오류: {e}")
        finally:
            db.close()
