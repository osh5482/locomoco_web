"""
main.py - FastAPI 앱 진입점
locomoco 포트폴리오 웹사이트
"""

from fastapi import (
    FastAPI,
    Request,
    Depends,
    HTTPException,
    status,
    Form,
    UploadFile,
    File,
)
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.orm import Session
import os
import secrets
from pathlib import Path
from typing import Optional
import shutil
from datetime import date, datetime, timedelta

# 데이터베이스 관련 임포트
from app.database.db import get_db, init_db
from app.database.models import (
    Language,
    AboutContent,
    ProfileImage,
    WorkCategory,
    Work,
    UITranslation,
    SiteStats,
    ActivityLog,
)

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


# 방문 통계 기록 미들웨어
@app.middleware("http")
async def record_visit(request: Request, call_next):
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
        # 세션 시작
        db = next(get_db())

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

    return response


# 애플리케이션 시작 시 실행
@app.on_event("startup")
def startup_event():
    # 데이터베이스 초기화
    init_db()


# 언어 설정 가져오기 함수
def get_translations(db: Session, lang_code: str = "ko"):
    # 언어 ID 조회
    language = db.query(Language).filter(Language.code == lang_code).first()

    if not language:
        # 기본값은 한국어
        language = db.query(Language).filter(Language.code == "ko").first()

    # 해당 언어의 모든 번역 데이터 조회
    translations = (
        db.query(UITranslation).filter(UITranslation.language_id == language.id).all()
    )

    # 키-값 형태로 변환
    trans_dict = {t.key: t.value for t in translations}

    return trans_dict


# 라우트 정의
@app.get("/")
async def index(request: Request, db: Session = Depends(get_db)):
    """
    메인 페이지 (About) 렌더링
    """
    # 기본 언어로 About 페이지 콘텐츠 조회
    lang_code = request.cookies.get("preferred_language", "ko")
    language = db.query(Language).filter(Language.code == lang_code).first()

    if not language:
        language = db.query(Language).filter(Language.code == "ko").first()

    about_content = (
        db.query(AboutContent).filter(AboutContent.language_id == language.id).first()
    )

    # 현재 사용 중인 프로필 이미지 조회
    profile_image = (
        db.query(ProfileImage).filter(ProfileImage.is_current == True).first()
    )

    # 언어별 번역 데이터
    translations = get_translations(db, lang_code)

    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "about_content": about_content,
            "profile_image": profile_image,
            "translations": translations,
            "current_lang": lang_code,
        },
    )


