/**
 * main.js - 메인 JavaScript 파일
 * locomoco 포트폴리오 웹사이트
 */

// 페이지 로드 완료 후 실행
document.addEventListener("DOMContentLoaded", function () {
  console.log("locomoco portfolio website loaded");

  // 현재 활성화된 페이지 메뉴 항목 강조 표시
  highlightCurrentPage();
});

/**
 * 현재 페이지 URL을 기반으로 네비게이션 메뉴의 활성 항목을 설정합니다.
 */
function highlightCurrentPage() {
  // 현재 URL 경로 가져오기
  const currentPath = window.location.pathname;

  // 모든 네비게이션 링크 가져오기
  const navLinks = document.querySelectorAll(".main-nav li");

  // 기본적으로 모든 활성 클래스 제거
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  // 현재 경로에 맞는 링크 찾기 및 활성화
  navLinks.forEach((link) => {
    const anchor = link.querySelector("a");
    const href = anchor.getAttribute("href");

    // 홈(index) 페이지 확인
    if (currentPath === "/" && href === "/") {
      link.classList.add("active");
    }
    // 다른 페이지들 확인 (예: /work, /contact 등)
    else if (currentPath.includes(href) && href !== "/") {
      link.classList.add("active");
    }
  });
}
/**
 * main.js - 리팩토링된 메인 JavaScript 파일
 * locomoco 포트폴리오 웹사이트
 */

// 페이지 로드 완료 후 실행
document.addEventListener("DOMContentLoaded", function () {
  console.log("locomoco portfolio website loaded");

  // 현재 활성화된 페이지 메뉴 항목 강조 표시
  if (window.Navigation) {
    window.Navigation.highlightCurrentPage();
  } else {
    highlightCurrentPage();
  }

  // 하위 호환성을 위한 함수 정의
  function highlightCurrentPage() {
    // 현재 URL 경로 가져오기
    const currentPath = window.location.pathname;

    // 모든 네비게이션 링크 가져오기
    const navLinks = document.querySelectorAll(".main-nav li");

    // 기본적으로 모든 활성 클래스 제거
    navLinks.forEach((link) => {
      link.classList.remove("active");
    });

    // 현재 경로에 맞는 링크 찾기 및 활성화
    navLinks.forEach((link) => {
      const anchor = link.querySelector("a");
      const href = anchor.getAttribute("href");

      // 홈(index) 페이지 확인
      if (currentPath === "/" && href === "/") {
        link.classList.add("active");
      }
      // 다른 페이지들 확인 (예: /work, /contact 등)
      else if (currentPath.includes(href) && href !== "/") {
        link.classList.add("active");
      }
    });
  }
});

/**
 * 이 파일은 하위 호환성을 위해 유지됩니다.
 * 기존 HTML 파일에서 main.js를 참조하는 경우에도 정상 작동하도록
 * 기본적인 페이지 하이라이팅 기능을 제공합니다.
 *
 * 새로운 프로젝트에서는 모듈별로 분리된 JS 파일들을 사용하세요.
 */
