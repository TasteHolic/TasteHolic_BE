exports.validateRegisterInput = (email, password, nickname) => {
    if (!email || !password || !nickname) {
      return '모든 필드를 입력해 주세요.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return '유효한 이메일을 입력해 주세요.';
    }
    if (password.length < 8) {
      return '비밀번호는 최소 8자 이상이어야 합니다.';
    }
    return null;
  };
  