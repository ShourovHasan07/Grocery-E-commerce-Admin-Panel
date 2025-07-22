import { NextResponse } from 'next/server';

import routeApiHelper from "@/utils/routeApiHelper";



export async function POST(request,{params}) {
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

    let headerConfig = {};

    if (incomingFormData.has('image')) {
      headerConfig = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
    }


    const result = await routeApiHelper.post(`experts/${id}/attach/language`,  outgoingFormData, token, headerConfig);

  
    if (result.success) {
      return NextResponse.json(
        { success: true, data: result.data, message: "experts language created successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, data: result.data, message: result.message || "experts language  creation failed" },
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























