/**
 * work.js - Work 페이지 기능
 * locomoco 포트폴리오 웹사이트
 */

document.addEventListener("DOMContentLoaded", function () {
  console.log("Work 페이지가 로드되었습니다.");

  // 이미지 지연 로딩 기능
  function loadImages() {
    const images = document.querySelectorAll(".thumbnail-img");

    images.forEach(function (img) {
      // 이미지가 이미 로드되었는지 확인
      if (img.complete) {
        return;
      }

      // 이미지 로드 이벤트 리스너
      img.addEventListener("load", function () {
        // 이미지 로드 완료 시 투명도 애니메이션
        img.style.opacity = "1";
      });

      // 이미지 오류 처리
      img.addEventListener("error", function () {
        // 오류 발생 시 대체 이미지 또는 스타일 적용
        img.src = "../static/assets/images/placeholder.jpg";
        console.log("이미지 로드 오류:", img.alt);
      });
    });
  }

  // 이미지 로딩 함수 실행
  loadImages();

  // 작품 필터링 기능 (나중에 구현 예정)
  // 예: 카테고리별 필터링, 연도별 정렬 등

  // More 버튼 클릭 이벤트 (유튜브 플레이리스트 링크)
  const moreButton = document.querySelector(".load-more-btn");
  if (moreButton) {
    moreButton.addEventListener("click", function (e) {
      // 구글 애널리틱스 이벤트 트래킹 (나중에 구현)
      console.log("More 버튼 클릭: 유튜브 플레이리스트로 이동");
    });
  }
});
