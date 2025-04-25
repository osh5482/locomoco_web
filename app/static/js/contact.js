/**
 * contact.js - Contact 페이지 기능
 * locomoco 포트폴리오 웹사이트
 */

document.addEventListener("DOMContentLoaded", function () {
  console.log("Contact 페이지가 로드되었습니다.");

  // 연락처 폼 요소 가져오기
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    // 폼 제출 이벤트 리스너
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // 폼 유효성 검사
      if (validateForm()) {
        // 폼 데이터 수집
        const formData = new FormData(contactForm);

        // 폼 데이터 객체로 변환
        const formDataObj = {};
        formData.forEach((value, key) => {
          formDataObj[key] = value;
        });

        // 실제 구현에서는 여기서 AJAX 요청으로 서버에 데이터 전송
        console.log("폼 데이터:", formDataObj);

        // 폼 제출 성공 메시지 표시 (임시)
        showSuccessMessage();

        // 폼 초기화
        contactForm.reset();
      }
    });
  }

  // 폼 유효성 검사 함수
  function validateForm() {
    let isValid = true;

    // 필수 필드 검사
    const nameField = document.getElementById("name");
    const emailField = document.getElementById("email");
    const messageField = document.getElementById("message");

    // 이름 필드 검사
    if (!nameField.value.trim()) {
      markInvalid(nameField, "이름을 입력해주세요.");
      isValid = false;
    } else {
      markValid(nameField);
    }

    // 이메일 필드 검사
    if (!emailField.value.trim()) {
      markInvalid(emailField, "이메일을 입력해주세요.");
      isValid = false;
    } else if (!isValidEmail(emailField.value)) {
      markInvalid(emailField, "유효한 이메일 주소를 입력해주세요.");
      isValid = false;
    } else {
      markValid(emailField);
    }

    // 메시지 필드 검사
    if (!messageField.value.trim()) {
      markInvalid(messageField, "문의 내용을 입력해주세요.");
      isValid = false;
    } else {
      markValid(messageField);
    }

    return isValid;
  }

  // 이메일 형식 검사 함수
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // 유효하지 않은 필드 표시 함수
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

  // 유효한 필드 표시 함수
  function markValid(field) {
    field.classList.remove("invalid");

    // 에러 메시지 요소 숨기기
    const errorMessage = field.nextElementSibling;
    if (errorMessage && errorMessage.classList.contains("error-message")) {
      errorMessage.classList.remove("visible");
    }
  }

  // 성공 메시지 표시 함수
  function showSuccessMessage() {
    // 기존 성공 메시지 요소 찾기
    let successMessage = document.querySelector(".success-message");

    // 없으면 생성
    if (!successMessage) {
      successMessage = document.createElement("div");
      successMessage.className = "success-message";
      const formContainer = document.querySelector(".contact-form-container");
      formContainer.appendChild(successMessage);
    }

    // 메시지 내용 설정 및 표시
    successMessage.innerHTML =
      "<p>메시지가 성공적으로 전송되었습니다. 빠른 시일 내에 답변 드리겠습니다.</p>";
    successMessage.classList.add("visible");

    // 3초 후 메시지 숨기기
    setTimeout(function () {
      successMessage.classList.remove("visible");
    }, 5000);
  }

  // 입력 필드에 실시간 유효성 검사 이벤트 리스너 (선택적)
  const inputFields = contactForm.querySelectorAll("input, textarea");
  inputFields.forEach((field) => {
    field.addEventListener("blur", function () {
      if (field.required && !field.value.trim()) {
        markInvalid(
          field,
          field.name.charAt(0).toUpperCase() +
            field.name.slice(1) +
            "을(를) 입력해주세요."
        );
      } else if (
        field.type === "email" &&
        field.value.trim() &&
        !isValidEmail(field.value)
      ) {
        markInvalid(field, "유효한 이메일 주소를 입력해주세요.");
      } else {
        markValid(field);
      }
    });
  });
});
