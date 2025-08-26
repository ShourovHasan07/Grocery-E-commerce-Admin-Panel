class PageApiHelper {
  constructor() {
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  // Build headers with authentication
  async buildHeaders(token = null, additionalHeaders = {}) {
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
    try {
      const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api`;

      // console.log('Page Token:', token);

      const {
        method = "GET",
        body = null,
        headers: customHeaders = {},
        queryParams = {},
        ...otherOptions
      } = options;

      const normalizedBaseURL = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

      const normalizedEndpoint = endpoint.startsWith("/")
        ? endpoint.slice(1)
        : endpoint;

      const url = new URL(normalizedEndpoint, normalizedBaseURL);

      // console.log(url);

      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] !== undefined && queryParams[key] !== null) {
          url.searchParams.append(key, queryParams[key]);
        }
      });

      // Build headers
      const headers = await this.buildHeaders(token, customHeaders);

      // Prepare fetch options
      const fetchOptions = {
        method,
        headers,
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

      // Make the API call
      const response = await fetch(url.toString(), fetchOptions);

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
      // console.error('API call failed:', error);

      return {
        success: false,
        status: 0,
        statusText: "Network Error",
        data: null,
        error: error.message,
      };
    }
  }

  // Convenience methods for different HTTP verbs
  async get(endpoint, queryParams = {}, token = null, headers = {}) {
    return this.makeApiCall(
      endpoint,
      {
        method: "GET",
        queryParams,
        headers,
      },
      token,
    );
  }

  async post(endpoint, body = null, token = null, headers = {}) {
    return this.makeApiCall(
      endpoint,
      {
        method: "POST",
        body,
        headers,
      },
      token,
    );
  }

  async put(endpoint, body = null, token = null, headers = {}) {
    return this.makeApiCall(
      endpoint,
      {
        method: "PUT",
        body,
        headers,
      },
      token,
    );
  }

  async patch(endpoint, body = null, token = null, headers = {}) {
    return this.makeApiCall(
      endpoint,
      {
        method: "PATCH",
        body,
        headers,
      },
      token,
    );
  }

  async delete(endpoint, token = null, headers = {}) {
    return this.makeApiCall(
      endpoint,
      {
        method: "DELETE",
        headers,
      },
      token,
    );
  }

  // File upload helper
  async uploadFile(endpoint, file, additionalData = {}, token = null) {
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
      },
      token,
    );
  }

  // Paginated GET request
  async getPaginated(
    endpoint,
    page = 1,
    pageSize = 10,
    filters = {},
    token = null,
  ) {
    const queryParams = {
      page,
      pageSize,
      ...filters,
    };

    return this.get(endpoint, queryParams, token);
  }
}

// Create singleton instance
const pageApiHelper = new PageApiHelper();

// Export both the class and instance
export { PageApiHelper };
export default pageApiHelper;
