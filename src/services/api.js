// 환경변수에서 API 주소 가져오기 (없으면 기본값 사용)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/todos';

// 네트워크 오류 처리 헬퍼 함수
const handleResponse = async (response) => {
  if (!response.ok) {
    // 응답이 없거나 파싱할 수 없는 경우
    if (response.status === 0 || response.statusText === '') {
      throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    }
    
    // 서버 응답을 파싱 시도
    let errorData = {};
    let errorMessage = '';
    
    try {
      const text = await response.text();
      if (text) {
        errorData = JSON.parse(text);
        errorMessage = errorData.error || errorData.message || '';
      }
    } catch (e) {
      // JSON 파싱 실패 시 원본 텍스트 사용
      errorMessage = '';
    }
    
    // HTTP 상태 코드에 따른 상세 메시지
    let statusMessage = '';
    if (response.status === 500) {
      statusMessage = '백엔드 서버에서 내부 오류가 발생했습니다. 서버 로그를 확인해주세요.';
    } else if (response.status === 400) {
      statusMessage = '요청 데이터가 올바르지 않습니다.';
    } else if (response.status === 404) {
      statusMessage = '요청한 리소스를 찾을 수 없습니다.';
    } else if (response.status === 401) {
      statusMessage = '인증이 필요합니다.';
    } else if (response.status === 403) {
      statusMessage = '접근 권한이 없습니다.';
    } else {
      statusMessage = `서버 오류 (${response.status} ${response.statusText || ''})`;
    }
    
    const finalMessage = errorMessage 
      ? `${statusMessage}\n상세: ${errorMessage}` 
      : statusMessage;
    
    const error = new Error(finalMessage);
    error.status = response.status;
    error.errorData = errorData;
    throw error;
  }
  return await response.json();
};

// 모든 할 일 조회
export const fetchTodos = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await handleResponse(response);
    
    if (!result.success) {
      throw new Error(result.error || '할 일을 불러오는 중 오류가 발생했습니다.');
    }
    
    return result.data || [];
  } catch (error) {
    console.error('할 일 조회 오류:', error);
    // 네트워크 오류에 대한 더 명확한 메시지
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('백엔드 서버에 연결할 수 없습니다. localhost:5000에서 서버가 실행 중인지 확인해주세요.');
    }
    throw error;
  }
};

// 할 일 생성
export const createTodo = async (todoData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todoData),
    });
    
    const result = await handleResponse(response);
    
    if (!result.success) {
      throw new Error(result.error || '할 일을 생성하는 중 오류가 발생했습니다.');
    }
    
    return result.data;
  } catch (error) {
    console.error('할 일 생성 오류:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('백엔드 서버에 연결할 수 없습니다. localhost:5000에서 서버가 실행 중인지 확인해주세요.');
    }
    throw error;
  }
};

// 할 일 수정
export const updateTodo = async (id, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    const result = await handleResponse(response);
    
    if (!result.success) {
      throw new Error(result.error || '할 일을 수정하는 중 오류가 발생했습니다.');
    }
    
    return result.data;
  } catch (error) {
    console.error('할 일 수정 오류:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('백엔드 서버에 연결할 수 없습니다. localhost:5000에서 서버가 실행 중인지 확인해주세요.');
    }
    throw error;
  }
};

// 할 일 삭제
export const deleteTodo = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await handleResponse(response);
    
    if (!result.success) {
      throw new Error(result.error || '할 일을 삭제하는 중 오류가 발생했습니다.');
    }
    
    return result;
  } catch (error) {
    console.error('할 일 삭제 오류:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('백엔드 서버에 연결할 수 없습니다. localhost:5000에서 서버가 실행 중인지 확인해주세요.');
    }
    throw error;
  }
};

