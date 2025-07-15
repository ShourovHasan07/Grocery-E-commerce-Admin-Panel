import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from "@/libs/auth";
import apiHelper from "@/utils/apiHelper";
import shourovApiHelper from '@/utils/shourovApiHelper';


export async function GET(request) {
  try {
    //  1: Get session
    const session = await getServerSession(authOptions);
    console.log("Session Info:", session);

    //  2: Check token
    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    //  3: Call external API (Admin API)
    const result = await apiHelper.get("categories", { pageSize: 200 }, session);

    

    //  Step 4: Handle result
    if (result.success) {
      return NextResponse.json(result.data, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to fetch categories", error: result.data },
        { status: result.status || 500 }
      );
    }

  } catch (error) {
    console.error("GET /api/category error:", error);

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






//Add Category 







export async function POST(request) {


  try {

     const session = await getServerSession(authOptions);



     if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

   
    

    // 2. Parse request
    const contentType = request.headers.get("content-type") || "";
    let requestData;

    if (
      contentType.includes("multipart/form-data") ||
      contentType.includes("application/x-www-form-urlencoded")
    ) {
      // Handle form data
     // console.log("Processing multipart/form-data");
      const formData = await request.formData();

      //console.log("FormData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      requestData = {
        name: formData.get("name"),
        status: formData.get("status"),
        isPopular: formData.get("isPopular"),
      };
    } else if (contentType.includes("application/json")) {
      // Handle JSON
      ;
      const rawBody = await request.text();
     

      if (!rawBody.trim()) throw new Error("Empty request body");

      requestData = JSON.parse(rawBody);
    } else {
      return NextResponse.json(
        { success: false, message: "Unsupported Content-Type" },
        { status: 415 }
      );
    }

   

    // 3. Process payload for backend (convert to string)
    let payload;
    if (Array.isArray(requestData)) {
      // Array format (if needed)
      const getValue = (key) => {
        const item = requestData.find((i) => i?.key === key);
        return item?.value;
      };
      payload = {
        name: String(getValue("name") || ""),
        status: String(getValue("status") || ""),
        isPopular: String(getValue("isPopular") || ""),
      };
    } else {
      // Object format
      payload = {
        name: String(requestData.name || ""),
        status: String(requestData.status || ""),
        isPopular: String(requestData.isPopular || ""),
      };
    }

    console.log("Payload being sent to backend:", payload);

    // 4. Validation
    const validationErrors = {};
    if (!payload.name.trim()) validationErrors.name = "Name is required";
    if (!["true", "false"].includes(payload.status))
      validationErrors.status = "Status must be 'true' or 'false'";
    if (!["true", "false"].includes(payload.isPopular))
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


    // 5. Send to backend API
const res = await apiHelper.post("categories", payload, session);
console.log(res)

// 6. Handle backend response
if (!res.success) {
  const error = res.data || {};
  return NextResponse.json(
    {
      success: false,
      message: "Category creation failed",
      apiError: error,
      status: res.status,
    },
    { status: res.status }
  );
}

// ✅ Success
return NextResponse.json(
  { success: true, data: res.data },
  { status: 201 }
);



    
      
      
  
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
