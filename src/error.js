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