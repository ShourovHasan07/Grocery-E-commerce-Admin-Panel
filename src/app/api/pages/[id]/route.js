import { NextResponse } from "next/server";

import routeApiHelper from "@/utils/routeApiHelper";

//Page detail
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
    const result = await routeApiHelper.get(`pages/${id}`, {}, token);

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result.data,
          message: "Page fetched successfully",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, data: [], message: "Page not found" },
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

//Update Page
export async function PUT(request, { params }) {
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
    const incomingFormData = await request.formData();

    const outgoingFormData = new FormData();

    for (const [key, value] of incomingFormData.entries()) {
      outgoingFormData.append(key, value);
    }

    let headerConfig = {};

    if (
      incomingFormData.has("image") ||
      incomingFormData.has("meta_og_image")
    ) {
      headerConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
    }

    const result = await routeApiHelper.put(
      `pages/${id}`,
      outgoingFormData,
      token,
      headerConfig,
    );

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result.data,
          message: "Page update successfully",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        data: result.data,
        message: result.message || "Page update failed",
      },
      { status: result.status || 400 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

//Delete Page
export async function DELETE(request, { params }) {
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
    const { id } = await params;

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid Page ID" },
        { status: 400 },
      );
    }

    const result = await routeApiHelper.delete(`pages/${id}`, token);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Page not found or deletion failed" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: result?.message || "Page deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