@app.get("/admin")
async def admin(
    request: Request,
    username: str = Depends(get_current_username),
    db: Session = Depends(get_db),
):
    """
    관리자 페이지 렌더링 - 기본 인증 필요
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
    today = date.today()
    week_ago = today - timedelta(days=6)

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

    # 최근 업데이트 내역
    recent_activities = (
        db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(5).all()
    )

    # 작품 목록
    works = db.query(Work).order_by(Work.order).all()

    # About 페이지 콘텐츠
    about_contents = {}
    for lang_code in ["ko", "ja", "en"]:
        language = db.query(Language).filter(Language.code == lang_code).first()
        content = (
            db.query(AboutContent)
            .filter(AboutContent.language_id == language.id)
            .first()
        )
        about_contents[lang_code] = content

    # 프로필 이미지
    profile_image = (
        db.query(ProfileImage).filter(ProfileImage.is_current == True).first()
    )

    return templates.TemplateResponse(
        "admin.html",
        {
            "request": request,
            "username": username,
            "total_works": total_works,
            "category_stats": category_stats,
            "visits_by_day": visits_by_day,
            "recent_activities": recent_activities,
            "works": works,
            "about_contents": about_contents,
            "profile_image": profile_image,
        },
    )


@app.get("/work")
async def work(request: Request, db: Session = Depends(get_db)):
    """
    작품 포트폴리오 페이지 렌더링
    """
    # 현재 언어 설정
    lang_code = request.cookies.get("preferred_language", "ko")

    # 활성화된 작품만 표시
    works = db.query(Work).filter(Work.is_active == True).order_by(Work.order).all()

    # 언어별 번역 데이터
    translations = get_translations(db, lang_code)

    return templates.TemplateResponse(
        "work.html",
        {
            "request": request,
            "works": works,
            "translations": translations,
            "current_lang": lang_code,
        },
    )


@app.get("/contact")
async def contact(request: Request, db: Session = Depends(get_db)):
    """
    연락처 페이지 렌더링
    """
    # 현재 언어 설정
    lang_code = request.cookies.get("preferred_language", "ko")

    # 언어별 번역 데이터
    translations = get_translations(db, lang_code)

    return templates.TemplateResponse(
        "contact.html",
        {"request": request, "translations": translations, "current_lang": lang_code},
    )


# API 엔드포인트 정의
@app.post("/api/set-language")
async def set_language(lang_code: str = Form(...)):
    """
    언어 설정 변경 API
    """
    response = JSONResponse(
        {"status": "success", "message": f"Language set to {lang_code}"}
    )
    response.set_cookie(
        key="preferred_language", value=lang_code, max_age=31536000
    )  # 1년 유효
    return response


# About 페이지 콘텐츠 업데이트 API
@app.post("/api/admin/about")
async def update_about(
    biography_title: str = Form(...),
    biography_content: str = Form(...),
    video_desc_title: str = Form(...),
    video_desc_content: str = Form(...),
    lang_code: str = Form(...),
    username: str = Depends(get_current_username),
    db: Session = Depends(get_db),
):
    """
    About 페이지 콘텐츠 업데이트 API
    """
    try:
        # 언어 ID 조회
        language = db.query(Language).filter(Language.code == lang_code).first()

        if not language:
            return JSONResponse(
                status_code=400,
                content={"status": "error", "message": "잘못된 언어 코드입니다."},
            )

        # 기존 콘텐츠 조회
        about_content = (
            db.query(AboutContent)
            .filter(AboutContent.language_id == language.id)
            .first()
        )

        # 업데이트 또는 새로 생성
        if about_content:
            about_content.biography_title = biography_title
            about_content.biography_content = biography_content
            about_content.video_desc_title = video_desc_title
            about_content.video_desc_content = video_desc_content
            about_content.updated_at = datetime.now()
        else:
            new_content = AboutContent(
                language_id=language.id,
                biography_title=biography_title,
                biography_content=biography_content,
                video_desc_title=video_desc_title,
                video_desc_content=video_desc_content,
            )
            db.add(new_content)

        # 활동 로그 기록
        log = ActivityLog(
            action="update",
            entity_type="about",
            entity_id=language.id,
            description=f"About 페이지 {language.name} 내용 업데이트",
        )
        db.add(log)

        db.commit()

        return JSONResponse(
            content={
                "status": "success",
                "message": f"{language.name} About 페이지가 업데이트되었습니다.",
            }
        )

    except Exception as e:
        db.rollback()
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": f"오류가 발생했습니다: {str(e)}"},
        )


# 프로필 이미지 업로드 API
@app.post("/api/admin/profile-image")
async def upload_profile_image(
    profile_image: UploadFile = File(...),
    username: str = Depends(get_current_username),
    db: Session = Depends(get_db),
):
    """
    프로필 이미지 업로드 API
    """
    try:
        # 파일 확장자 확인
        file_ext = os.path.splitext(profile_image.filename)[1].lower()
        if file_ext not in [".jpg", ".jpeg", ".png"]:
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error",
                    "message": "JPG 또는 PNG 형식의 이미지만 업로드 가능합니다.",
                },
            )

        # 파일 저장 경로
        profile_dir = BASE_DIR / "static" / "assets" / "images" / "profile"
        profile_dir.mkdir(parents=True, exist_ok=True)

        # 파일명 생성 (현재 시간 기반)
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"locomoco_profile_{timestamp}{file_ext}"
        file_path = profile_dir / filename

        # 파일 저장
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(profile_image.file, buffer)

        # 이전 프로필 이미지 비활성화
        old_profiles = (
            db.query(ProfileImage).filter(ProfileImage.is_current == True).all()
        )
        for old_profile in old_profiles:
            old_profile.is_current = False

        # 새 프로필 이미지 저장
        new_profile = ProfileImage(
            filename=filename,
            path=f"/static/assets/images/profile/{filename}",
            is_current=True,
        )
        db.add(new_profile)

        # 활동 로그 기록
        log = ActivityLog(
            action="update", entity_type="profile", description="프로필 이미지 업데이트"
        )
        db.add(log)

        db.commit()

        return JSONResponse(
            content={
                "status": "success",
                "message": "프로필 이미지가 업데이트되었습니다.",
                "image_path": f"/static/assets/images/profile/{filename}",
            }
        )

    except Exception as e:
        db.rollback()
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": f"오류가 발생했습니다: {str(e)}"},
        )


# 작품 정보 조회 API
@app.get("/api/admin/work/{work_id}")
async def get_work(
    work_id: int,
    username: str = Depends(get_current_username),
    db: Session = Depends(get_db),
):
    """
    작품 정보 조회 API
    """
    try:
        # 작품 조회
        work = db.query(Work).filter(Work.id == work_id).first()

        if not work:
            return JSONResponse(
                status_code=404,
                content={"status": "error", "message": "해당 작품을 찾을 수 없습니다."},
            )

        # 카테고리 슬러그 가져오기
        category = (
            db.query(WorkCategory).filter(WorkCategory.id == work.category_id).first()
        )
        category_slug = category.slug if category else "cover"

        # 작품 정보 반환
        return JSONResponse(
            content={
                "status": "success",
                "work": {
                    "id": work.id,
                    "title": work.title,
                    "artist": work.artist,
                    "category": category_slug,
                    "year": work.year,
                    "youtube_url": work.youtube_url,
                    "thumbnail_path": work.thumbnail_path,
                    "description": work.description,
                    "is_active": work.is_active,
                },
            }
        )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": f"오류가 발생했습니다: {str(e)}"},
        )


# 작품 추가/수정 API
@app.post("/api/admin/work")
async def add_or_update_work(
    work_id: Optional[int] = Form(None),
    title: str = Form(...),
    artist: Optional[str] = Form(None),
    category: str = Form(...),
    year: int = Form(...),
    youtube_url: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    is_active: bool = Form(True),
    thumbnail: Optional[UploadFile] = File(None),
    username: str = Depends(get_current_username),
    db: Session = Depends(get_db),
):
    """
    작품 추가 또는 수정 API
    """
    try:
        # 카테고리 ID 조회
        category_obj = (
            db.query(WorkCategory).filter(WorkCategory.slug == category).first()
        )
        if not category_obj:
            return JSONResponse(
                status_code=400,
                content={"status": "error", "message": "잘못된 카테고리입니다."},
            )

        # 썸네일 이미지 처리
        thumbnail_filename = None
        thumbnail_path = None

        if thumbnail and thumbnail.filename:
            # 파일 확장자 확인
            file_ext = os.path.splitext(thumbnail.filename)[1].lower()
            if file_ext not in [".jpg", ".jpeg", ".png"]:
                return JSONResponse(
                    status_code=400,
                    content={
                        "status": "error",
                        "message": "JPG 또는 PNG 형식의 이미지만 업로드 가능합니다.",
                    },
                )

            # 파일 저장 경로
            thumbnail_dir = BASE_DIR / "static" / "assets" / "images" / "portfolio"
            thumbnail_dir.mkdir(parents=True, exist_ok=True)

            # 파일명 생성 (작품 제목 기반)
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            thumbnail_filename = f"thumb_{timestamp}{file_ext}"
            file_path = thumbnail_dir / thumbnail_filename

            # 파일 저장
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(thumbnail.file, buffer)

            thumbnail_path = f"/static/assets/images/portfolio/{thumbnail_filename}"

        # 작품 ID가 있으면 수정, 없으면 새로 추가
        if work_id:
            # 기존 작품 조회
            work = db.query(Work).filter(Work.id == work_id).first()

            if not work:
                return JSONResponse(
                    status_code=404,
                    content={
                        "status": "error",
                        "message": "해당 작품을 찾을 수 없습니다.",
                    },
                )

            # 작품 정보 업데이트
            work.title = title
            work.artist = artist
            work.category_id = category_obj.id
            work.year = year
            work.youtube_url = youtube_url
            work.description = description
            work.is_active = is_active
            work.updated_at = datetime.now()

            # 썸네일 이미지가 업로드된 경우에만 업데이트
            if thumbnail_filename and thumbnail_path:
                work.thumbnail_filename = thumbnail_filename
                work.thumbnail_path = thumbnail_path

            action = "update"
            message = "작품이 업데이트되었습니다."

        else:
            # 최대 순서 값 조회
            max_order = db.query(Work).order_by(Work.order.desc()).first()
            new_order = 1
            if max_order:
                new_order = max_order.order + 1

            # 새 작품 생성
            work = Work(
                title=title,
                artist=artist,
                category_id=category_obj.id,
                year=year,
                youtube_url=youtube_url,
                thumbnail_filename=thumbnail_filename,
                thumbnail_path=thumbnail_path,
                description=description,
                is_active=is_active,
                order=new_order,
            )
            db.add(work)

            action = "create"
            message = "새 작품이 추가되었습니다."

        # 커밋하여 작품 ID 생성
        db.commit()

        # 활동 로그 기록
        log = ActivityLog(
            action=action,
            entity_type="work",
            entity_id=work.id,
            description=f"작품 '{title}' {action}",
        )
        db.add(log)

        db.commit()

        return JSONResponse(
            content={"status": "success", "message": message, "work_id": work.id}
        )

    except Exception as e:
        db.rollback()
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": f"오류가 발생했습니다: {str(e)}"},
        )


# 작품 삭제 API
@app.delete("/api/admin/work/{work_id}")
async def delete_work(
    work_id: int,
    username: str = Depends(get_current_username),
    db: Session = Depends(get_db),
):
    """
    작품 삭제 API
    """
    try:
        # 작품 조회
        work = db.query(Work).filter(Work.id == work_id).first()

        if not work:
            return JSONResponse(
                status_code=404,
                content={"status": "error", "message": "해당 작품을 찾을 수 없습니다."},
            )

        # 작품 제목 저장 (로그용)
        work_title = work.title

        # 작품 삭제
        db.delete(work)

        # 활동 로그 기록
        log = ActivityLog(
            action="delete",
            entity_type="work",
            entity_id=work_id,
            description=f"작품 '{work_title}' 삭제",
        )
        db.add(log)

        db.commit()

        return JSONResponse(
            content={"status": "success", "message": "작품이 삭제되었습니다."}
        )

    except Exception as e:
        db.rollback()
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": f"오류가 발생했습니다: {str(e)}"},
        )


# 앱 실행 (직접 실행할 때만)
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
