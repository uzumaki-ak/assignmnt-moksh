if (!process.env.GEMINI_API_KEY) {
  throw new Error('Invalid/Missing environment variable: "GEMINI_API_KEY"')
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

export async function generateGeminiResponse(message: string): Promise<string> {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are Lucy, a helpful AI assistant. Please respond to this message in a friendly and helpful way: ${message}`,
              },
            ],
          },
        ],
      }),
    })

    const data = await response.json()

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text
    } else {
      console.error("Unexpected Gemini API response format:", data)
      return "I'm sorry, I couldn't generate a response at this time. Please try again!"
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return "I'm sorry, there was an error processing your request. Please try again later!"
  }
}
