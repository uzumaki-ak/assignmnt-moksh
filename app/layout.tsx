import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat Assignment",
  description: "Assignment ",
  keywords: "chat, assignment, nextjs, mongodb, gemini",
  authors: [{ name: "Anikesh kUamr" }],
  icons: "/title.jpg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
