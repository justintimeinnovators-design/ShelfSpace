import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const CHATBOT_URL = process.env['CHATBOT_SERVICE_URL'] || 
  (process.env.NODE_ENV === "production"
    ? "http://chatbot-service:8000/chat"
    : "http://localhost:8000/chat");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Forward request to chatbot service with session ID
    const response = await axios.post(
      CHATBOT_URL,
      {
        query: message,
        session_id: sessionId, // Pass session ID to maintain context
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    const { answer, session_id } = response.data;

    return NextResponse.json({
      response: answer,
      sessionId: session_id,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Chatbot API error:", error);

    // Handle timeout
    if (error.code === "ECONNABORTED") {
      return NextResponse.json(
        { error: "Request timeout - chatbot service took too long to respond" },
        { status: 504 }
      );
    }

    // Handle connection errors
    if (error.code === "ECONNREFUSED") {
      return NextResponse.json(
        { error: "Chatbot service is unavailable" },
        { status: 503 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: "Failed to get response from chatbot",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
