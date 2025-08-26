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

  const { searchParams } = new URL(request.url);
  const allParamAsObj = Object.fromEntries(searchParams.entries());

  try {
    const result = await routeApiHelper.get(
      "admins/create-edit-options",
      allParamAsObj,
      token,
    );

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result.data,
          message: "Options fetched successfully",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, data: [], message: "Options not found" },
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
