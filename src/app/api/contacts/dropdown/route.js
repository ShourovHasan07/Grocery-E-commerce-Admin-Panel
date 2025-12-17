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
    const result = await routeApiHelper.get("contact-dropdown", {}, token);

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result.data,
          message: "contact dropdown fetched successfully",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, data: [], message: "contact dropdown not found" },
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
