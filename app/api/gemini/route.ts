import { type NextRequest, NextResponse } from "next/server"
import { generateGeminiResponse } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const response = await generateGeminiResponse(message)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error generating Gemini response:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
