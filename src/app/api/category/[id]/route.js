import { authOptions } from '@/libs/auth';
import apiHelper from '@/utils/apiHelper';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';




export async function DELETE(request, { params }) {
  try {
    // ✅ Step 1: Validate ID
    const { id } = params;
    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid category ID" },
        { status: 400 }
      );
    }

    // ✅ Step 2: Get Session
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ Step 3: Call backend API
    const response = await apiHelper.delete(`categories/${id}`, session);

    console.log("Delete Response:", response);

    // ✅ Step 4: Handle response
    if (!response.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete category",
          error: response.data,
        },
        { status: response.status || 500 }
      );
    }

    // ✅ Step 5: Success response
    return NextResponse.json(
      { success: true, message: "Category deleted successfully", data: response.data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}




    

export async function PUT(request, { params }) {
  try {
    const { id } = params;

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid category ID" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const contentType = request.headers.get("content-type") || "";
    let requestData;

    if (contentType.includes("application/json")) {
      const rawBody = await request.text();
      if (!rawBody.trim()) throw new Error("Empty request body");
      requestData = JSON.parse(rawBody);
    } else if (
      contentType.includes("multipart/form-data") ||
      contentType.includes("application/x-www-form-urlencoded")
    ) {
      const formData = await request.formData();
      requestData = {
        name: formData.get("name"),
        status: formData.get("status"),
        isPopular: formData.get("isPopular"),
      };
    } else {
      return NextResponse.json(
        { success: false, message: "Unsupported Content-Type" },
        { status: 415 }
      );
    }

    // Format the payload
    const finalPayload = {
      name: String(requestData.name || ""),
      status: String(requestData.status === "true"),
      isPopular: String(requestData.isPopular === "true"),
    };

    // Validation
    const validationErrors = {};
    if (!finalPayload.name.trim()) validationErrors.name = "Name is required";
    if (!["true", "false"].includes(String(requestData.status).toLowerCase()))
      validationErrors.status = "Status must be 'true' or 'false'";
    if (
      !["true", "false"].includes(String(requestData.isPopular).toLowerCase())
    )
      validationErrors.isPopular = "isPopular must be 'true' or 'false'";

    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    // Call backend API using apiHelper
    const response = await apiHelper.put(`categories/${id}`, finalPayload, session);

    if (!response.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Backend update failed",
          error: response.data,
        },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: response.data,
        message: "Category updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
