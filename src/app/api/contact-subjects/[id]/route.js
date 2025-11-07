import { NextResponse } from "next/server";

import routeApiHelper from "@/utils/routeApiHelper";

//Edit Language
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

  try {
    const { id } = await params;

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid subject ID" },
        { status: 400 },
      );
    }

    const incomingFormData = await request.formData();

    const outgoingFormData = new FormData();

    for (const [key, value] of incomingFormData.entries()) {
      outgoingFormData.append(key, value);
    }

    // Call backend API
    const response = await routeApiHelper.put(
      `contact-subjects/${id}`,
      outgoingFormData,
      token,
    );

    if (!response.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Backend update failed",
          data: response.data,
        },
        { status: response.status || 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: response.data,
        message: "Contact subject updated successfully",
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

//Delete Language
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
        { success: false, message: "Invalid contact subject ID" },
        { status: 400 },
      );
    }

    const result = await routeApiHelper.delete(`contact-subjects/${id}`, token);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Contact subject not found or deletion failed" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: result?.message || "Contact subject deleted successfully",
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
