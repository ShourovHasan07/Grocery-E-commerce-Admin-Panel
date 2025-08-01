import { NextResponse } from 'next/server';

import routeApiHelper from "@/utils/routeApiHelper";

export async function GET(request) {
  const token = request.headers.get("authorization");

  if (!token) {
    return NextResponse.json(
      { success: false, data: null, message: "Authorization header is missing" },
      { status: 401 }
    );
  }

  try {
    const result = await routeApiHelper.get('pages', { pageSize: 200 }, token);

    if (result.success) {
      return NextResponse.json(
        { success: true, data: result.data, message: "pages fetched successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, data: [], message: "pages not found" },
      { status: 404 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, data: [], message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const token = request.headers.get("authorization");

  if (!token) {
    return NextResponse.json(
      { success: false, data: null, message: "Authorization header is missing" },
      { status: 401 }
    );
  }

  try {
    const incomingFormData = await request.formData();

    const outgoingFormData = new FormData();

    for (const [key, value] of incomingFormData.entries()) {
      outgoingFormData.append(key, value);
    }

    let headerConfig = {};

    if (incomingFormData.has('image') || incomingFormData.has('meta_og_image')) {
      headerConfig = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
    }

    const result = await routeApiHelper.post('pages', outgoingFormData, token, headerConfig);

    // console.log("resData:", result);
    if (result.success) {
      return NextResponse.json(
        { success: true, data: result.data, message: "page created successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, data: result.data, message: result.message || "page creation failed" },
      { status: result.status || 400 }
    );

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message
      },
      { status: 500 }
    );
  }
}








