"""
db.py - 데이터베이스 연결 및 초기화
locomoco 포트폴리오 웹사이트
"""

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base
from pathlib import Path
import os
from datetime import datetime

from app.database.models import (
    Base,
    Language,
    AboutContent,
    WorkCategory,
    ProfileImage,
    Work,
    UITranslation,
)

# 프로젝트 루트 디렉토리 설정
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# 데이터베이스 파일 경로
DATABASE_URL = f"sqlite:///{BASE_DIR}/locomoco.db"

# SQLite 엔진 생성
engine = create_engine(
    DATABASE_URL,
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
def get_db():
    """FastAPI 엔드포인트에서 사용할 데이터베이스 세션 제공"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 초기 데이터 생성
def create_initial_data(db):
    """데이터베이스에 초기 데이터 삽입"""

    # 1. 언어 데이터 생성
    languages = [
        Language(code="ko", name="한국어"),
        Language(code="ja", name="日本語"),
        Language(code="en", name="English"),
    ]

    # 데이터베이스에 언어 추가
    for lang in languages:
        # 이미 존재하는지 확인
        existing_lang = db.query(Language).filter_by(code=lang.code).first()
        if not existing_lang:
            db.add(lang)

    db.commit()

    # 언어 ID 조회
    ko_lang = db.query(Language).filter_by(code="ko").first()
    ja_lang = db.query(Language).filter_by(code="ja").first()
    en_lang = db.query(Language).filter_by(code="en").first()

    # 2. About 페이지 콘텐츠 생성
    # 한국어 About 콘텐츠
    ko_about = db.query(AboutContent).filter_by(language_id=ko_lang.id).first()
    if not ko_about:
        ko_about = AboutContent(
            language_id=ko_lang.id,
            biography_title="약력",
            biography_content="""안녕하세요, locomoco입니다.

저는 다양한 장르의 커버 영상과 창작 영상을 제작하는 프리랜서 크리에이터입니다.

2018년부터 유튜브를 통해 작업물을 공유해왔으며, 특히 감성적인 영상 연출에 큰 관심을 가지고 있습니다.

현재까지 다양한 아티스트와 협업하여 50개 이상의 프로젝트를 완료했습니다.""",
            video_desc_title="제작 영상 소개",
            video_desc_content="""제가 주로 제작하는 영상은 다음과 같습니다:

• 노래 커버 영상 (뮤직비디오 스타일)
• 짧은 형식의 콘텐츠 (Youtube Shorts)
• 아티스트 프로모션 영상
• 감성적인 스토리텔링 영상

각 영상마다 아티스트의 개성과 곡의 분위기에 맞는 색감과 연출을 추구합니다.""",
        )
        db.add(ko_about)

    # 일본어 About 콘텐츠
    ja_about = db.query(AboutContent).filter_by(language_id=ja_lang.id).first()
    if not ja_about:
        ja_about = AboutContent(
            language_id=ja_lang.id,
            biography_title="経歴",
            biography_content="""こんにちは、locomocoです。

私は様々なジャンルのカバー映像と創作映像を制作するフリーランスクリエイターです。

2018年からYouTubeを通じて作品を共有してきており、特に感性的な映像演出に大きな関心を持っています。

現在まで様々なアーティストとコラボレーションし、50以上のプロジェクトを完了しました。""",
            video_desc_title="制作映像の紹介",
            video_desc_content="""私が主に制作している映像は次の通りです：

• 歌カバー映像（ミュージックビデオスタイル）
• ショート形式のコンテンツ（YouTube Shorts）
• アーティストプロモーション映像
• 感性的なストーリーテリング映像

各映像ごとにアーティストの個性と曲の雰囲気に合った色彩と演出を追求しています。""",
        )
        db.add(ja_about)

    # 영어 About 콘텐츠
    en_about = db.query(AboutContent).filter_by(language_id=en_lang.id).first()
    if not en_about:
        en_about = AboutContent(
            language_id=en_lang.id,
            biography_title="Biography",
            biography_content="""Hello, I'm locomoco.

I'm a freelance creator who produces cover videos and original content across various genres.

I've been sharing my work on YouTube since 2018, with a particular interest in emotional visual direction.

To date, I've completed over 50 projects in collaboration with various artists.""",
            video_desc_title="Video Production Introduction",
            video_desc_content="""Here are the types of videos I mainly produce:

• Song cover videos (music video style)
• Short-form content (YouTube Shorts)
• Artist promotion videos
• Emotional storytelling videos

For each video, I strive to create visuals and direction that match the artist's personality and the mood of the song.""",
        )
        db.add(en_about)

    # 3. 작품 카테고리 생성
    categories = [
        WorkCategory(name="커버 영상", slug="cover"),
        WorkCategory(name="쇼츠", slug="shorts"),
        WorkCategory(name="프로모션", slug="promotion"),
        WorkCategory(name="스토리텔링", slug="story"),
    ]

    for category in categories:
        existing_category = db.query(WorkCategory).filter_by(slug=category.slug).first()
        if not existing_category:
            db.add(category)

    db.commit()

    # 4. 프로필 이미지 초기 데이터
    profile_image = db.query(ProfileImage).filter_by(is_current=True).first()
    if not profile_image:
        profile_image = ProfileImage(
            filename="locomoco_main.jpg",
            path="/static/assets/images/profile/locomoco_main.jpg",
            is_current=True,
        )
        db.add(profile_image)

    # 5. UI 번역 데이터 생성
    ko_translations = [
        {"key": "nav.about", "value": "ABOUT"},
        {"key": "nav.work", "value": "WORK"},
        {"key": "nav.contact", "value": "CONTACT"},
        {"key": "about.biography.title", "value": "약력"},
        {"key": "about.videoDesc.title", "value": "제작 영상 소개"},
        {"key": "work.title", "value": "WORK"},
        {"key": "work.loadMore", "value": "더 보기"},
        {"key": "contact.title", "value": "CONTACT"},
        {"key": "contact.form.name", "value": "이름"},
        {"key": "contact.form.email", "value": "이메일"},
        {"key": "contact.form.phone", "value": "연락처"},
        {"key": "contact.form.message", "value": "문의 내용"},
        {"key": "contact.form.submit", "value": "전송하기"},
    ]

    for trans in ko_translations:
        existing_trans = (
            db.query(UITranslation)
            .filter_by(language_id=ko_lang.id, key=trans["key"])
            .first()
        )
        if not existing_trans:
            db.add(
                UITranslation(
                    language_id=ko_lang.id, key=trans["key"], value=trans["value"]
                )
            )

    # 일본어, 영어 번역도 필요 시 추가 (약식으로 일부만 추가)
    ja_translations = [
        {"key": "nav.about", "value": "ABOUT"},
        {"key": "nav.work", "value": "WORK"},
        {"key": "nav.contact", "value": "CONTACT"},
    ]

    for trans in ja_translations:
        existing_trans = (
            db.query(UITranslation)
            .filter_by(language_id=ja_lang.id, key=trans["key"])
            .first()
        )
        if not existing_trans:
            db.add(
                UITranslation(
                    language_id=ja_lang.id, key=trans["key"], value=trans["value"]
                )
            )

    en_translations = [
        {"key": "nav.about", "value": "ABOUT"},
        {"key": "nav.work", "value": "WORK"},
        {"key": "nav.contact", "value": "CONTACT"},
    ]

    for trans in en_translations:
        existing_trans = (
            db.query(UITranslation)
            .filter_by(language_id=en_lang.id, key=trans["key"])
            .first()
        )
        if not existing_trans:
            db.add(
                UITranslation(
                    language_id=en_lang.id, key=trans["key"], value=trans["value"]
                )
            )

    # 6. 샘플 작품 데이터 생성
    # 카테고리 ID 조회
    cover_category = db.query(WorkCategory).filter_by(slug="cover").first()
    shorts_category = db.query(WorkCategory).filter_by(slug="shorts").first()

    # 샘플 작품이 없는 경우 생성
    work_count = db.query(Work).count()
    if work_count == 0:
        sample_works = [
            Work(
                title="작품 제목 1",
                artist="아티스트명",
                category_id=cover_category.id,
                year=2024,
                youtube_url="https://www.youtube.com/watch?v=sample1",
                thumbnail_filename="thumb_sample1.jpg",
                thumbnail_path="/static/assets/images/portfolio/thumb_sample1.jpg",
                description="작품 1에 대한 상세 설명입니다.",
                is_active=True,
                order=1,
            ),
            Work(
                title="작품 제목 2",
                artist="아티스트명",
                category_id=cover_category.id,
                year=2023,
                youtube_url="https://www.youtube.com/watch?v=sample2",
                thumbnail_filename="thumb_sample2.jpg",
                thumbnail_path="/static/assets/images/portfolio/thumb_sample2.jpg",
                description="작품 2에 대한 상세 설명입니다.",
                is_active=True,
                order=2,
            ),
            Work(
                title="작품 제목 3",
                artist="아티스트명",
                category_id=shorts_category.id,
                year=2023,
                youtube_url="https://www.youtube.com/watch?v=sample3",
                thumbnail_filename="thumb_sample3.jpg",
                thumbnail_path="/static/assets/images/portfolio/thumb_sample3.jpg",
                description="작품 3에 대한 상세 설명입니다.",
                is_active=True,
                order=3,
            ),
        ]

        for work in sample_works:
            db.add(work)

    db.commit()


# 데이터베이스 초기화 함수
def init_db():
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
