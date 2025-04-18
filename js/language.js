/**
 * language.js - 언어 전환 기능 구현
 * locomoco 포트폴리오 웹사이트
 */

// 언어 데이터
const translations = {
  ko: {
    "nav.about": "ABOUT",
    "nav.work": "WORK",
    "nav.contact": "CONTACT",
    "about.biography.title": "약력",
    "about.biography.content": `<p>안녕하세요, locomoco입니다.</p>
            <p>저는 다양한 장르의 커버 영상과 창작 영상을 제작하는 프리랜서 크리에이터입니다.</p>
            <p>2018년부터 유튜브를 통해 작업물을 공유해왔으며, 특히 감성적인 영상 연출에 큰 관심을 가지고 있습니다.</p>
            <p>현재까지 다양한 아티스트와 협업하여 50개 이상의 프로젝트를 완료했습니다.</p>`,
    "about.videoDesc.title": "제작 영상 소개",
    "about.videoDesc.content": `<p>제가 주로 제작하는 영상은 다음과 같습니다:</p>
            <ul>
                <li>노래 커버 영상 (뮤직비디오 스타일)</li>
                <li>짧은 형식의 콘텐츠 (Youtube Shorts)</li>
                <li>아티스트 프로모션 영상</li>
                <li>감성적인 스토리텔링 영상</li>
            </ul>
            <p>각 영상마다 아티스트의 개성과 곡의 분위기에 맞는 색감과 연출을 추구합니다.</p>`,
  },
  en: {
    "nav.about": "ABOUT",
    "nav.work": "WORK",
    "nav.contact": "CONTACT",
    "about.biography.title": "Biography",
    "about.biography.content": `<p>Hello, I'm locomoco.</p>
            <p>I'm a freelance creator specializing in cover videos and creative content across various genres.</p>
            <p>Since 2018, I've been sharing my work through YouTube, with a particular focus on emotional visual direction.</p>
            <p>To date, I've completed over 50 projects in collaboration with various artists.</p>`,
    "about.videoDesc.title": "Video Production",
    "about.videoDesc.content": `<p>The types of videos I create include:</p>
            <ul>
                <li>Song cover videos (music video style)</li>
                <li>Short-form content (YouTube Shorts)</li>
                <li>Artist promotion videos</li>
                <li>Emotional storytelling videos</li>
            </ul>
            <p>For each video, I strive to capture the artist's personality and the mood of the song through appropriate color grading and direction.</p>`,
  },
  ja: {
    "nav.about": "ABOUT",
    "nav.work": "WORK",
    "nav.contact": "CONTACT",
    "about.biography.title": "略歴",
    "about.biography.content": `<p>こんにちは、locomocoです。</p>
            <p>私は様々なジャンルのカバー動画や創作動画を制作するフリーランスクリエイターです。</p>
            <p>2018年からYouTubeで作品を共有してきており、特に感性的な映像演出に大きな関心を持っています。</p>
            <p>これまでに様々なアーティストとコラボレーションし、50以上のプロジェクトを完了しました。</p>`,
    "about.videoDesc.title": "制作動画の紹介",
    "about.videoDesc.content": `<p>私が主に制作する動画は次のとおりです：</p>
            <ul>
                <li>歌カバー動画（ミュージックビデオスタイル）</li>
                <li>ショート形式のコンテンツ（YouTube Shorts）</li>
                <li>アーティストプロモーション動画</li>
                <li>感性的なストーリーテリング動画</li>
            </ul>
            <p>各動画ごとにアーティストの個性と曲の雰囲気に合った色彩と演出を追求しています。</p>`,
  },
};

// 현재 언어 설정 (기본값: 한국어)
let currentLang = "ko";

// DOM이 로드된 후 실행
document.addEventListener("DOMContentLoaded", function () {
  // 언어 버튼 이벤트 리스너 설정
  const langButtons = document.querySelectorAll(".lang-btn");
  langButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      changeLanguage(lang);

      // 활성화된 버튼 표시
      langButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // 페이지 로드 시 기본 언어로 설정
  changeLanguage(currentLang);
});

/**
 * 언어 변경 함수
 * @param {string} lang - 언어 코드 (ko, en, ja)
 */
function changeLanguage(lang) {
  if (!translations[lang]) {
    console.error("지원하지 않는 언어입니다:", lang);
    return;
  }

  currentLang = lang;

  // 언어 키를 가진 모든 요소 선택
  const elements = document.querySelectorAll("[data-lang-key]");

  // 각 요소의 텍스트 업데이트
  elements.forEach((el) => {
    const key = el.getAttribute("data-lang-key");
    if (translations[lang][key]) {
      // HTML 콘텐츠인 경우 innerHTML 사용
      if (key.includes(".content")) {
        el.innerHTML = translations[lang][key];
      } else {
        // 일반 텍스트인 경우 textContent 사용
        el.textContent = translations[lang][key];
      }
    }
  });

  // 언어에 따라 글꼴 우선순위 변경
  const html = document.documentElement;
  if (lang === "ko") {
    html.style.fontFamily =
      "'Noto Sans KR', 'Noto Sans JP', 'Poppins', sans-serif";
  } else if (lang === "ja") {
    html.style.fontFamily =
      "'Noto Sans JP', 'Noto Sans KR', 'Poppins', sans-serif";
  } else {
    html.style.fontFamily =
      "'Poppins', 'Noto Sans KR', 'Noto Sans JP', sans-serif";
  }

  // 로컬 스토리지에 언어 설정 저장
  localStorage.setItem("preferredLanguage", lang);
}

// 페이지 로드 시 저장된 언어 설정 적용
window.addEventListener("load", function () {
  const savedLang = localStorage.getItem("preferredLanguage");
  if (savedLang && translations[savedLang]) {
    currentLang = savedLang;
    changeLanguage(currentLang);

    // 해당 언어 버튼 활성화
    const langBtn = document.querySelector(
      `.lang-btn[data-lang="${currentLang}"]`
    );
    if (langBtn) {
      document
        .querySelectorAll(".lang-btn")
        .forEach((btn) => btn.classList.remove("active"));
      langBtn.classList.add("active");
    }
  }
});
