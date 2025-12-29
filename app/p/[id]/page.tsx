import { getPaste } from "@/lib/redis";
import { getCurrentTimeMs } from "@/lib/time";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

async function getPasteData(id: string) {
  const headersList = await headers();
  // Create a mock request object for getCurrentTimeMs
  const headerMap: Record<string, string> = {};
  headersList.forEach((value, key) => {
    headerMap[key] = value;
  });
  
  const request = {
    headers: {
      get: (name: string) => headerMap[name.toLowerCase()] || null,
    },
  } as Request;
  
  const now = getCurrentTimeMs(request);

  const paste = await getPaste(id);

  if (!paste) {
    return null;
  }

  // Check expiration
  if (paste.expires_at !== null && now >= paste.expires_at) {
    return null;
  }

  // Check view limit
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return null;
  }

  return paste;
}

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const paste = await getPasteData(params.id);

  if (!paste) {
    notFound();
  }

  return (
    <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
      {escapeHtml(paste.content)}
    </pre>
  );
}

