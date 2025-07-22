import { NextResponse } from 'next/server';

import routeApiHelper from "@/utils/routeApiHelper";


// experts Acivements delete 



export async function POST(request, { params }) {
  const token = request.headers.get("authorization");

  if (!token) {
    return NextResponse.json(
      { success: false, data: null, message: "Authorization header is missing" },
      { status: 401 }
    );
  }

  try {
    // 1. Validate ID
    const { id } = await params;

    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid experts acivement  ID' },
        { status: 400 }
      );
    }

    const incomingFormData = await request.formData();

    const outgoingFormData = new FormData();

    for (const [key, value] of incomingFormData.entries()) {
      outgoingFormData.append(key, value);
    }

    let headerConfig = {};

    

    const result = await routeApiHelper.post(`experts/${id}/detach/language`, outgoingFormData, token, headerConfig);



    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'experts acivement  not found or deletion failed' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: result, message: result?.message || 'experts acivement  deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}













