import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pastebin-Lite",
  description: "A simple pastebin application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

