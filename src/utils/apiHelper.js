import { getServerSession } from "next-auth";

import { authOptions } from "@/libs/auth";

class ApiHelper {
  constructor() {
    this.baseUrl = process.env.ADMIN_API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Get session and token (works in both server and client)
  async getAuthToken(customSession = null) {
    try {
      let session = customSession;

      // If no session provided, try to get it
      if (!session) {
        // Check if we're on server side
        if (typeof window === 'undefined') {
          session = await getServerSession(authOptions);
        } else {
          // Client side - you'd need to pass session from component
          // or use next-auth/react getSession()
          const { getSession } = await import('next-auth/react');

          session = await getSession();
        }
      }

      return session?.accessToken || session?.user?.apiToken || null;
    } catch (error) {
      // console.error('Error getting auth token:', error);

      return null;
    }
  }

  // Build headers with authentication
  async buildHeaders(session = null, additionalHeaders = {}) {
    const token = await this.getAuthToken(session);

    const headers = {
      ...this.defaultHeaders,
      ...additionalHeaders
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Generic API call method
  async makeApiCall(endpoint, options = {}, session = null) {
    try {
      const {
        method = 'GET',
        body = null,
        headers: customHeaders = {},
        queryParams = {},
        ...otherOptions
      } = options;

      // Build URL with query parameters
      const url = new URL(`${this.baseUrl}${endpoint}`);

      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] !== undefined && queryParams[key] !== null) {
          url.searchParams.append(key, queryParams[key]);
        }
      });

      // Build headers
      const headers = await this.buildHeaders(session, customHeaders);

      // Prepare fetch options
      const fetchOptions = {
        method,
        headers,
        ...otherOptions
      };

      // Add body if provided (and not GET request)
      if (body && method !== 'GET') {
        if (body instanceof FormData) {
          // Remove Content-Type for FormData (browser will set it)
          delete fetchOptions.headers['Content-Type'];
          fetchOptions.body = body;
        } else if (typeof body === 'object') {
          fetchOptions.body = JSON.stringify(body);
        } else {
          fetchOptions.body = body;
        }
      }

      // Make the API call
      const response = await fetch(url.toString(), fetchOptions);

      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
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
        raw: response
      };

    } catch (error) {
      console.error('API call failed:', error);

      return {
        success: false,
        status: 0,
        statusText: 'Network Error',
        data: null,
        error: error.message
      };
    }
  }

  // Convenience methods for different HTTP verbs
  async get(endpoint, queryParams = {}, session = null, headers = {}) {
    return this.makeApiCall(endpoint, {
      method: 'GET',
      queryParams,
      headers
    }, session);
  }

  async post(endpoint, body = null, session = null, headers = {}) {
    return this.makeApiCall(endpoint, {
      method: 'POST',
      body,
      headers
    }, session);
  }

  async put(endpoint, body = null, session = null, headers = {}) {
    return this.makeApiCall(endpoint, {
      method: 'PUT',
      body,
      headers
    }, session);
  }

  async patch(endpoint, body = null, session = null, headers = {}) {
    return this.makeApiCall(endpoint, {
      method: 'PATCH',
      body,
      headers
    }, session);
  }

  async delete(endpoint, session = null, headers = {}) {
    return this.makeApiCall(endpoint, {
      method: 'DELETE',
      headers
    }, session);
  }

  // File upload helper
  async uploadFile(endpoint, file, additionalData = {}, session = null) {
    const formData = new FormData();

    formData.append('file', file);

    // Add additional form data
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.makeApiCall(endpoint, {
      method: 'POST',
      body: formData
    }, session);
  }

  // Paginated GET request
  async getPaginated(endpoint, page = 1, pageSize = 10, filters = {}, session = null) {
    const queryParams = {
      page,
      pageSize,
      ...filters
    };

    return this.get(endpoint, queryParams, session);
  }
}

// Create singleton instance
const apiHelper = new ApiHelper();

// Export both the class and instance
export { ApiHelper };
export default apiHelper;

// Alternative functional approach
export const api = {
  // Simple wrapper functions
  async call(endpoint, options = {}, session = null) {
    return apiHelper.makeApiCall(endpoint, options, session);
  },

  async get(endpoint, params = {}, session = null) {
    return apiHelper.get(endpoint, params, session);
  },

  async post(endpoint, data = null, session = null) {
    return apiHelper.post(endpoint, data, session);
  },

  async put(endpoint, data = null, session = null) {
    return apiHelper.put(endpoint, data, session);
  },

  async patch(endpoint, data = null, session = null) {
    return apiHelper.patch(endpoint, data, session);
  },

  async delete(endpoint, session = null) {
    return apiHelper.delete(endpoint, session);
  }
};
