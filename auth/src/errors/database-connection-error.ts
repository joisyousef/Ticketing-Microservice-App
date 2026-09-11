export class DatabaseConnectionError extends Error {
  reason = "Error connectino to database";

  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
