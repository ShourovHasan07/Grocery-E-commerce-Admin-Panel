import { NextResponse } from "next/server";

import routeApiHelper from "@/utils/routeApiHelper";

export async function GET(request, { params }) {
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

  const { id } = await params;

  try {
    const result = await routeApiHelper.get(
      `experts/${id}/with-list`,
      { model: "availabilities" },
      token,
    );

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          expert: result?.data?.expert,
          message: "expert availabilities fetched successfully",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, data: [], message: "expert availabilities not found" },
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
