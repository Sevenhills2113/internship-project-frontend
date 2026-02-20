// ============= Error Handling Utilities =============

import { ERROR_MESSAGES } from "./constants.js";

export class ApiError extends Error {
  constructor(statusCode, message, errors = undefined) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// Parse API error response
export const parseApiError = (response, data) => {
  const statusCode = response.status;
  let message = ERROR_MESSAGES.SERVER_ERROR;
  let errors = undefined;

  // Handle different status codes
  switch (statusCode) {
    case 400:
      message = data?.message || ERROR_MESSAGES.INVALID_INPUT;
      errors = data?.errors;
      break;
    case 401:
      message = ERROR_MESSAGES.UNAUTHORIZED;
      break;
    case 403:
      message = ERROR_MESSAGES.FORBIDDEN;
      break;
    case 404:
      message = ERROR_MESSAGES.NOT_FOUND;
      break;
    case 409:
      message = data?.message || "Conflict: Resource already exists";
      break;
    case 500:
      message = ERROR_MESSAGES.SERVER_ERROR;
      break;
    default:
      message = data?.message || ERROR_MESSAGES.SERVER_ERROR;
  }

  return new ApiError(statusCode, message, errors);
};

// Handle network errors
export const handleNetworkError = (error) => {
  console.error("Network Error:", error);

  if (error.message === "Failed to fetch") {
    return new ApiError(0, ERROR_MESSAGES.NETWORK_ERROR);
  }

  return new ApiError(0, error.message || ERROR_MESSAGES.NETWORK_ERROR);
};

// Format error message for user display
export const formatErrorMessage = (error) => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return ERROR_MESSAGES.SERVER_ERROR;
};

// Global error handler
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    let data;

    try {
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } catch (err) {
      console.error("Error parsing error response:", err);
      data = null;
    }

    throw parseApiError(response, data);
  }

  try {
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  } catch (err) {
    console.error("Error parsing response:", err);
    throw new ApiError(response.status, "Failed to parse response");
  }
};

// Retry logic for failed requests
export const retryRequest = async (fn, maxAttempts = 3, delayMs = 1000) => {
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.warn(`Request failed (attempt ${attempt}/${maxAttempts}):`, err);

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError || new ApiError(0, "Failed after multiple attempts");
};

// Create standardized error object
export const createErrorObject = (error) => ({
  message: formatErrorMessage(error),
  statusCode: error instanceof ApiError ? error.statusCode : 500,
  fieldErrors: error instanceof ApiError ? error.errors : undefined,
});
