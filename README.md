# locomoco 포트폴리오 웹사이트

## 프로젝트 개요

locomoco의 프리랜서 포트폴리오 웹사이트입니다. 깔끔하고 미니멀한 디자인으로 제작된 이 웹사이트는 영상 작품을 중심으로 한 포트폴리오를 효과적으로 보여주는 것을 목적으로 합니다.

## 주요 기능

- **다국어 지원**: 한국어, 일본어, 영어 지원 (실시간 언어 전환)
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 등 다양한 기기에 최적화
- **포트폴리오 관리**: 작품 등록, 수정, 삭제 기능 (관리자 페이지)
- **유튜브 영상 연동**: 포트폴리오 작품은 유튜브 영상과 연동
- **문의 양식**: 방문자가 직접 문의할 수 있는 기능

## 기술 스택

- HTML5 / CSS3 / JavaScript (ES6+)
- 외부 라이브러리 사용 없음 (순수 HTML/CSS/JS로 구현)
- Google Fonts (Noto Sans KR, Noto Sans JP, Poppins)
- YouTube Embed API

## 설치 및 실행 방법

### 로컬 환경에서 실행

1. 저장소 클론

```bash
git clone https://github.com/yourusername/locomoco.git
cd locomoco
```

2. 웹 서버로 실행
   로컬 웹 서버를 사용하여 실행할 수 있습니다. 예를 들어, Python을 사용할 경우:

```bash
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

3. 브라우저에서 접속

```
http://localhost:8000
```

### 웹 호스팅에 배포

- 모든 파일을 웹 호스팅 서버에 업로드하면 됩니다.
- 특별한 서버 사이드 기능이 필요하지 않으므로 정적 웹 호스팅 서비스(GitHub Pages, Netlify 등)에도 배포 가능합니다.

## 사용자 가이드

### 방문자

- **About 페이지**: locomoco의 소개와 제작 영상 정보 확인
- **Work 페이지**: 포트폴리오 작품 목록 확인 및 세부 작품 페이지 접근
- **Contact 페이지**: 문의 사항 전송

### 관리자

- 관리자 페이지 접근: `/admin` 경로로 접속
- 로그인 후 다음 기능 사용 가능:
  - About 페이지 콘텐츠 수정
  - 포트폴리오 작품 관리 (추가/수정/삭제)
  - 문의 내역 확인

## 개발 가이드

### 파일 구조

이 프로젝트는 다음과 같은 파일 구조를 가집니다:

```
locomoco/                  # 루트 디렉토리
│
├── index.html             # About 페이지 (메인 페이지)
├── work.html              # Work/포트폴리오 페이지
├── contact.html           # Contact 페이지
│
├── work/                  # 개별 작업 샘플 페이지
│   ├── sample1.html
│   ├── sample2.html
│   └── sample3.html
│
├── admin/                 # 관리자 영역
│   ├── index.html         # 관리자 로그인/대시보드
│   ├── edit_about.html    # About 페이지 편집
│   ├── manage_work.html   # 포트폴리오 항목 관리
│   └── settings.html      # 사이트 설정
│
├── assets/                # 정적 자산
│   ├── images/            # 이미지
│   │   ├── profile/       # 프로필 이미지
│   │   │   └── locomoco_main.jpg
│   │   ├── portfolio/     # 포트폴리오 썸네일
│   │   │   ├── thumb_sample1.jpg
│   │   │   ├── thumb_sample2.jpg
│   │   │   └── thumb_sample3.jpg
│   │   └── ui/            # UI 요소
│   │       ├── icon_play.svg
│   │       └── logo.svg
│   │
│   ├── videos/            # 비디오 파일 (로컬 저장 시)
│   │   └── gif/           # 작업 샘플용 GIF 썸네일
│   │       ├── preview_sample1_1.gif
│   │       ├── preview_sample1_2.gif
│   │       ├── preview_sample1_3.gif
│   │       └── preview_sample1_4.gif
│   │
│   ├── fonts/             # 커스텀 폰트
│   │   ├── notosans_kr.woff2
│   │   ├── notosans_jp.woff2
│   │   └── poppins.woff2
│   │
│   └── icons/             # 아이콘 파일
│       ├── arrow_right.svg
│       ├── email.svg
│       └── youtube.svg
│
├── css/                   # CSS 파일
│   ├── main.css           # 메인 스타일시트
│   ├── about.css          # About 페이지 특정 스타일
│   ├── work.css           # Work 페이지 특정 스타일
│   ├── work_detail.css    # 개별 작업 페이지 스타일
│   ├── contact.css        # Contact 페이지 특정 스타일
│   ├── admin.css          # 관리자 영역 스타일
│   └── responsive.css     # 반응형 디자인 스타일
│
├── js/                    # JavaScript 파일
│   ├── main.js            # 메인 JavaScript 파일
│   ├── language.js        # 언어 전환 기능
│   ├── portfolio.js       # 포트폴리오/work 페이지 기능
│   ├── work_detail.js     # 개별 작업 페이지 기능
│   ├── contact_form.js    # 문의 양식 처리
│   ├── admin_main.js      # 관리자 공통 기능
│   ├── admin_auth.js      # 관리자 인증 기능
│   ├── admin_work.js      # 관리자 작품 관리 기능
│   └── admin_about.js     # 관리자 About 페이지 관리 기능
│
├── locales/               # 지역화 파일
│   ├── ko/                # 한국어 번역
│   │   └── translations.json
│   ├── en/                # 영어 번역
│   │   └── translations.json
│   └── ja/                # 일본어 번역
│       └── translations.json
│
└── config/                # 구성 파일
    ├── site_config.js     # 사이트 전체 구성
    ├── youtube_api.js     # YouTube API 연동 설정
    └── router.js          # 클라이언트 라우팅 구성
```

### 파일 네이밍 규칙

- 모든 파일과 폴더명은 언더스코어(`_`)를 사용하여 단어를 구분합니다.
- 각 파일은 고유한 이름을 가지며, 중복되는 이름이 없어야 합니다.
- CSS와 JS 파일은 관련된 HTML 페이지나 기능에 맞게 이름을 지정합니다.

### 다국어 지원

다국어 지원은 `locales` 디렉토리 내의 JSON 파일을 통해 관리됩니다. 각 번역 키는 다음 형식을 따릅니다:

```
"section.element.attribute": "번역된 텍스트"
```

### 포트폴리오 확장

새 포트폴리오 작품을 추가하려면:

1. `work/sample{n}.html` 파일 생성
2. 필요한 이미지/GIF 파일 추가
3. `work.html`에 썸네일 및 링크 추가
4. 각 언어별 번역 키 추가

## 문제 해결

### 언어 전환 문제

- 브라우저의 localStorage가 비활성화된 경우 언어 설정이 저장되지 않을 수 있습니다.
- 이 경우 매 방문 시 기본 언어(한국어)로 설정됩니다.

### 관리자 로그인 문제

- 쿠키가 차단된 경우 로그인 상태가 유지되지 않을 수 있습니다.
- 브라우저 설정에서 쿠키 허용 필요

## 연락처 및 지원

본 포트폴리오 웹사이트에 관한 문의나 개발 지원이 필요한 경우:

- 이메일: [contact@locomoco.com](mailto:contact@locomoco.com)
- 웹사이트: [www.locomoco.com/contact](https://www.locomoco.com/contact)

## 라이센스

© 2025 locomoco. All Rights Reserved.
이 웹사이트의 디자인 및 코드는 locomoco의 자산으로, 무단 복제 및 배포를 금지합니다.
