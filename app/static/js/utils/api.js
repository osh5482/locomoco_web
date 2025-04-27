/**
 * api.js - API 호출 유틸리티
 * locomoco 포트폴리오 웹사이트
 */

/**
 * 기본 API 호출 함수
 * @param {string} url - API 엔드포인트 URL
 * @param {Object} options - 요청 옵션
 * @returns {Promise<any>} - API 응답
 */
async function request(url, options = {}) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(
        `API 요청 실패: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("API 요청 오류:", error);
    throw error;
  }
}

/**
 * GET 요청
 * @param {string} url - API 엔드포인트 URL
 * @param {Object} [headers={}] - 요청 헤더
 * @returns {Promise<any>} - API 응답
 */
async function get(url, headers = {}) {
  return request(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...headers,
    },
  });
}

/**
 * POST 요청 (JSON 데이터)
 * @param {string} url - API 엔드포인트 URL
 * @param {Object} data - 요청 데이터
 * @param {Object} [headers={}] - 요청 헤더
 * @returns {Promise<any>} - API 응답
 */
async function post(url, data, headers = {}) {
  return request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: JSON.stringify(data),
  });
}

/**
 * POST 요청 (FormData)
 * @param {string} url - API 엔드포인트 URL
 * @param {FormData} formData - 요청 폼 데이터
 * @param {Object} [headers={}] - 요청 헤더
 * @returns {Promise<any>} - API 응답
 */
async function postForm(url, formData, headers = {}) {
  return request(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...headers,
    },
    body: formData,
  });
}

/**
 * PUT 요청
 * @param {string} url - API 엔드포인트 URL
 * @param {Object} data - 요청 데이터
 * @param {Object} [headers={}] - 요청 헤더
 * @returns {Promise<any>} - API 응답
 */
async function put(url, data, headers = {}) {
  return request(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: JSON.stringify(data),
  });
}

/**
 * DELETE 요청
 * @param {string} url - API 엔드포인트 URL
 * @param {Object} [headers={}] - 요청 헤더
 * @returns {Promise<any>} - API 응답
 */
async function del(url, headers = {}) {
  return request(url, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...headers,
    },
  });
}

/**
 * 언어 설정 변경 API
 * @param {string} langCode - 언어 코드 (ko, ja, en)
 * @returns {Promise<any>} - API 응답
 */
async function setLanguage(langCode) {
  const formData = new FormData();
  formData.append("lang_code", langCode);

  return postForm("/api/set-language", formData);
}

/**
 * About 페이지 콘텐츠 업데이트 API
 * @param {FormData} formData - 폼 데이터
 * @returns {Promise<any>} - API 응답
 */
async function updateAboutContent(formData) {
  return postForm("/api/admin/about", formData);
}

/**
 * 프로필 이미지 업로드 API
 * @param {FormData} formData - 프로필 이미지가 포함된 폼 데이터
 * @returns {Promise<any>} - API 응답
 */
async function uploadProfileImage(formData) {
  return postForm("/api/admin/profile-image", formData);
}

/**
 * 작품 정보 조회 API
 * @param {number} workId - 작품 ID
 * @returns {Promise<any>} - API 응답
 */
async function getWorkById(workId) {
  return get(`/api/admin/work/${workId}`);
}

/**
 * 작품 추가 또는 수정 API
 * @param {FormData} formData - 작품 정보가 포함된 폼 데이터
 * @returns {Promise<any>} - API 응답
 */
async function saveWork(formData) {
  return postForm("/api/admin/work", formData);
}

/**
 * 작품 삭제 API
 * @param {number} workId - 삭제할 작품 ID
 * @returns {Promise<any>} - API 응답
 */
async function deleteWork(workId) {
  return del(`/api/admin/work/${workId}`);
}

// API 유틸리티 내보내기
window.API = {
  get,
  post,
  postForm,
  put,
  del,
  setLanguage,
  updateAboutContent,
  uploadProfileImage,
  getWorkById,
  saveWork,
  deleteWork,
};
