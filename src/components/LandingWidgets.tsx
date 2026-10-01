"use client";

import { useEffect, useState } from "react";

export function CopyBtn({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <button onClick={copy} className={`${className ?? ""} ${copied ? "copied" : ""}`.trim()}>
      {copied ? "Copied" : children}
    </button>
  );
}

const CLIENTS = ["Claude", "Cursor", "ChatGPT", "Windsurf", "your own agent"];

export function CyclingClient() {
  const [idx, setIdx] = useState(0);
  const [state, setState] = useState<"visible" | "exiting" | "entering">("visible");

  useEffect(() => {
    const interval = setInterval(() => {
      setState("exiting");
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % CLIENTS.length);
        setState("entering");
      }, 260);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (state === "entering") {
      const raf = requestAnimationFrame(() => {
        setState("visible");
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [state]);

  return (
    <span
      className="cycle"
      style={{
        display: "inline-block",
        transition: state === "entering" ? "none" : "opacity 0.26s cubic-bezier(0.16, 1, 0.3, 1), transform 0.26s cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: state === "visible" ? 1 : 0,
        transform:
          state === "visible"
            ? "translateY(0)"
            : state === "exiting"
            ? "translateY(-4px)"
            : "translateY(4px)",
      }}
    >
      {CLIENTS[idx]}
    </span>
  );
}

export function UsageCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setCount(d.total ?? 0))
      .catch(() => setCount(0));
  }, []);

  if (count === null) return null;
  return (
    <p className="hero-note" style={{ marginTop: 0 }}>
      <span style={{ color: "var(--muted)" }}>
        <strong style={{ color: "var(--ink)" }}>{count.toLocaleString()}</strong> dashboard creation calls
      </span>
    </p>
  );
}
