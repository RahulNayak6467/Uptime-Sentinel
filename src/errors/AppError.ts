// export class AppError extends Error {
//   statusCode: number;

//   constructor(statusCode: number, message: string) {
//     super(message);
//     this.statusCode = statusCode;
//     this.name = "AppError";
//   }
// }

export class AppError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class PostgresError extends Error {
  code: string;
  statusCode: number;
  constructor(code: string, statusCode: number, message: string) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.name = "PostgresError";
    Object.setPrototypeOf(this, PostgresError.prototype);
  }
}
