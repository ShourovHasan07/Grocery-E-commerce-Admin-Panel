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
      `experts/${id}/reviews`,
      { pageSize: 500 },
      token,
    );

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result?.data || [],
          message: "Reviews fetched successfully",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, data: [], message: "Reviews not found" },
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

export async function POST(request, { params }) {
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
  const { reviewId } = await request.json();

  try {
    const result = await routeApiHelper.post(
      `experts/reviews/${id}/edit`,
      { reviewId: reviewId },
      token,
    );

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          reviews: result?.data?.reviews || [],
          expert: result?.data?.expert || null,
          message: "Review status changed successfully",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, reviews: [], expert: null, message: "Reviews not found" },
      { status: 404 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        reviews: [],
        expert: null,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
