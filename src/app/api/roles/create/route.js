import { NextResponse } from "next/server";
import routeApiHelper from "@/utils/routeApiHelper";

export async function POST(request) {
  const token = request.headers.get("authorization");

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Authorization header is missing",
      },
      { status: 401 }
    );
  }

  try {
    const contentType = request.headers.get("content-type");

    let payload = null;
    let headerConfig = {};

    // ✅ JSON Request Fix
    if (contentType.includes("application/json")) {
      payload = await request.json();
      headerConfig = {
        headers: { "Content-Type": "application/json" },
      };
    }
    // ✅ form-data Fix (existing code kept)
    else {
      const incomingFormData = await request.formData();
      const outgoingFormData = new FormData();

      for (const [key, value] of incomingFormData.entries()) {
        outgoingFormData.append(key, value);
      }

      payload = outgoingFormData;

      headerConfig = {
        headers: { "Content-Type": "multipart/form-data" },
      };
    }

    // ✅ API Call
    const result = await routeApiHelper.post(
      "roles",
      payload,
      token,
      headerConfig
    );

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result.data,
          message: "roles created successfully",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        data: result.data,
        message: result.message || "roles creation failed",
      },
      { status: result.status || 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
