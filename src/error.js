export class DuplicateAlcoholError extends Error {
  errorCode = "U001";
  statusCode = 400;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class NoAlcoholError extends Error {
  errorCode = "U002";
  statusCode = 400;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class NoRecipeError extends Error {
  errorCode = "R001";
  statusCode = 404;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class ExistingFavError extends Error {
  errorCode = "R002";
  statusCode = 400;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
export class NoExistingFavError extends Error {
  errorCode = "R003";
  statusCode = 400;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class NoPermission extends Error {
  errorCode = "U001";
  statusCode = 403;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class UnavailableData extends Error {
  errorCode = "D001";
  statusCode = 400;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class DuplicateUserError extends Error {
  errorCode = "U100"; // 중복된 사용자 에러 코드
  statusCode = 400; // Bad Request

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class InvalidCredentialsError extends Error {
  errorCode = "U101"; // 로그인 실패(잘못된 자격 증명)
  statusCode = 401; // Unauthorized

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class NoUserError extends Error {
  errorCode = "U102"; // 존재하지 않는 사용자
  statusCode = 404; // Not Found

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class TokenExpiredError extends Error {
  errorCode = "U103"; // 토큰 만료
  statusCode = 401; // Unauthorized

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class InvalidTokenError extends Error {
  errorCode = "U104"; // 잘못된 토큰
  statusCode = 403; // Forbidden

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class NoPermissionError extends Error {
  errorCode = "U105"; // 권한 없음
  statusCode = 403; // Forbidden

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class UserDeletionError extends Error {
  errorCode = "U106"; // 회원 탈퇴 실패
  statusCode = 500; // Internal Server Error

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class NoQuery extends Error {
  errorCode = "R101";
  statusCode = 400;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class NoParameter extends Error {
  errorCode = "R102";
  statusCode = 400;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class UnavailableType extends Error {
  errorCode = "R103";
  statusCode = 400;

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class SearchError extends Error {
  errorCode = "S001";
  statusCode = 400;

  constructor(message, data = {}) {
    super(message);
    this.data = data;
  }
  
}

export class InvalidFilterError extends Error {
  errorCode = "S002";
  statusCode = 400;

  constructor(message, data = {}) {
    super(message);
    this.data = data;
  }  
}

export const handleError = (err, res) => {
  console.error("❌ ERROR:", {
    message: err.message,
    errorCode: err.errorCode || "UNKNOWN",
    statusCode: err.statusCode || 500,
    stack: err.stack,
    data: err.data || {},
  });

  if (err instanceof SearchError || err instanceof InvalidFilterError) {
    return res.status(err.statusCode).json({
      success: false,
      errorCode: err.errorCode,
      message: err.message,
      data: err.data,
    });
  }

  res.status(500).json({
    success: false,
    message: "서버 내부 오류가 발생했습니다.",
  });
};

