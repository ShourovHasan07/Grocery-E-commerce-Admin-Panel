import { getServerSession } from "next-auth";

import { authOptions } from "@/libs/auth";

class APIError extends Error {
  constructor(message, status, response = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.response = response;
  }
}

class AuthenticationError extends APIError {
  constructor(message = 'Authentication required') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

// Utility function to create combined abort signal
function createCombinedSignal(externalSignal, timeoutMs) {
  const controller = new AbortController();
  let timeoutId = null;
  let isTimeoutAbort = false;

  // Set up timeout
  if (timeoutMs > 0) {
    timeoutId = setTimeout(() => {
      isTimeoutAbort = true;
      controller.abort();
    }, timeoutMs);
  }

  // Set up external signal listener
  let externalAbortHandler = null;

  if (externalSignal && !externalSignal.aborted) {
    externalAbortHandler = () => {
      clearTimeout(timeoutId);
      controller.abort();
    };

    externalSignal.addEventListener('abort', externalAbortHandler, { once: true });
  } else if (externalSignal?.aborted) {
    // External signal already aborted
    clearTimeout(timeoutId);
    controller.abort();
  }

  // Cleanup function
  const cleanup = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (externalAbortHandler && externalSignal) {
      externalSignal.removeEventListener('abort', externalAbortHandler);
    }
  };

  return {
    signal: controller.signal,
    cleanup,
    isTimeoutAbort: () => isTimeoutAbort
  };
}

class RouteApiHelper {
  constructor() {
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
    this.defaultTimeout = 100000; // 100 seconds
  }

  // Get session and token (works in both server and client)
  async getAuthToken() {
    try {
      let session;

      // Check if we're on server side
      if (typeof window === "undefined") {
        session = await getServerSession(authOptions);
      } else {
        // Client side - you'd need to pass session from component
        // or use next-auth/react getSession()
        const { getSession } = await import("next-auth/react");

        session = await getSession();
      }

      return session?.accessToken || session?.user?.apiToken || null;
    } catch (error) {
      // console.error('Error getting auth token:', error);

      return null;
    }
  }

  // Build headers with authentication
  async buildHeaders(token = null, additionalHeaders = {}) {
    if (!token) {
      token = await this.getAuthToken();
    }

    const headers = {
      ...this.defaultHeaders,
      ...additionalHeaders,
    };

    if (token) {
      headers["Authorization"] = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }

    return headers;
  }

  // Generic API call method
  async makeApiCall(endpoint, options = {}, token = null) {
    const {
      method = "GET",
      body = null,
      headers: customHeaders = {},
      queryParams = {},
      timeout = this.defaultTimeout,
      signal = null,
      ...otherOptions
    } = options;

    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;

    const normalizedBaseURL = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;

    const url = new URL(normalizedEndpoint, normalizedBaseURL);

    // Add query params
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] !== undefined && queryParams[key] !== null) {
        url.searchParams.append(key, queryParams[key]);
      }
    });

    // Build headers
    const headers = await this.buildHeaders(token, customHeaders);

    // Create combined abort signal with proper cleanup
    const { signal: combinedSignal, cleanup, isTimeoutAbort } = createCombinedSignal(signal, timeout);

    // Check if already aborted before starting request
    if (combinedSignal.aborted) {
      cleanup();

      return {
        success: false,
        status: signal?.aborted ? 499 : 408,
        statusText: signal?.aborted ? "Request Cancelled" : "Request Timeout",
        data: null,
        error: signal?.aborted ? "Request was cancelled" : "Request timeout",
      };
    }

    // Prepare fetch options
    const fetchOptions = {
      method,
      headers,
      signal: combinedSignal,
      ...otherOptions,
    };

    // Add body if provided (and not GET request)
    if (body && method !== "GET") {
      if (body instanceof FormData) {
        // Remove Content-Type for FormData (browser will set it)
        delete fetchOptions.headers["Content-Type"];
        fetchOptions.body = body;
      } else if (typeof body === "object") {
        fetchOptions.body = JSON.stringify(body);
      } else {
        fetchOptions.body = body;
      }
    }

    try {
      // Make the API call
      const response = await fetch(url.toString(), fetchOptions);

      // Clean up immediately after successful fetch
      cleanup();

      // Handle different response types
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Return structured response
      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: response.headers,
        raw: response,
      };
    } catch (error) {
      // Always clean up on error
      cleanup();

      // Enhanced abort error handling
      if (error.name === 'AbortError') {
        if (signal?.aborted) {
          return {
            success: false,
            status: 499,
            statusText: "Request Cancelled",
            data: null,
            error: "Request was cancelled",
          };
        } else if (isTimeoutAbort()) {
          return {
            success: false,
            status: 408,
            statusText: "Request Timeout",
            data: null,
            error: "Request timeout",
          };
        } else {
          return {
            success: false,
            status: 499,
            statusText: "Request Aborted",
            data: null,
            error: "Request was aborted",
          };
        }
      }

      return {
        success: false,
        status: 0,
        statusText: "Network Error",
        data: null,
        error: error.message,
      };
    }
  }

  // Convenience methods for different HTTP verbs with abort signal support
  async get(endpoint, queryParams = {}, token = null, headers = {}, signal = null) {
    return this.makeApiCall(
      endpoint,
      {
        method: "GET",
        queryParams,
        headers,
        signal,
      },
      token,
    );
  }

  async post(endpoint, body = null, token = null, headers = {}, signal = null) {
    return this.makeApiCall(
      endpoint,
      {
        method: "POST",
        body,
        headers,
        signal,
      },
      token,
    );
  }

  async put(endpoint, body = null, token = null, headers = {}, signal = null) {
    return this.makeApiCall(
      endpoint,
      {
        method: "PUT",
        body,
        headers,
        signal,
      },
      token,
    );
  }

  async patch(endpoint, body = null, token = null, headers = {}, signal = null) {
    return this.makeApiCall(
      endpoint,
      {
        method: "PATCH",
        body,
        headers,
        signal,
      },
      token,
    );
  }

  async delete(endpoint, token = null, headers = {}, signal = null) {
    return this.makeApiCall(
      endpoint,
      {
        method: "DELETE",
        headers,
        signal,
      },
      token,
    );
  }

  // File upload helper with abort signal support
  async uploadFile(endpoint, file, additionalData = {}, token = null, signal = null) {
    const formData = new FormData();

    formData.append("file", file);

    // Add additional form data
    Object.keys(additionalData).forEach((key) => {
      formData.append(key, additionalData[key]);
    });

    return this.makeApiCall(
      endpoint,
      {
        method: "POST",
        body: formData,
        signal,
      },
      token,
    );
  }

  // Paginated GET request with abort signal support
  async getPaginated(
    endpoint,
    page = 1,
    pageSize = 10,
    filters = {},
    token = null,
    signal = null,
  ) {
    const queryParams = {
      page,
      pageSize,
      ...filters,
    };

    return this.get(endpoint, queryParams, token, {}, signal);
  }
}

// Create singleton instance
const routeApiHelper = new RouteApiHelper();

// Export both the class and instance
export { RouteApiHelper, APIError, AuthenticationError };
export default routeApiHelper;
