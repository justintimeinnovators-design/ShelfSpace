import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const USER_SERVICE_URL = process.env["USER_SERVICE_URL"] || "http://localhost:3001/api";

/**
 * GET.
 * @param _req - req value.
 * @param { params } - { params } value.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { userId } = await params;

    const response = await fetch(`${USER_SERVICE_URL}/users/${userId}/public`, {
      headers: {
        ...(session?.accessToken && { Authorization: `Bearer ${session.accessToken}` }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error proxying public user request:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
