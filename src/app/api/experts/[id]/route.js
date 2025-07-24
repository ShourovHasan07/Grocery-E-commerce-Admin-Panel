import { NextResponse } from 'next/server';

import routeApiHelper from "@/utils/routeApiHelper";

export async function GET(request, { params }) {
  const token = request.headers.get("authorization");

  const { id } = await params;

  if (!token) {
    return NextResponse.json(
      { success: false, data: null, message: "Authorization header is missing" },
      { status: 401 }
    );
  }

  try {
    const result = await routeApiHelper.get(`experts/${id}`, { pageSize: 200 }, token);

    if (result.success) {
      return NextResponse.json(
        { success: true, data: result.data, message: "experts fetched successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, data: [], message: "experts not found" },
      { status: 404 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, data: [], message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

//Delete Expert
export async function DELETE(request, { params }) {
  const token = request.headers.get("authorization");

  if (!token) {
    return NextResponse.json(
      { success: false, data: null, message: "Authorization header is missing" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid Expert ID' },
        { status: 400 }
      );
    }

    const result = await routeApiHelper.delete(`experts/${id}`, token);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Expert not found or deletion failed' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: result, message: result?.message || 'Expert deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }

}




