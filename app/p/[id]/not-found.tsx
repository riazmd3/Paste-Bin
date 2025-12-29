import { CSSProperties } from "react";

export default function NotFound() {
  return (
    <div style={styles.container}>
      <div style={styles.contentBox}>
        <h1 style={styles.title}>404 - Paste Not Found</h1>
        <p style={styles.message}>
          The paste you are looking for does not exist, has expired, or has reached its view limit.
        </p>
        <a href="/" style={styles.link}>
          ← Back to Home
        </a>
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

const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  contentBox: {
    maxWidth: "600px",
    margin: "100px auto",
    textAlign: "center",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "60px 40px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "48px",
    fontWeight: "700",
    margin: "0 0 20px 0",
    color: "#1a1a1a",
  },
  message: {
    fontSize: "16px",
    color: "#666",
    margin: "0 0 30px 0",
    lineHeight: "1.6",
  },
  link: {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: "#667eea",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "600",
    transition: "background-color 0.2s",
  },
  footer: {
    maxWidth: "600px",
    margin: "20px auto",
    textAlign: "center",
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
