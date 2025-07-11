// utils/shourovApiHelper.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

class ApiHelper {
  constructor() {
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  // 🔐 Token নেওয়ার জন্য method
  async getAuthToken(customSession = null) {
    try {
      let session = customSession;

      if (!session) {
        if (typeof window === "undefined") {
          // Server side
          session = await getServerSession(authOptions);
        } else {
          // Client side
          const { getSession } = await import("next-auth/react");
          session = await getSession();
        }
      }

      return session?.accessToken || session?.user?.apiToken || null;
    } catch {
      return null;
    }
  }

  // 🔧 Header বানানো
  async buildHeaders(session = null, additionalHeaders = {}) {
    const token = await this.getAuthToken(session);
    const headers = {
      ...this.defaultHeaders,
      ...additionalHeaders,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  // 🌐 API call করার মূল method
  async makeApiCall(endpoint, options = {}, session = null) {
    try {
      const isInternal = endpoint.startsWith("/api/");

      // ✅ Fix for internal API routes on server/client
      let baseUrl = "";

      if (isInternal) {
        if (typeof window !== "undefined") {
          baseUrl = window.location.origin;
        } else {
          baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        }
      } else {
        baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || "";
      }

      const normalizedBaseURL = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
      const normalizedEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
      const url = new URL(normalizedEndpoint, normalizedBaseURL);

      const {
        method = "GET",
        body = null,
        headers: customHeaders = {},
        queryParams = {},
        ...otherOptions
      } = options;

      // Query param সেট করা
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] !== undefined && queryParams[key] !== null) {
          url.searchParams.append(key, queryParams[key]);
        }
      });

      const headers = await this.buildHeaders(session, customHeaders);

      const fetchOptions = {
        method,
        headers,
        ...otherOptions,
      };

      if (body && method !== "GET") {
        if (body instanceof FormData) {
          delete fetchOptions.headers["Content-Type"];
          fetchOptions.body = body;
        } else {
          fetchOptions.body = JSON.stringify(body);
        }
      }

      const response = await fetch(url.toString(), fetchOptions);

      const contentType = response.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data,
        headers: response.headers,
        raw: response,
      };
    } catch (error) {
      return {
        success: false,
        status: 0,
        statusText: "Network Error",
        data: null,
        error: error.message,
      };
    }
  }

  // 📦 Shortcut methods
  async get(endpoint, queryParams = {}, session = null, headers = {}) {
    return this.makeApiCall(
      endpoint,
      { method: "GET", queryParams, headers },
      session
    );
  }

  async post(endpoint, body = null, session = null, headers = {}) {
    return this.makeApiCall(
      endpoint,
      { method: "POST", body, headers },
      session
    );
  }

  async put(endpoint, body = null, session = null, headers = {}) {
    return this.makeApiCall(
      endpoint,
      { method: "PUT", body, headers },
      session
    );
  }

  async delete(endpoint, session = null, headers = {}) {
    return this.makeApiCall(
      endpoint,
      { method: "DELETE", headers },
      session
    );
  }
}

// ✅ Export singleton instance
const shourovApiHelper = new ApiHelper();
export default shourovApiHelper;
