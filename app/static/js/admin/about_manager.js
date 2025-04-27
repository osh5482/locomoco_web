/**
 * about_manager.js - About 페이지 관리 기능
 * locomoco 포트폴리오 웹사이트
 */

/**
 * About 페이지 관리 객체
 */
const AdminAbout = {
  /**
   * 초기화
   */
  init() {
    document.addEventListener("DOMContentLoaded", () => {
      console.log("About 페이지 관리 기능이 로드되었습니다.");

      // About 페이지 폼 제출 처리 초기화
      this.initAboutForms();

      // 파일 업로드 미리보기 초기화 (이미 file-upload.js에서 처리되므로 중복 방지)
      if (typeof window.FileUpload === "undefined") {
        this.initFilePreview();
      }
    });
  },

  /**
   * About 페이지 폼 제출 처리 초기화
   */
  initAboutForms() {
    const aboutForms = document.querySelectorAll(".about-edit-form");

    aboutForms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        // 프로필 이미지는 ko 폼에서만 처리
        const langCode = formData.get("lang_code");

        if (langCode === "ko") {
          // 프로필 이미지 업로드 처리
          const profileImage = document.getElementById("profile-image");

          if (profileImage.files && profileImage.files[0]) {
            // 별도 API로 이미지 먼저 업로드
            const imageFormData = new FormData();
            imageFormData.append("profile_image", profileImage.files[0]);

            // API 유틸리티가 로드되었는지 확인
            if (window.API && window.API.uploadProfileImage) {
              window.API.uploadProfileImage(imageFormData)
                .then((data) => {
                  console.log("Profile image update response:", data);

                  if (data.status === "success") {
                    // 이미지 업로드 성공 시 About 내용 업데이트
                    this.updateAboutContent(formData);
                  } else {
                    alert(
                      "이미지 업로드 중 오류가 발생했습니다: " + data.message
                    );
                  }
                })
                .catch((error) => {
                  console.error("Error uploading image:", error);
                  alert("이미지 업로드 중 오류가 발생했습니다.");
                });
            } else {
              // 기본 fetch API 사용
              fetch("/api/admin/profile-image", {
                method: "POST",
                body: imageFormData,
              })
                .then((response) => response.json())
                .then((data) => {
                  console.log("Profile image update response:", data);

                  if (data.status === "success") {
                    // 이미지 업로드 성공 시 About 내용 업데이트
                    this.updateAboutContent(formData);
                  } else {
                    alert(
                      "이미지 업로드 중 오류가 발생했습니다: " + data.message
                    );
                  }
                })
                .catch((error) => {
                  console.error("Error uploading image:", error);
                  alert("이미지 업로드 중 오류가 발생했습니다.");
                });
            }
          } else {
            // 이미지 변경 없이 About 내용만 업데이트
            this.updateAboutContent(formData);
          }
        } else {
          // 한국어가 아닌 경우 About 내용만 업데이트
          this.updateAboutContent(formData);
        }
      });
    });
  },

  /**
   * About 콘텐츠 업데이트 함수
   * @param {FormData} formData - 폼 데이터
   */
  updateAboutContent(formData) {
    // API 유틸리티가 로드되었는지 확인
    if (window.API && window.API.updateAboutContent) {
      window.API.updateAboutContent(formData)
        .then((data) => {
          console.log("About content update response:", data);

          if (data.status === "success") {
            alert(data.message);
          } else {
            alert("콘텐츠 업데이트 중 오류가 발생했습니다: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error updating about content:", error);
          alert("콘텐츠 업데이트 중 오류가 발생했습니다.");
        });
    } else {
      // 기본 fetch API 사용
      fetch("/api/admin/about", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("About content update response:", data);

          if (data.status === "success") {
            alert(data.message);
          } else {
            alert("콘텐츠 업데이트 중 오류가 발생했습니다: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error updating about content:", error);
          alert("콘텐츠 업데이트 중 오류가 발생했습니다.");
        });
    }
  },

  /**
   * 파일 업로드 미리보기 초기화
   */
  initFilePreview() {
    const fileInputs = document.querySelectorAll(".file-input");

    fileInputs.forEach((input) => {
      input.addEventListener("change", function (e) {
        if (this.files && this.files[0]) {
          const reader = new FileReader();

          reader.onload = function (e) {
            // 미리보기 이미지 요소 찾기 또는 생성
            const uploadBox = input.parentElement;
            let previewImage = uploadBox.querySelector(".preview-uploaded");

            // 기존 미리보기 이미지가 없으면 생성
            if (!previewImage) {
              previewImage = document.createElement("img");
              previewImage.className = "preview-uploaded";
              uploadBox.appendChild(previewImage);

              // 라벨 스타일 변경
              const label = uploadBox.querySelector(".upload-label");
              if (label) {
                label.style.opacity = "0.2";
              }
            }

            // 미리보기 이미지 소스 설정
            previewImage.src = e.target.result;
          };

          reader.readAsDataURL(this.files[0]);
        }
      });
    });
  },
};

// 전역 객체로 내보내기
window.AdminAbout = AdminAbout;

// About 페이지 관리 초기화
AdminAbout.init();
