import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    // 1. Validate ID
    const { id } = await params;
    if (!id || !/^\d+$/.test(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // 2. Check authentication
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 3. Call external API
    const apiUrl = `${process.env.API_BASE_URL || 'https://askvalor-api.anvs.xyz'}/api/admin/categories/${id}`;
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(response)

    // 4. Handle response
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, message: error.message || 'Failed to delete' },
        { status: response.status }
      );
    }

    // 5. Return success
    const result = await response.json();
    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
