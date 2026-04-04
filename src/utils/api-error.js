class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

//👉 What errors[] stores:
// An array of detailed error messages or objects

// Why needed?
// Sometimes one error message is not enough (especially in validation (like email not correct or password 8 chars...) cases)

//A stack trace (i.e., where the error happened in code)

//We pass this.constructor to remove the ApiError constructor and anything above it from the stack so the error shows only the real place where it occurred.

// Skipping the constructor only cleans the stack trace for custom errors; if an actual error occurs inside the constructor, it will still appear in the stack because it’s a real runtime error.

export { ApiError };
