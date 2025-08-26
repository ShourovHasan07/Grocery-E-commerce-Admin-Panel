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
    const { searchParams } = new URL(request.url);
    const model = searchParams.get("model") || "all";
    const status = searchParams.get("status") || true;

    // console.log(model)

    const result = await routeApiHelper.get(
      "experts/menu-options",
      { model, status },
      token,
    );

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result.data,
          message: "experts create-options fetched successfully",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, data: [], message: "experts create-options not found" },
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
