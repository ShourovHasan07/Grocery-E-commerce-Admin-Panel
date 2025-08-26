import { NextResponse } from "next/server";

import routeApiHelper from "@/utils/routeApiHelper";

//Delete Slot
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
    const { id, slotId } = await params;

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid expert ID" },
        { status: 400 },
      );
    }

    if (!slotId || !/^\d+$/.test(slotId)) {
      return NextResponse.json(
        { success: false, message: "Invalid time-slot ID" },
        { status: 400 },
      );
    }

    const result = await routeApiHelper.delete(
      `experts/time-slot/${slotId}/delete`,
      token,
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "time-slot not found or deletion failed" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: result?.message || "time-slot deleted successfully",
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
