/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  /**
   * The status code of the API error
   */
  status: number;
  /**
   * The constructor for the ApiError class
   * @param message - The message of the error
   * @param status - The status code of the error
   */

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
