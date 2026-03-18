import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const USER_SERVICE_URL = process.env['USER_SERVICE_URL'] || "http://localhost:3001/api";

/**
 * GET.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("=== GET /api/user/preferences ===");
    console.log("Session exists:", !!session);
    console.log("Access token exists:", !!session?.accessToken);
    
    if (!session?.accessToken) {
      console.error("No access token in session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = `${USER_SERVICE_URL}/me/preferences`;
    console.log("Calling user service at:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    console.log("User service response status:", response.status);

    const data = await response.json();
    console.log("User service response data:", data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error proxying preferences request:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT.
 * @param req - req value.
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("=== PUT /api/user/preferences ===");
    console.log("Session exists:", !!session);
    console.log("Access token exists:", !!session?.accessToken);
    
    if (!session?.accessToken) {
      console.error("No access token in session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Request body:", body);
    
    const url = `${USER_SERVICE_URL}/me/preferences`;
    console.log("Calling user service at:", url);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    console.log("User service response status:", response.status);
    
    const data = await response.json();
    console.log("User service response data:", data);
    
    if (!response.ok) {
      console.error("User service returned error:", data);
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error proxying preferences update:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
