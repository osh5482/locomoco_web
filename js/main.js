/**
 * main.js - 메인 JavaScript 파일
 * locomoco 포트폴리오 웹사이트
 */

// 현재 페이지 활성화 표시
document.addEventListener("DOMContentLoaded", function () {
  // 현재 페이지 URL 가져오기
  const currentPage = window.location.pathname.split("/").pop();

  // 네비게이션 링크 가져오기
  const navLinks = document.querySelectorAll(".main-nav li");

  // 현재 페이지에 따라 해당 네비게이션 아이템 활성화
  navLinks.forEach((link) => {
    const linkHref = link.querySelector("a").getAttribute("href");

    // 현재 페이지가 index.html이거나 루트 경로일 경우 about 활성화
    if (
      (currentPage === "" ||
        currentPage === "index.html" ||
        currentPage === "/") &&
      linkHref === "index.html"
    ) {
      link.classList.add("active");
    }
    // 그 외 페이지는 해당 링크와 일치할 경우 활성화
    else if (linkHref === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // 이미지 지연 로딩
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    // 이미지가 뷰포트에 들어올 때 로딩
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target;
            image.src = image.dataset.src;
            observer.unobserve(image);
          }
        });
      });

      if (img.dataset.src) {
        observer.observe(img);
      }
    } else {
      // IntersectionObserver를 지원하지 않는 브라우저를 위한 폴백
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    }
  });
});

// 부드러운 스크롤 적용
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 50, // 헤더 높이나 여백 고려
        behavior: "smooth",
      });
    }
  });
});

// 모바일 메뉴 토글
if (document.querySelector(".mobile-menu-toggle")) {
  document
    .querySelector(".mobile-menu-toggle")
    .addEventListener("click", function () {
      document.querySelector(".sidebar").classList.toggle("active");
    });
}

// 윈도우 리사이즈 시 모바일 메뉴 초기화
window.addEventListener("resize", function () {
  if (window.innerWidth > 768) {
    if (document.querySelector(".sidebar.active")) {
      document.querySelector(".sidebar").classList.remove("active");
    }
  }
});

// 프로필 이미지 효과
if (document.querySelector(".profile-image")) {
  const profileImg = document.querySelector(".profile-image");

  profileImg.addEventListener("mouseenter", function () {
    this.classList.add("hover");
  });

  profileImg.addEventListener("mouseleave", function () {
    this.classList.remove("hover");
  });
}
