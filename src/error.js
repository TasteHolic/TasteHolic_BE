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

export class InvalidFilterError extends Error {
  constructor(reason, data) {
      super(reason);
      this.errorCode = "S001";
      this.statusCode = 400;
      this.reason = reason;
      this.data = data;
  }
}
