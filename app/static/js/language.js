/**
 * language.js - 다국어 지원 기능
 * locomoco 포트폴리오 웹사이트
 */

// 페이지 로드 완료 후 실행
document.addEventListener("DOMContentLoaded", function () {
  // 언어 버튼 클릭 이벤트 리스너 설정
  setupLanguageButtons();

  // 사용자 브라우저 언어 설정 확인하여 기본 언어 설정
  setInitialLanguage();
});

/**
 * 언어 버튼에 클릭 이벤트 리스너를 설정합니다.
 */
function setupLanguageButtons() {
  const langButtons = document.querySelectorAll(".lang-btn");

  langButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      changeLanguage(lang);

      // 활성 버튼 스타일 변경
      langButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
    });
  });
}

/**
 * 사용자 브라우저 설정에 따라 초기 언어를 설정합니다.
 */
function setInitialLanguage() {
  // 브라우저의 언어 설정 가져오기
  const browserLang = navigator.language || navigator.userLanguage;

  // 기본 언어 설정 (ko, ja, en 중 하나)
  let defaultLang = "ko"; // 한국어를 기본값으로 설정

  // 브라우저 언어가 일본어인 경우
  if (browserLang.startsWith("ja")) {
    defaultLang = "ja";
  }
  // 브라우저 언어가 영어인 경우
  else if (browserLang.startsWith("en")) {
    defaultLang = "en";
  }

  // 기본 언어로 설정
  changeLanguage(defaultLang);

  // 해당 언어 버튼 활성화
  const activeButton = document.querySelector(
    `.lang-btn[data-lang="${defaultLang}"]`
  );
  if (activeButton) {
    document
      .querySelectorAll(".lang-btn")
      .forEach((btn) => btn.classList.remove("active"));
    activeButton.classList.add("active");
  }
}

/**
 * 선택한 언어로 페이지 콘텐츠를 변경합니다.
 * 실제 구현에서는 이 부분이 서버에서 번역된 텍스트를 가져오거나,
 * 클라이언트 측에 저장된 번역 데이터를 사용하게 됩니다.
 */
function changeLanguage(lang) {
  console.log(`Changing language to: ${lang}`);

  // 나중에 구현할 실제 언어 전환 로직
  // 현재는 선택된 언어만 콘솔에 표시합니다.

  // 언어 선택을 쿠키나 로컬 스토리지에 저장할 수 있습니다.
  localStorage.setItem("preferred_language", lang);
}

// 번역 데이터는 나중에 구현할 예정입니다.
// 실제 구현에서는 서버에서 번역 데이터를 가져오거나,
// 클라이언트 측에 미리 정의된 번역 객체를 사용하게 됩니다.
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
    // English translations will be implemented later
  },
  ja: {
    // Japanese translations will be implemented later
  },
};
