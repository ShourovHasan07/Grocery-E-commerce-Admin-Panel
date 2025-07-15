// utils/shourovApiHelper.js

import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

class ApiHelper {                                                                 
  constructor() {
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  // ✅ Get token from session (client/server aware)
  async getAuthToken(customSession = null, req = null) {
    try {
      let session = customSession;

      if (!session) {
        if (typeof window === "undefined") {
          // Server side: use request with getServerSession
          if (req) {
            session = await getServerSession({ req, ...authOptions });
          } else {
            return null;
          }
        } else {
          // Client side
          const { getSession } = await import("next-auth/react");
          session = await getSession();
        }
      }

      return session?.accessToken || session?.user?.apiToken || null;
    } catch (err) {
      return null;
    }
  }

  // ✅ Build headers with Authorization
  async buildHeaders(session = null, additionalHeaders = {}, req = null) {
    const token = await this.getAuthToken(session, req);
    const headers = {
      ...this.defaultHeaders,
      ...additionalHeaders,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  // ✅ Main API request handler
  async makeApiCall(endpoint, options = {}, session = null, req = null) {
    try {
      const isInternal = endpoint.startsWith("/api/");

      let baseUrl = "";
      if (isInternal) {
        baseUrl =
          typeof window !== "undefined"
            ? window.location.origin
            : process.env.NEXTAUTH_URL || "http://localhost:3000";
      } else {
        baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL || "";
      }

      const normalizedBaseURL = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
      const normalizedEndpoint = endpoint.startsWith("/")
        ? endpoint.slice(1)
        : endpoint;
      const url = new URL(normalizedEndpoint, normalizedBaseURL);

      const {
        method = "GET",
        body = null,
        headers: customHeaders = {},
        queryParams = {},
        ...otherOptions
      } = options;

      // Append query params
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] !== undefined && queryParams[key] !== null) {
          url.searchParams.append(key, queryParams[key]);
        }
      });

      const headers = await this.buildHeaders(session, customHeaders, req);

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

  // 🔁 HTTP helpers
  async get(endpoint, queryParams = {}, session = null, headers = {}, req = null) {
    return this.makeApiCall(
      endpoint,
      { method: "GET", queryParams, headers },
      session,
      req
    );
  }

  async post(endpoint, body = null, session = null, headers = {}, req = null) {
    return this.makeApiCall(
      endpoint,
      { method: "POST", body, headers },
      session,
      req
    );
  }

  async put(endpoint, body = null, session = null, headers = {}, req = null) {
    return this.makeApiCall(
      endpoint,
      { method: "PUT", body, headers },
      session,
      req
    );
  }

  async delete(endpoint, session = null, headers = {}, req = null) {
    return this.makeApiCall(
      endpoint,
      { method: "DELETE", headers },
      session,
      req
    );
  }
}

// ✅ Singleton export
const shourovApiHelper = new ApiHelper();
export default shourovApiHelper;
