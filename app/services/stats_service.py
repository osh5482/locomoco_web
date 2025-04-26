"""
stats_service.py - 통계 및 활동 로그 관련 서비스
locomoco 포트폴리오 웹사이트
"""

from typing import Dict, Any, List
from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session

from app.database.models import SiteStats, ActivityLog, Work, WorkCategory


def get_dashboard_stats(db: Session) -> Dict[str, Any]:
    """
    대시보드용 통계 데이터 수집

    Args:
        db: 데이터베이스 세션

    Returns:
        dict: 통계 데이터
    """
    # 전체 작품 수
    total_works = db.query(Work).count()

    # 카테고리별 작품 수
    categories = db.query(WorkCategory).all()
    category_stats = []

    for category in categories:
        count = db.query(Work).filter(Work.category_id == category.id).count()
        category_stats.append({"name": category.name, "count": count})

    # 최근 7일간 방문자 통계
    visits_by_day = get_visit_stats(db)

    # 최근 업데이트 내역
    recent_activities = (
        db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(5).all()
    )

    return {
        "total_works": total_works,
        "category_stats": category_stats,
        "visits_by_day": visits_by_day,
        "recent_activities": recent_activities,
    }


def get_visit_stats(db: Session, days: int = 7) -> List[Dict[str, Any]]:
    """
    최근 n일간 방문자 통계 조회

    Args:
        db: 데이터베이스 세션
        days: 조회할 일수

    Returns:
        list: 일별 방문자 통계
    """
    today = date.today()
    week_ago = today - timedelta(days=days - 1)

    visits_by_day = []
    current_date = week_ago

    # 일주일치 날짜 순회
    while current_date <= today:
        # 해당 날짜의 모든 페이지 방문 합계
        daily_visits = (
            db.query(SiteStats).filter(SiteStats.visit_date == current_date).all()
        )
        total_visits = sum(stat.visit_count for stat in daily_visits)

        # 요일 이름 (월, 화, 수, ...)
        day_name = current_date.strftime("%a")
        if day_name == "Mon":
            day_name = "월"
        elif day_name == "Tue":
            day_name = "화"
        elif day_name == "Wed":
            day_name = "수"
        elif day_name == "Thu":
            day_name = "목"
        elif day_name == "Fri":
            day_name = "금"
        elif day_name == "Sat":
            day_name = "토"
        elif day_name == "Sun":
            day_name = "일"

        visits_by_day.append(
            {
                "day": day_name,
                "count": total_visits,
                "date": current_date.strftime("%Y-%m-%d"),
            }
        )

        current_date += timedelta(days=1)

    return visits_by_day


def add_activity_log(
    db: Session, action: str, entity_type: str, description: str, entity_id: int = None
) -> ActivityLog:
    """
    활동 로그 추가

    Args:
        db: 데이터베이스 세션
        action: 액션 유형 (create, update, delete)
        entity_type: 엔티티 유형 (about, work 등)
        description: 로그 설명
        entity_id: 엔티티 ID

    Returns:
        ActivityLog: 생성된 활동 로그
    """
    log = ActivityLog(
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        description=description,
        created_at=datetime.now(),
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log
