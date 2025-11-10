import { NextResponse } from "next/server";

import routeApiHelper from "@/utils/routeApiHelper";

// about Roles

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
      `roles/${id}`,
      { pageSize: 200 },
      token,
    );

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result.data,
          message: "roles fetched successfully",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { success: false, data: [], message: "roles not found" },
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

//Edit roles
export async function PUT(request, { params }) {
  const token = request.headers.get("authorization");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Authorization header is missing" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid role ID" },
        { status: 400 }
      );
    }

    // JSON parse
    const body = await request.json();

    const response = await routeApiHelper.put(
      `roles/${id}`,
      body,
      token,
      { headers: { "Content-Type": "application/json" } }
    );

    if (!response.success) {
      return NextResponse.json(
        { success: false, message: "Backend update failed", data: response.data },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: response.data, message: "Role updated  successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}


//Delete Category
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
        { success: false, message: "Invalid category ID" },
        { status: 400 },
      );
    }

    const result = await routeApiHelper.delete(`roles/${id}`, token);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "roles not found or deletion failed" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: result?.message || "roles deleted successfully",
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
