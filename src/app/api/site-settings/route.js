import { NextResponse } from "next/server";

import routeApiHelper from "@/utils/routeApiHelper";

export async function GET(request) {
  const token = request.headers.get("authorization");

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Authorization header is missing",
      },
      { status: 401 },
    );
  }

  try {
    const result = await routeApiHelper.get("site-settings", {}, token);

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result?.data?.data || {},
          message: "site settings fetched successfully",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, data: [], message: "site settings not found" },
      { status: 404 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  const token = request.headers.get("authorization");

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Authorization header is missing",
      },
      { status: 401 },
    );
  }

  try {
    const incomingFormData = await request.formData();

    const outgoingFormData = new FormData();

    for (const [key, value] of incomingFormData.entries()) {
      outgoingFormData.append(key, value);
    }

    let headerConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const result = await routeApiHelper.post(
      "site-settings",
      outgoingFormData,
      token,
      headerConfig,
    );

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result.data,
          message: "Site settings updated successfully",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        data: result.data || {},
        message: result.message || "Site settings update failed",
      },
      { status: result.status || 400 },
    );
  } catch (error) {
    console.log("Site settings update error:", error);
    
return NextResponse.json(
      {
        success: false,
        data: {},
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
