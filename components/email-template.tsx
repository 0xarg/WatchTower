import { formatDistanceToNow } from "date-fns";
import { ActivityIcon } from "lucide-react";

interface EmailTemplateProps {
  userName?: string;
  monitorName: string;
  monitorUrl: string;
  message: string;
  status: string;
  startedAt?: string;
}

export function EmailTemplate({
  userName = "there",
  monitorName,
  monitorUrl,
  message,
  status,
  startedAt,
}: EmailTemplateProps) {
  const isDown = status === "down";

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#111" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: "4px solid",
          borderColor: isDown ? "#e11d48" : "#22c55e",
          paddingBottom: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>
          {isDown ? "🔴 New incident started" : "🟢 Incident resolved"}
        </h2>
      </div>

      {/* Greeting */}
      <p style={{ marginTop: 24 }}>Hello {userName},</p>

      <p>{message}</p>

      {/* Incident Details */}
      <div
        style={{
          background: "#f8fafc",
          padding: 16,
          borderRadius: 6,
          marginTop: 16,
        }}
      >
        <p>
          <strong>Monitor:</strong> {monitorName}
        </p>
        <p>
          <strong>Checked URL:</strong> <a href={monitorUrl}>{monitorUrl}</a>
        </p>
        {startedAt && (
          <p>
            <strong>Started at:</strong>{" "}
            {formatDistanceToNow(new Date(startedAt))}
          </p>
        )}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 24 }}>
        <a
          href={`${monitorUrl}`}
          style={{
            display: "inline-block",
            padding: "10px 16px",
            background: isDown ? "#e11d48" : "#22c55e",
            color: "#fff",
            borderRadius: 6,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          View monitor
        </a>
      </div>

      {/* Footer */}
      <p style={{ marginTop: 32, fontSize: 12, color: "#555" }}>
        You are receiving this email because WatchTower is monitoring this URL.
      </p>
    </div>
  );
}
