import { NextResponse } from 'next/server';


export async function GET(request) {
  try {
    // 1. Get and validate access token
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Authorization token missing or invalid",
          error: "Unauthorized" 
        },
        { status: 401 }
      );
    }
    const accessToken = authHeader.split(" ")[1];

    // 2. Construct URL safely
    const baseUrl = process.env.API_BASE_URL || "https://askvalor-api.anvs.xyz";
    const apiUrl = new URL("/api/admin/categories", baseUrl);
    apiUrl.searchParams.append("pageSize", "200");

    console.log("Fetching categories from:", apiUrl.toString());

    // 3. Make API request
    const res = await fetch(apiUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    // 4. Handle response
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({
        message: "Failed to parse error response"
      }));
      
      
      return NextResponse.json(
        { 
          success: false, 
          message: errorData.message || "Failed to fetch categories",
          error: res.statusText,
          status: res.status 
        },
        { status: res.status }
      );
    }

    const result = await res.json();
    
    // Handle different response structures
    const responseData = result.data || result.items || result;
    
   

    return NextResponse.json({ 
      success: true, 
      data: responseData,
      count: Array.isArray(responseData) ? responseData.length : undefined
    }, { 
      status: 200 
    });

  } catch (error) {
    console.error("Fetching error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal Server Error",
        message: "Failed to process categories request",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}







export async function POST(request) {
  try {
    // 1. Verify API configuration
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // 2. Parse and validate request
    let requestBody;
    try {
      requestBody = await request.json();
      if (!requestBody) throw new Error("Empty request body");
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid JSON format" },
        { status: 400 }
      );
    }

    // 3. Process payload 
    let payload;
    try {
      if (Array.isArray(requestBody)) {
        // Array format
        const getValue = (key) => {
          const item = requestBody.find(i => i?.key === key);
          return item?.value;
        };

      // get string value for backend requirment
payload = {
  name: String(requestBody?.name || ""),
  status: String(requestBody?.status),      
  isPopular: String(requestBody?.isPopular) 
};

      } else {
        // Object format
        payload = {
          name: String(requestBody?.name || ""),
          status: (requestBody?.status),
          isPopular: (requestBody?.isPopular)
        };

        //console.log("Payload being sent to backend:", payload);

      }
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid data structure" },
        { status: 400 }
      );
    }

    const validationErrors = {};
if (!payload.name.trim()) validationErrors.name = "Name is required";
if (!["true", "false"].includes(payload.status)) validationErrors.status = "Status must be 'true' or 'false'";
if (!["true", "false"].includes(payload.isPopular)) validationErrors.isPopular = "isPopular must be 'true' or 'false'";

    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationErrors
        },
        { status: 400 }
      );
    }

    // 5. Prepare API request with strict boolean values
    const apiUrl = `${baseUrl.replace(/\/$/, "")}/categories`;
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${request.headers.get("Authorization")?.split(" ")[1] || ""}`
      },
     body: JSON.stringify(payload)
    });



    

    // 6. Handle API response
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: "Category creation failed",
          apiError: error,
          status: res.status
        },
        { status: res.status }
      );
    }

    const responseData = await res.json();
    return NextResponse.json(
      { success: true, data: responseData },
      { status: 201 }
    );

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}


