import { NextRequest, NextResponse } from "next/server";

const FEEDBACK_WEBHOOK_URL = process.env["FEEDBACK_WEBHOOK_URL"];

/**
 * POST.
 * @param request - request value.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const feedback = typeof body?.feedback === "string" ? body.feedback.trim() : "";

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback is required" },
        { status: 400 }
      );
    }

    const payload = {
      ...body,
      feedback,
      receivedAt: new Date().toISOString(),
    };

    if (FEEDBACK_WEBHOOK_URL) {
      const response = await fetch(FEEDBACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: "Failed to forward feedback" },
          { status: 502 }
        );
      }
    } else {
      console.log("[Feedback]", payload);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
