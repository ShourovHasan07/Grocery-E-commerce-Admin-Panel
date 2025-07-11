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
  // First check content type
  const contentType = request.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Content-Type must be application/json' 
      },
      { status: 415 } // 415 Unsupported Media Type
    );
  }

  try {
    // Now safely parse the JSON body
    const requestBody = await request.json();
    
    // Validate required fields
    if (!requestBody.name) {
      return NextResponse.json(
        { success: false, message: 'Category name is required' },
        { status: 400 }
      );
    }

    // Process the request...
    const response = await fetch('https://your-api-endpoint.com/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YOUR_TOKEN}`
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}








