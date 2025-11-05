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
      `menus/${id}/menu-items`,
      {},
      token,
    );

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result.data,
          message: "menus fetched successfully",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, data: [], message: "menus not found" },
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

//Create Menu Item
export async function POST(request, { params }) {
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

  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid menu ID" },
      { status: 400 },
    );
  }

  try {
    const incomingFormData = await request.formData();

    const outgoingFormData = new FormData();

    for (const [key, value] of incomingFormData.entries()) {
      outgoingFormData.append(key, value);
    }

    // Call backend API
    const response = await routeApiHelper.post(
      `menus/${id}/menu-items`,
      outgoingFormData,
      token
    );

    if (!response.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Menu Item creation failed",
          data: response.data,
        },
        { status: response.status || 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: response.data,
        message: "Menu Item created successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error?.message,
      },
      { status: 500 },
    );
  }
}
