import { NextResponse } from "next/server";

import routeApiHelper from "@/utils/routeApiHelper";

export async function GET(request, { params }) {
  const token = request.headers.get("authorization");

  const { id } = await params;

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
    const result = await routeApiHelper.get(
      `transactions/${id}`,
      { pageSize: 200 },
      token,
    );

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result.data,
          message: "transaction fetched successfully",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, data: [], message: "transaction not found" },
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
