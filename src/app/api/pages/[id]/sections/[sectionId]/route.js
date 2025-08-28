import { NextResponse } from "next/server";

import routeApiHelper from "@/utils/routeApiHelper";

//Page with section
export async function GET(request, { params }) {
  const token = request.headers.get("authorization");
  const { id, sectionId } = await params;

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
      `pages/${id}/sections/${sectionId}`,
      {},
      token,
    );

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result.data,
          message: "Page section fetched successfully",
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

  const { id, sectionId } = await params;

  try {
    const incomingFormData = await request.formData();

    const outgoingFormData = new FormData();

    for (const [key, value] of incomingFormData.entries()) {
      outgoingFormData.append(key, value);
    }

    let headerConfig = {};

    if (incomingFormData.has("image")) {
      headerConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
    }

    const result = await routeApiHelper.put(
      `pages/${id}/sections/${sectionId}`,
      outgoingFormData,
      token,
      headerConfig,
    );

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: result.data,
          message: "Page section update successfully",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        data: result.data,
        message: result.message || "Page section update failed",
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
