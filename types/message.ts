export interface Message {
  _id: string
  content: string
  sender: "user" | "bot"
  timestamp: string
}
