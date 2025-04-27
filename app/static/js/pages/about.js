/**
 * about.js - About 페이지 기능
 * locomoco 포트폴리오 웹사이트
 */

/**
 * About 페이지 관리 객체
 */
const AboutPage = {
  /**
   * 초기화
   */
  init() {
    document.addEventListener("DOMContentLoaded", () => {
      console.log("About 페이지가 로드되었습니다.");

      // 프로필 이미지 효과 초기화
      this.initProfileImageEffect();
    });
  },

  /**
   * 프로필 이미지 효과 초기화
   */
  initProfileImageEffect() {
    const profileImage = document.querySelector(".profile-image");

    if (profileImage) {
      // 이미지 로드 완료 후 페이드인 효과
      const mainProfile = profileImage.querySelector(".main-profile");
      if (mainProfile) {
        if (mainProfile.complete) {
          mainProfile.style.opacity = "1";
        } else {
          mainProfile.addEventListener("load", () => {
            mainProfile.style.opacity = "1";
          });
        }
      }

      // 마우스 호버 효과
      profileImage.addEventListener("mouseenter", () => {
        if (mainProfile) {
          mainProfile.style.transform = "scale(1.03)";
        }
      });

      profileImage.addEventListener("mouseleave", () => {
        if (mainProfile) {
          mainProfile.style.transform = "scale(1)";
        }
      });
    }
  },
};

// About 페이지 초기화
AboutPage.init();
