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
