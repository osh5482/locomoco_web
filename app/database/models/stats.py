"""
stats.py - 통계 및 활동 로그 관련 모델
locomoco 포트폴리오 웹사이트
"""

from sqlalchemy import Column, Integer, String, Date, DateTime
from datetime import datetime

from app.database.models.base import Base


class SiteStats(Base):
    """사이트 통계 테이블"""

    __tablename__ = "site_stats"

    id = Column(Integer, primary_key=True)
    visit_date = Column(Date, nullable=False)
    visit_count = Column(Integer, default=0)
    page_id = Column(String(50), nullable=False)

    def __repr__(self):
        return f"<SiteStats(visit_date='{self.visit_date}', page_id='{self.page_id}', visit_count={self.visit_count})>"


class ActivityLog(Base):
    """활동 로그 테이블"""

    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True)
    action = Column(String(50), nullable=False)  # create, update, delete
    entity_type = Column(String(50), nullable=False)  # about, work 등
    entity_id = Column(Integer)
    description = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.now)

    def __repr__(self):
        return f"<ActivityLog(action='{self.action}', entity_type='{self.entity_type}', description='{self.description}')>"
