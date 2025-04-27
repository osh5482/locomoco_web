/**
 * forms.js - 폼 유효성 검사 및 제출 유틸리티
 * locomoco 포트폴리오 웹사이트
 */

/**
 * 이메일 형식 검사
 * @param {string} email - 검사할 이메일 주소
 * @returns {boolean} - 유효한 이메일이면 true
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 폼 데이터를 객체로 변환
 * @param {HTMLFormElement} form - 폼 요소
 * @returns {Object} - 폼 데이터 객체
 */
function getFormData(form) {
  const formData = new FormData(form);
  const data = {};

  formData.forEach((value, key) => {
    // 체크박스 처리
    if (form.elements[key].type === "checkbox") {
      data[key] = form.elements[key].checked;
    } else {
      data[key] = value;
    }
  });

  return data;
}

/**
 * 필드를 유효하지 않은 상태로 표시
 * @param {HTMLElement} field - 필드 요소
 * @param {string} message - 오류 메시지
 */
function markInvalid(field, message) {
  field.classList.add("invalid");

  // 에러 메시지 요소 찾기 또는 생성
  let errorMessage = field.nextElementSibling;
  if (!errorMessage || !errorMessage.classList.contains("error-message")) {
    errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    field.parentNode.insertBefore(errorMessage, field.nextSibling);
  }

  errorMessage.textContent = message;
  errorMessage.classList.add("visible");
}

/**
 * 필드를 유효한 상태로 표시
 * @param {HTMLElement} field - 필드 요소
 */
function markValid(field) {
  field.classList.remove("invalid");

  // 에러 메시지 요소 숨기기
  const errorMessage = field.nextElementSibling;
  if (errorMessage && errorMessage.classList.contains("error-message")) {
    errorMessage.classList.remove("visible");
  }
}

/**
 * 성공 메시지 표시
 * @param {HTMLElement} container - 메시지를 표시할 컨테이너
 * @param {string} message - 표시할 메시지
 * @param {number} [duration=5000] - 자동으로 사라지는 시간(ms)
 */
function showSuccessMessage(container, message, duration = 5000) {
  // 기존 성공 메시지 요소 찾기
  let successMessage = container.querySelector(".success-message");

  // 없으면 생성
  if (!successMessage) {
    successMessage = document.createElement("div");
    successMessage.className = "success-message";
    container.appendChild(successMessage);
  }

  // 메시지 내용 설정 및 표시
  successMessage.innerHTML = `<p>${message}</p>`;
  successMessage.classList.add("visible");

  // 지정 시간 후 메시지 숨기기
  if (duration > 0) {
    setTimeout(function () {
      successMessage.classList.remove("visible");
    }, duration);
  }
}

/**
 * 필수 필드 검사
 * @param {HTMLElement} field - 검사할 필드
 * @param {string} fieldName - 필드 이름
 * @returns {boolean} - 유효하면 true
 */
function validateRequired(field, fieldName) {
  if (!field.value.trim()) {
    markInvalid(field, `${fieldName}을(를) 입력해주세요.`);
    return false;
  }

  markValid(field);
  return true;
}

/**
 * 폼 리셋 - 모든 필드 초기화
 * @param {HTMLFormElement} form - 초기화할 폼
 */
function resetForm(form) {
  form.reset();

  // 유효성 검사 표시 제거
  const invalidFields = form.querySelectorAll(".invalid");
  invalidFields.forEach((field) => markValid(field));

  // 성공 메시지 제거
  const successMessage = form.parentElement.querySelector(".success-message");
  if (successMessage) {
    successMessage.classList.remove("visible");
  }
}

/**
 * 파일 입력 필드에 미리보기 추가
 * @param {Event} event - 파일 입력 이벤트
 */
function handleFilePreview(event) {
  const input = event.target;

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    const uploadBox = input.parentElement;

    reader.onload = function (e) {
      // 미리보기 이미지 요소 찾기 또는 생성
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

    reader.readAsDataURL(input.files[0]);
  }
}

// 폼 유틸리티 내보내기
window.Forms = {
  isValidEmail,
  getFormData,
  markInvalid,
  markValid,
  showSuccessMessage,
  validateRequired,
  resetForm,
  handleFilePreview,
};
