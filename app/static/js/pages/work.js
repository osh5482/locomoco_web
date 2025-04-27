/**
 * work.js - Work 페이지 기능
 * locomoco 포트폴리오 웹사이트
 */

/**
 * Work 페이지 관리 객체
 */
const WorkPage = {
  /**
   * 초기화
   */
  init() {
    document.addEventListener("DOMContentLoaded", () => {
      console.log("Work 페이지가 로드되었습니다.");

      // 이미지 지연 로딩 초기화
      this.initLazyLoading();

      // More 버튼 이벤트 리스너 초기화
      this.initMoreButton();

      // 작품 아이템 호버 효과 초기화
      this.initWorkItemHover();
    });
  },

  /**
   * 이미지 지연 로딩 초기화
   */
  initLazyLoading() {
    const images = document.querySelectorAll(".thumbnail-img");

    images.forEach((img) => {
      // 이미지가 이미 로드되었는지 확인
      if (img.complete) {
        img.style.opacity = "1";
        return;
      }

      // 이미지 로드 이벤트 리스너
      img.addEventListener("load", () => {
        // 이미지 로드 완료 시 투명도 애니메이션
        img.style.opacity = "1";
      });

      // 이미지 오류 처리
      img.addEventListener("error", () => {
        // 오류 발생 시 대체 이미지 또는 스타일 적용
        img.src = "/static/assets/images/placeholder.jpg";
        console.log("이미지 로드 오류:", img.alt);
      });
    });
  },

  /**
   * More 버튼 이벤트 리스너 초기화
   */
  initMoreButton() {
    const moreButton = document.querySelector(".load-more-btn");

    if (moreButton) {
      moreButton.addEventListener("click", (e) => {
        // 구글 애널리틱스 이벤트 트래킹 (나중에 구현)
        console.log("More 버튼 클릭: 유튜브 플레이리스트로 이동");
      });
    }
  },

  /**
   * 작품 아이템 호버 효과 초기화
   */
  initWorkItemHover() {
    const workItems = document.querySelectorAll(".work-item");

    workItems.forEach((item) => {
      const thumbnail = item.querySelector(".thumbnail-img");

      item.addEventListener("mouseenter", () => {
        if (thumbnail) {
          thumbnail.style.transform = "scale(1.05)";
        }
        item.style.transform = "translateY(-5px)";
      });

      item.addEventListener("mouseleave", () => {
        if (thumbnail) {
          thumbnail.style.transform = "scale(1)";
        }
        item.style.transform = "translateY(0)";
      });
    });
  },
};

// Work 페이지 초기화
WorkPage.init();
