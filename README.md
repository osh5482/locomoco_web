# locomoco 포트폴리오 웹사이트

이 프로젝트는 비디오 프리랜서 locomoco의 포트폴리오 웹사이트로, FastAPI와 SQLite를 사용하여 구축되었습니다.

## 프로젝트 구조

```
app/
├── __init__.py
├── main.py                   # FastAPI 애플리케이션 진입점
├── database/                 # 데이터베이스 관련 코드
│   ├── __init__.py
│   ├── db.py                 # 데이터베이스 연결 및 초기화
│   └── models.py             # SQLAlchemy 모델
├── static/                   # 정적 파일 (CSS, JS, 이미지 등)
│   ├── css/
│   │   ├── main.css          # 메인 스타일시트
│   │   ├── about.css         # About 페이지 스타일
│   │   ├── work.css          # Work 페이지 스타일
│   │   ├── contact.css       # Contact 페이지 스타일
│   │   ├── work_detail.css   # 작품 상세 페이지 스타일
│   │   └── admin.css         # 관리자 페이지 스타일
│   ├── js/
│   │   ├── main.js           # 메인 자바스크립트
│   │   ├── language.js       # 다국어 지원 스크립트
│   │   ├── work.js           # Work 페이지 스크립트
│   │   ├── contact.js        # Contact 페이지 스크립트
│   │   └── admin.js          # 관리자 페이지 스크립트
│   └── assets/
│       └── images/
│           ├── profile/
│           │   └── locomoco_main.jpg  # 프로필 이미지
│           └── portfolio/
│               ├── thumb_sample1.jpg  # 포트폴리오 썸네일 샘플
│               └── thumb_sample2.jpg  # 포트폴리오 썸네일 샘플
└── templates/                # Jinja2 템플릿
    ├── index.html            # 메인 페이지 (About) 템플릿
    ├── work.html             # Work 페이지 템플릿
    ├── work_detail.html      # 작품 상세 페이지 템플릿
    ├── contact.html          # Contact 페이지 템플릿
    └── admin.html            # 관리자 페이지 템플릿
```

## 데이터베이스 구조

이 프로젝트는 SQLite와 SQLAlchemy를 사용하여 다음과 같은 데이터베이스 테이블을 관리합니다:

1. `languages` - 지원하는 언어 정보 (한국어, 일본어, 영어)
2. `about_contents` - About 페이지의 다국어 콘텐츠
3. `profile_images` - 프로필 이미지 관리
4. `work_categories` - 작품 카테고리 (커버 영상, 쇼츠 등)
5. `works` - 포트폴리오 작품 정보
6. `ui_translations` - UI 텍스트의 다국어 번역
7. `site_stats` - 사이트 방문 통계
8. `activity_logs` - 관리자 활동 로그

## 설치 및 실행 방법

### 필수 요구사항

- Python 3.8 이상
- FastAPI
- SQLAlchemy
- Uvicorn
- Jinja2
- Python-multipart (파일 업로드용)

### 설치

1. 필요한 패키지 설치:

```bash
pip install -r requirements.txt
```

2. 프로젝트 디렉토리 구조 생성:

```bash
mkdir -p app/static/{css,js,assets/images/{profile,portfolio}}
mkdir -p app/templates
mkdir -p app/database
```

3. 제공된 파일들을 각 디렉토리에 복사

4. 필요한 이미지 파일 준비:
   - `locomoco_main.jpg` 이미지 파일을 `app/static/assets/images/profile/` 디렉토리에 복사
   - 썸네일 이미지 파일을 `app/static/assets/images/portfolio/` 디렉토리에 복사

### 실행

다음 명령어로 FastAPI 애플리케이션을 실행합니다:

```bash
# 프로젝트 루트 디렉토리에서 실행
uvicorn app.main:app --reload
```

서버가 실행되면 브라우저에서 http://localhost:8000 으로 접속하여 웹사이트를 확인할 수 있습니다.

## 관리자 페이지 접근

1. http://localhost:8000/admin 으로 접속
2. 기본 인증 창이 표시되면 다음 정보로 로그인:
   - 사용자 이름: locomoco
   - 비밀번호: admin123

> **주의**: 실제 배포 시에는 반드시 사용자 이름과 비밀번호를 변경하고, 환경 변수나 안전한 설정 파일을 통해 관리해야 합니다.

## 웹사이트 기능

### 주요 기능

1. **메인 페이지 (About)**: locomoco의 약력과 제작 영상 소개
2. **작품 목록 페이지 (Work)**: 포트폴리오 작품 그리드 형태로 표시
3. **작품 상세 페이지 (/work/{id})**: 개별 작품의 상세 정보, 유튜브 임베드, 설명, 관련 작품 표시
4. **연락처 페이지 (Contact)**: 문의 폼 제공

### 관리자 기능

- **대시보드**: 기본 통계 정보 및 사이트 활동 내역 표시
- **About 페이지 관리**: 다국어(한국어, 일본어, 영어) 프로필 정보 및 이미지 수정
- **Work 목록 관리**: 포트폴리오 작업물 추가, 편집, 삭제
- **다국어 지원**: 한국어, 일본어, 영어 지원

## API 엔드포인트

- **페이지 라우트**:

  - `/` - 메인 페이지 (About)
  - `/work` - 작품 목록 페이지
  - `/work/{work_id}` - 작품 상세 페이지
  - `/contact` - 연락처 페이지
  - `/admin` - 관리자 페이지

- **API 엔드포인트**:
  - `/api/set-language` - 사용자 언어 설정 변경
  - `/api/admin/about` - About 페이지 콘텐츠 업데이트
  - `/api/admin/profile-image` - 프로필 이미지 업로드
  - `/api/admin/work` - 작품 추가 또는 수정
  - `/api/admin/work/{work_id}` - 작품 정보 조회 또는 삭제

## 기술 스택

- **백엔드**: FastAPI, Python 3.8+, SQLAlchemy, SQLite
- **프론트엔드**: HTML, CSS, JavaScript
- **템플릿 엔진**: Jinja2
- **인증**: HTTP Basic Authentication

## 추가 구현 예정 기능

1. **OAuth 인증**: 더 안전한 관리자 인증 시스템
2. **파일 관리 개선**: 이미지 크기 최적화 및 포맷 변환
3. **통계 기능 확장**: 상세 방문자 분석 및 인기 콘텐츠 분석
4. **작품 순서 변경**: 드래그 앤 드롭으로 작품 표시 순서 변경
5. **백업 및 복원**: 데이터베이스 백업 및 복원 기능

## 참고 사항

이 프로젝트는 WYSIWYG 방식의 관리자 기능을 제공하여 코딩 지식 없이도 웹사이트 콘텐츠를 쉽게 관리할 수 있습니다.
