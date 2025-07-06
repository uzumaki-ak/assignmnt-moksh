import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { generateGeminiResponse } from "@/lib/gemini"
import { error } from "console"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("chatApp")

    const messages = await db.collection("messages").find({}).sort({ timestamp: 1 }).toArray()

    // Converts the  manongoDB _id to string for frontend
    const formattedMessages = messages.map((msg) => ({
      ...msg,
      _id: msg._id.toString(),
    }))

    return NextResponse.json(formattedMessages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content, isGreeting } = await request.json()

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("chatApp")

    // Shaving user message
    const timestamp = new Date()
    const userMessageResult = await db.collection("messages").insertOne({
      content,
      sender: "user",
      timestamp,
    })

    const userMessage = {
      _id: userMessageResult.insertedId.toString(),
      content,
      sender: "user",
      timestamp: timestamp.toISOString(),
    }

    // If  greeting message, don't generate bot response
    if (isGreeting) {
      const botMessageResult = await db.collection("messages").insertOne({
        content,
        sender: "bot",
        timestamp,
      })

      return NextResponse.json({
        botMessage: {
          _id: botMessageResult.insertedId.toString(),
          content,
          sender: "bot",
          timestamp: timestamp.toISOString(),
        },
      })
    }

    // Generating bot response using gemini-api
    const botResponse = await generateGeminiResponse(content)

    // Savng bot mesg
    const botMessageResult = await db.collection("messages").insertOne({
      content: botResponse,
      sender: "bot",
      timestamp: new Date(),
    })

    const botMessage = {
      _id: botMessageResult.insertedId.toString(),
      content: botResponse,
      sender: "bot",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      userMessage,
      botMessage,
    })
  } catch (error) {
    console.error("Error saving message:", error)
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const client = await clientPromise
    const db = client.db("chatApp")

    const getMessages = await db.collection("messages").countDocuments();

    if (getMessages >=10) {
return NextResponse.json({error: "limit recahed"}, {status: 400})
    }

    // Deleting all messages when starting new chat
    await db.collection("messages").deleteMany({})

    return NextResponse.json({ message: "Chat cleared successfully" })
  } catch (error) {
    console.error("Error clearing chat:", error)
    return NextResponse.json({ error: "Failed to clear chat" }, { status: 500 })
  }
}
