import { NextResponse } from 'next/server';

import routeApiHelper from "@/utils/routeApiHelper";

//Edit Category
export async function POST(request, { params }) {
  const token = request.headers.get("authorization");

  if (!token) {
    return NextResponse.json(
      { success: false, data: null, message: "Authorization header is missing" },
      { status: 401 }
    );
  }

  try {
    const { id, slotId } = await params;

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid expert ID' },
        { status: 400 }
      );
    }

    if (!slotId || !/^\d+$/.test(slotId)) {
      return NextResponse.json(
        { success: false, message: "Invalid time-slot ID" },
        { status: 400 }
      );
    }

    const incomingFormData = await request.formData();

    const outgoingFormData = new FormData();

    for (const [key, value] of incomingFormData.entries()) {
      outgoingFormData.append(key, value);
    }

    // Call backend API using apiHelper
    const response = await routeApiHelper.post(`experts/time-slot/${slotId}/edit`, outgoingFormData, token);

    if (!response.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Backend update failed",
          data: response.data,
        },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: response.data,
        message: "time-slot updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}










