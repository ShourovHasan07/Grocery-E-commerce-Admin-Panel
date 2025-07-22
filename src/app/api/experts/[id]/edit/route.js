import { NextResponse } from 'next/server';

import routeApiHelper from "@/utils/routeApiHelper";




// view Data GET requst 


export async function GET(request,{ params }) {

  



  const token = request.headers.get("authorization");


     

  if (!token) {
    return NextResponse.json(
      { success: false, data: null, message: "Authorization header is missing" },
      { status: 401 }
    );
  }

   const { id } = await params;

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








//submit dada PUT request



export async function PUT(request,{params}) {
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


    const result = await routeApiHelper.put(`experts/${id}`,  outgoingFormData, token, headerConfig);

    if (result.success) {
      return NextResponse.json(
        { success: true, data: result.data, message: "experts update successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, data: result.data, message: result.message || "experts update failed" },
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























