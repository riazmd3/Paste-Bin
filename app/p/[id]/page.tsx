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
    <div style={styles.container}>
      <div style={styles.contentBox}>
        <pre style={styles.pre}>{escapeHtml(paste.content)}</pre>
      </div>
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Created by <strong>Riaz Mohammed</strong> | 
          Email: <a href="mailto:riazmohemed0@gmail.com" style={styles.footerLink}>riazmohemed0@gmail.com</a> | 
          Candidate ID: <strong>Naukri0126</strong>
        </p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  contentBox: {
    maxWidth: "1000px",
    margin: "40px auto",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "40px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  pre: {
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    margin: "0",
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#333",
    fontFamily: "monospace",
  },
  footer: {
    maxWidth: "1000px",
    margin: "40px auto 20px",
    textAlign: "center" as const,
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  footerText: {
    margin: "0",
    fontSize: "13px",
    color: "#666",
  },
  footerLink: {
    color: "#667eea",
    textDecoration: "none",
  },
};
