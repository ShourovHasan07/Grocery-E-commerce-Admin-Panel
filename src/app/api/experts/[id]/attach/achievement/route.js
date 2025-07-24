import { NextResponse } from 'next/server';

import routeApiHelper from "@/utils/routeApiHelper";

export async function POST(request, { params }) {
  const token = request.headers.get("authorization");

  if (!token) {
    return NextResponse.json(
      { success: false, data: null, message: "Authorization header is missing" },
      { status: 401 }
    );
  }

  const { id } = await params;
  try {
    const incomingFormData = await request.formData();

    const outgoingFormData = new FormData();

    for (const [key, value] of incomingFormData.entries()) {
      outgoingFormData.append(key, value);
    }

    const result = await routeApiHelper.post(`experts/${id}/attach/achievement`, outgoingFormData, token);
    if (result.success) {
      return NextResponse.json(
        { success: true, data: result.data, message: "experts achievement created successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, data: result.data, message: result.message || "experts achievement  creation failed" },
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























