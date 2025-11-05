import { NextResponse } from "next/server";

import routeApiHelper from "@/utils/routeApiHelper";

//Page with section
export async function GET(request, { params }) {
  const token = request.headers.get("authorization");
  const { id, itemId } = await params;

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
      `menus/${id}/menu-items/${itemId}`,
      {},
      token,
    );

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result.data,
          message: "Menu item fetched successfully",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, data: [], message: "Menu item not found" },
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

// update pagesSections
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

  const { id, itemId } = await params;

  try {
    const incomingFormData = await request.formData();

    const outgoingFormData = new FormData();

    for (const [key, value] of incomingFormData.entries()) {
      outgoingFormData.append(key, value);
    }

    const result = await routeApiHelper.put(
      `menus/${id}/menu-items/${itemId}`,
      outgoingFormData,
      token
    );

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result.data,
          message: "Menu item updated successfully",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        data: result.data,
        message: result.message || "Menu item update failed",
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

//Delete Expert
export async function DELETE(request, { params }) {
  const token = request.headers.get("authorization");
  const { id, itemId } = await params;

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

    const result = await routeApiHelper.delete(`menus/${id}/menu-items/${itemId}`, token);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Menu Item not found or deletion failed" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: result?.message || "Menu Item deleted successfully",
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
