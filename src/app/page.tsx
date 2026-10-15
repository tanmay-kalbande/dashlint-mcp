"use client";

import { useEffect, useRef, useState } from "react";

const URL_ = "https://dashlint.tanmaysk.in/mcp";
const JSON_ = `{ "mcpServers": { "dashlint": { "url": "${URL_}" } } }`;
const SAMPLE_PROMPT =
  "Inspect the attached data and build an interactive dashboard following the DashLint MCP workflow. Call the MCP tools step-by-step — do not skip any playbooks or the completion checklist. Keep all raw data rows on my machine.";

const CL: Record<string, [string, string]> = {
  Claude: [URL_, "Settings → Connectors → add a custom connector and paste the URL."],
  Cursor: [JSON_, "Settings → MCP → paste this config."],
  ChatGPT: [URL_, "Settings → Connectors → add a custom MCP with this URL."],
  Other: [URL_, "Add a remote MCP server in your client and paste this URL."],
};

const CLIENT_KEYS = ["Claude", "Cursor", "ChatGPT", "Other"] as const;
type ClientKey = (typeof CLIENT_KEYS)[number];

const TL = [
  ["build_dashboard_blueprint", "blueprint"],
  ["get_dashboard_creation_workflow", "workflow"],
  ["get_shell_preservation_spec", "shell spec"],
  ["get_data_insight_playbook", "insights"],
  ["get_dashboard_composition_playbook", "composition"],
  ["get_dashboard_interaction_playbook", "interaction"],
  ["get_dashboard_completion_checklist", "checklist"],
] as const;

const P = ["#e5e7eb", "#e5e7eb", "#e5e7eb", "#e5e7eb", "#e5e7eb", "#e5e7eb", "#e5e7eb"];
const RY0 = 108;
const RP = 46;
const rowY = (i: number) => RY0 + i * RP;
const ICON = [
  "M4 4h12v12H4zM4 10h12M10 4v12",
  "M4 16v-6h6V5h6",
  "M3 4h14v12H3zM3 8h14M7 8v8",
  "M4 15l4-5 3 3 5-7",
  "M3 3h6v6H3zM11 3h6v3h-6zM11 8h6v9h-6zM3 11h6v6H3z",
  "M5 3l9 5-4 1.5L8.5 14z",
  "M4 5l2 2 3-3M4 12l2 2 3-3M12 6h5M12 13h5",
];

const T = TL.map((t, i) => ({
  id: "t" + i,
  t: t[1],
  n: t[0],
}));

function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch(() => fallbackCopy(text));
  }
  return Promise.resolve(fallbackCopy(text));
}

function fallbackCopy(text: string): boolean {
  try {
    const a = document.createElement("textarea");
    a.value = text;
    a.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(a);
    a.select();
    const ok = document.execCommand("copy");
    a.remove();
    return ok;
  } catch {
    return false;
  }
}

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<ClientKey>("Claude");
  const [configSwitched, setConfigSwitched] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [callsCount, setCallsCount] = useState<number | null>(null);
  const [statusText, setStatusText] = useState("0 dashboard creation calls");
  const [caption, setCaption] = useState("1 · Share data + question");
  const [captionFade, setCaptionFade] = useState(false);

  const segRef = useRef<HTMLDivElement>(null);
  const indRef = useRef<HTMLElement>(null);
  const mvRef = useRef<HTMLDivElement>(null);
  const svRef = useRef<SVGSVGElement>(null);

  // Theme initialization
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dl-theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = saved === "light" || saved === "dark" ? saved : prefersDark ? "dark" : "light";
      setTheme(initial);
      document.documentElement.dataset.theme = initial;
    } catch {}

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("dl-theme")) {
        const next = e.matches ? "dark" : "light";
        setTheme(next);
        document.documentElement.dataset.theme = next;
      }
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      document.documentElement.classList.add("tt");
      setTimeout(() => document.documentElement.classList.remove("tt"), 450);
    }
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("dl-theme", next);
    } catch {}
    setTheme(next);
  };

  // Stats fetch
  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d && d.total != null) {
          setCallsCount(d.total);
          setStatusText(d.total.toLocaleString() + " dashboard creation calls");
        }
      })
      .catch(() => {});
  }, []);

  // Update tab indicator position
  const updateIndicator = () => {
    if (!segRef.current || !indRef.current) return;
    const activeBtn = segRef.current.querySelector("button.on") as HTMLButtonElement | null;
    if (activeBtn) {
      indRef.current.style.width = activeBtn.offsetWidth + "px";
      indRef.current.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
    }
  };

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateIndicator);
    }
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]);

  const selectTab = (tab: ClientKey) => {
    setActiveTab(tab);
    setConfigSwitched(true);
    setTimeout(() => setConfigSwitched(false), 300);
  };

  // Escape key for connect drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConnectOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Animation loop
  useEffect(() => {
    let mounted = true;
    const NS = "http://www.w3.org/2000/svg";
    const layer = document.getElementById("pk");
    const svg = svRef.current;
    const mvEl = mvRef.current;
    if (!svg || !layer || !mvEl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isLite = window.matchMedia("(max-width: 1100px)").matches;

    const sleep = (ms: number) =>
      new Promise((resolve) => {
        const timer = setTimeout(resolve, ms);
        if (!mounted) clearTimeout(timer);
      });

    const N = (id: string) => svg.querySelector(`[data-i="${id}"]`) as HTMLElement | SVGElement | null;
    const lit = (id: string, on: boolean) => {
      const el = N(id);
      if (el) el.classList.toggle("lit", on);
    };

    let capTimeout: NodeJS.Timeout | null = null;
    const setCapText = (text: string) => {
      setCaptionFade(true);
      if (capTimeout) clearTimeout(capTimeout);
      capTimeout = setTimeout(() => {
        if (!mounted) return;
        setCaption(text);
        setCaptionFade(false);
      }, 170);
    };

    let touched = 0;
    const touchHandler = () => {
      touched = Date.now();
    };
    ["touchstart", "wheel", "pointerdown"].forEach((v) =>
      mvEl.addEventListener(v, touchHandler, { passive: true })
    );

    const pan = (f: number) => {
      const m = mvEl.scrollWidth - mvEl.clientWidth;
      if (m < 4 || Date.now() - touched < 7000) return;
      mvEl.scrollTo({ left: m * f, behavior: "smooth" });
    };

    const rip = (_x: number, _y: number, _col: string) => {
      // Gray circular ripple ring removed per user request
    };

    const fly = (id: string, col: string, ms: number, rev?: boolean): Promise<void> => {
      return new Promise((res) => {
        if (!layer) return res();
        const el = document.getElementById(id) as SVGGeometryElement | null;
        if (!el) return res();
        const len = el.getTotalLength();
        const tl = Math.min(70, len * 0.45);
        const g = document.createElementNS(NS, "path");
        const c = document.createElementNS(NS, "circle");
        const end = el.getPointAtLength(rev ? 0 : len);
        let hit = 0;

        g.setAttribute("d", el.getAttribute("d") || "");
        g.setAttribute("fill", "none");
        g.setAttribute("stroke", col);
        g.setAttribute("stroke-width", "3");
        g.setAttribute("stroke-linecap", "round");
        if (!isLite) g.setAttribute("filter", "url(#gl)");
        g.style.strokeDasharray = `${tl} ${len * 3}`;

        c.setAttribute("r", "4.5");
        c.setAttribute("fill", "#fff");
        c.setAttribute("filter", "url(#gl)");

        layer.appendChild(g);
        layer.appendChild(c);

        const tot = len + tl;
        const t0 = performance.now();

        function f(t: number) {
          if (!mounted) {
            g.remove();
            c.remove();
            return res();
          }
          const p = Math.min(1, (t - t0) / ms);
          const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
          const h = e * tot;
          const hd = Math.min(h, len);
          const q = el!.getPointAtLength(rev ? len - hd : hd);

          g.style.strokeDashoffset = String(rev ? h - len : tl - h);
          c.setAttribute("cx", String(q.x));
          c.setAttribute("cy", String(q.y));

          if (h >= len) {
            c.setAttribute("opacity", "0");
            if (!hit) {
              hit = 1;
              rip(end.x, end.y, col);
            }
          }

          if (p < 1) {
            requestAnimationFrame(f);
          } else {
            g.remove();
            c.remove();
            res();
          }
        }

        requestAnimationFrame(f);
      });
    };

    async function run() {
      if (reduced) {
        ["data", "ai", "hub"].forEach((i) => lit(i, true));
        TL.forEach((_, i) => {
          lit("t" + i, true);
          N("t" + i)?.classList.add("done");
        });
        N("out")?.classList.add("built");
        setCapText("Your data → AI assistant → DashLint tools → dashboard");
        return;
      }

      while (mounted) {
        while (document.hidden && mounted) await sleep(400);
        if (!mounted) break;

        setCapText("1 · Share data + question");
        pan(0);
        lit("data", true);
        const lk = document.getElementById("lk");
        lk?.classList.add("p");
        await sleep(600);
        if (!mounted) break;

        await fly("pd", "#e5e7eb", 1300);
        if (!mounted) break;
        lk?.classList.remove("p");
        lit("data", false);
        lit("ai", true);

        setCapText("2 · AI calls DashLint");
        pan(0.5);
        await fly("pa", "#e5e7eb", 1100);
        if (!mounted) break;
        pan(1);
        lit("hub", true);

        setCapText("2 · AI calls 7 core DashLint workflow tools");
        await Promise.all(
          TL.map(async (_, i) => {
            await sleep(i * 260);
            if (!mounted) return;
            lit("t" + i, true);
            await sleep(720);
            if (!mounted) return;
            N("t" + i)?.classList.add("done");
            rip(654, rowY(i) + 20, "#e5e7eb");
          })
        );
        await sleep(450);
        if (!mounted) break;

        setCapText("2 · DashLint returns plans and playbooks");
        await Promise.all(
          [0, 1, 2].map(async (k) => {
            await sleep(k * 160);
            if (!mounted) return;
            await fly("pa", "#e5e7eb", 1000, true);
          })
        );
        if (!mounted) break;
        lit("hub", false);
        TL.forEach((_, i) => {
          lit("t" + i, false);
          N("t" + i)?.classList.remove("done");
        });

        setCapText("3 · Reusable interactive dashboard");
        pan(0);
        await fly("po", "#e5e7eb", 1200);
        if (!mounted) break;
        lit("ai", false);
        lit("out", true);
        const out = N("out");
        out?.classList.add("built");
        await sleep(3400);
        if (!mounted) break;
        out?.classList.remove("built");
        lit("out", false);
        await sleep(800);
      }
    }

    run();

    return () => {
      mounted = false;
      if (capTimeout) clearTimeout(capTimeout);
      ["touchstart", "wheel", "pointerdown"].forEach((v) =>
        mvEl.removeEventListener(v, touchHandler)
      );
    };
  }, []);

  const handleCopyUrl = async () => {
    const ok = await copyToClipboard(URL_);
    setCopiedUrl(ok);
    setTimeout(() => setCopiedUrl(false), 1600);
  };

  const handleCopyConfig = async () => {
    const ok = await copyToClipboard(CL[activeTab][0]);
    setCopiedConfig(ok);
    setTimeout(() => setCopiedConfig(false), 1600);
  };

  const handleCopyPrompt = async () => {
    const ok = await copyToClipboard(SAMPLE_PROMPT);
    setCopiedPrompt(ok);
    setTimeout(() => setCopiedPrompt(false), 1600);
  };

  return (
    <>
      <aside className="rail">
        <div className="logo">
          <i>D/</i>
          <div>
            <b>DASHLINT</b>
            <small>12 tools · remote MCP</small>
          </div>
        </div>

        <div>
          <p className="lb">AT A GLANCE</p>
          <div className="sc">
            <div className="sc-span">
              <b>{(callsCount ?? 0).toLocaleString()}</b>
              <span>DASHBOARD CALLS</span>
            </div>
            <div>
              <b>0</b>
              <span>ROWS SENT</span>
            </div>
            <div>
              <b>1</b>
              <span>URL TO ADD</span>
            </div>
          </div>
        </div>

        <div>
          <p className="lb">WORKS WITH</p>
          <ul className="wl">
            <li>Claude</li>
            <li>Cursor</li>
            <li>ChatGPT</li>
            <li>Windsurf</li>
            <li>Any MCP client</li>
          </ul>
        </div>

        <div className="bt">
          <div className="st">
            <span>
              <span className="dot"></span>
              <b>reusable dashboard output · no API key</b>
            </span>
          </div>
          <button className="btn cp" onClick={handleCopyUrl}>
            {copiedUrl ? "Copied ✓" : "Copy MCP URL"}
          </button>
          <div className="npm-option">
            <a
              className="npm-option-link"
              href="https://www.npmjs.com/package/dashlint-kit"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="npm-option-mark"
                src="https://raw.githubusercontent.com/npm/logos/master/npm%20logo/npm-logo-red.svg"
                alt="npm"
                width="34"
                height="18"
              />
              <span className="npm-option-copy">
                <span className="npm-option-title">Standalone kit</span>
                <code className="npm-option-command">npx dashlint-kit init</code>
              </span>
              <svg className="npm-option-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 12 12 4M5 4h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </aside>

      <div className="vp">
        <header className="hs mh">
          <div className="m-brand">
            <i>D/</i>
            <div>
              <b>DASHLINT</b>
              <small>7 tools · remote MCP</small>
            </div>
          </div>
          <span className="cr">
            dashlint / <b>mcp server</b>
          </span>
          <div className="hb">
            <button
              className="btn g sm tg"
              id="tg"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                </svg>
              )}
            </button>
            <button
              className="btn sm cbtn"
              id="cbtn"
              onClick={() => {
                setConnectOpen(true);
                setTimeout(() => {
                  const onBtn = segRef.current?.querySelector("button.on") as HTMLButtonElement | null;
                  onBtn?.focus();
                }, 60);
              }}
            >
              How to use
            </button>
            <a
              className="btn g sm d-only"
              href="https://linkedin.com/in/tanmay-kalbande"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>
            <button
              className="menu-btn"
              id="menu-btn"
              aria-label="Open menu"
              onClick={() => {
                setConnectOpen(true);
                setTimeout(() => {
                  const onBtn = segRef.current?.querySelector("button.on") as HTMLButtonElement | null;
                  onBtn?.focus();
                }, 60);
              }}
            >
              <span className="menu-icon" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </header>

        <div className="main">
          <div className="lft">
            <section className="pn hero">
              <div className="hero-topline">
                <span className="pill n" style={{ width: "fit-content" }}>
                  MCP SERVER · 100% REUSABLE DASHBOARDS · OPEN SOURCE
                </span>
                <span className="hero-calls">
                  <span className="dot" style={{ width: 6, height: 6 }}></span>
                  <b>{(callsCount ?? 0).toLocaleString()}</b> dashboard creation calls
                </span>
              </div>
              <h1>
                Data in.
                <br />
                <em>Dashboard out.</em>
              </h1>
              <p>
                <b>DashLint</b> gives your AI assistant the workflow, app shell, analysis playbook and review checklist to build a complete, <b>reusable interactive dashboard</b> from your data. Keep the code, run it anywhere, update it anytime—your rows stay on your machine.
              </p>
              <div className="steps">
                {/* Desktop 2-row pipeline */}
                <div className="steps-d">
                  <div className="steps-row">
                    <span className="step-pill">
                      <b>1</b> <span className="dot-sep">·</span> Share data + question
                    </span>
                    <span className="step-arrow" aria-hidden="true">→</span>
                    <span className="step-pill">
                      <b>2</b> <span className="dot-sep">·</span> AI calls DashLint
                    </span>
                  </div>
                  <div className="steps-row-out">
                    <span className="step-arrow-return" aria-hidden="true">
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 2v6a3 3 0 0 0 3 3h7" />
                        <path d="M11 8l3 3-3 3" />
                      </svg>
                    </span>
                    <span className="step-pill step-pill-target">
                      <b>3</b> <span className="dot-sep">·</span> Reusable dashboard
                    </span>
                  </div>
                </div>

                {/* Mobile clean vertical stepper */}
                <div className="steps-m">
                  <span className="step-pill">
                    <b>1</b> <span className="dot-sep">·</span> Share data + question
                  </span>
                  <div className="step-m-arrow" aria-hidden="true">
                    <svg width="11" height="13" viewBox="0 0 12 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 1v10M2 7l4 4 4-4" />
                    </svg>
                  </div>
                  <span className="step-pill">
                    <b>2</b> <span className="dot-sep">·</span> AI calls DashLint
                  </span>
                  <div className="step-m-arrow" aria-hidden="true">
                    <svg width="11" height="13" viewBox="0 0 12 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 1v10M2 7l4 4 4-4" />
                    </svg>
                  </div>
                  <span className="step-pill step-pill-target">
                    <b>3</b> <span className="dot-sep">·</span> Reusable dashboard
                  </span>
                </div>
              </div>
            </section>

            <section className={`pn cn ${connectOpen ? "open" : ""}`} id="connect">
              <div className="cnh">
                <h2>Connect &amp; how to use</h2>
                <button
                  className="cx"
                  id="cx"
                  aria-label="Close"
                  onClick={() => setConnectOpen(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                <div className="seg" id="cs" ref={segRef}>
                  <i className="ind" ref={indRef}></i>
                  {CLIENT_KEYS.map((k) => (
                    <button
                      key={k}
                      className={activeTab === k ? "on" : ""}
                      onClick={() => selectTab(k)}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cfg">
                <code id="cfg" className={configSwitched ? "sw" : ""}>
                  <u>{CL[activeTab][0]}</u>
                </code>
                <button className="btn sm" id="cpc" onClick={handleCopyConfig}>
                  {copiedConfig ? "Copied ✓" : "Copy"}
                </button>
              </div>

              <p className={`hint ${configSwitched ? "sw" : ""}`} id="ht">
                {CL[activeTab][1]}
              </p>

              <div className="cn-how">
                <span className="lb">HOW TO USE</span>
                <p className="cn-how-desc">
                  Attach your data in your AI chat &amp; paste this prompt:
                </p>
                <div className="prompt-box">
                  <code>{SAMPLE_PROMPT}</code>
                  <button className="btn sm" type="button" onClick={handleCopyPrompt}>
                    {copiedPrompt ? "Copied ✓" : "Copy prompt"}
                  </button>
                </div>
              </div>

              <div className="cn-glance">
                <span className="lb">AT A GLANCE</span>
                <div className="sc">
                  <div className="sc-span">
                    <b>{(callsCount ?? 0).toLocaleString()}</b>
                    <span>DASHBOARD CALLS</span>
                  </div>
                  <div>
                    <b>0</b>
                    <span>ROWS SENT</span>
                  </div>
                  <div>
                    <b>1</b>
                    <span>URL TO ADD</span>
                  </div>
                </div>
              </div>

              <div className="cn-actions">
                <button className="btn cp" onClick={handleCopyUrl} style={{ width: "100%" }}>
                  {copiedUrl ? "Copied ✓" : "Copy MCP URL"}
                </button>
                <div className="npm-option">
                  <a
                    className="npm-option-link"
                    href="https://www.npmjs.com/package/dashlint-kit"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="npm-option-mark"
                      src="https://raw.githubusercontent.com/npm/logos/master/npm%20logo/npm-logo-red.svg"
                      alt="npm"
                      width="34"
                      height="18"
                    />
                    <span className="npm-option-copy">
                      <span className="npm-option-title">Standalone kit</span>
                      <code className="npm-option-command">npx dashlint-kit init</code>
                    </span>
                    <svg className="npm-option-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M4 12 12 4M5 4h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
                <a
                  className="btn g sm"
                  href="https://linkedin.com/in/tanmay-kalbande"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ width: "100%" }}
                >
                  LinkedIn ↗
                </a>
                <button
                  className="btn g sm m-close-btn"
                  onClick={() => setConnectOpen(false)}
                  style={{ width: "100%" }}
                >
                  Close drawer
                </button>
              </div>
            </section>
          </div>

          <section className="pn rgt">
            <div className="map" id="map">
              <div className="mbar">
                <span>
                  <i className="live"></i>
                  <span id="cap" className={captionFade ? "o" : ""}>
                    {caption}
                  </span>
                </span>
              </div>

              <div className="mv" id="mv" ref={mvRef}>
                <div className="mvs" id="mvs">
                  <svg
                    id="sv"
                    ref={svRef}
                    viewBox="0 0 536 440"
                    preserveAspectRatio="xMidYMid meet"
                    aria-label="How DashLint connects your data, assistant and dashboard"
                  >
                    <defs>
                      <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#1b2229" />
                        <stop offset="1" stopColor="#141414" />
                      </linearGradient>
                      <clipPath id="cp">
                        <rect x="16" y="308" width="156" height="128" rx="10" />
                      </clipPath>
                      <marker
                        id="mg"
                        viewBox="0 0 8 8"
                        refX="7"
                        refY="4"
                        markerWidth="7"
                        markerHeight="7"
                        orient="auto-start-reverse"
                      >
                        <path d="M1 1l6 3-6 3z" fill="#9aa3af" />
                      </marker>
                      <marker
                        id="ms"
                        viewBox="0 0 8 8"
                        refX="7"
                        refY="4"
                        markerWidth="7"
                        markerHeight="7"
                        orient="auto-start-reverse"
                      >
                        <path d="M1 1l6 3-6 3z" fill="#9aa3af" />
                      </marker>
                    </defs>

                    <text
                      x="16"
                      y="28"
                      fill="#9aa3af"
                      fontSize="10"
                      style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase" }}
                    >
                      On your machine
                    </text>
                    <text
                      x="216"
                      y="28"
                      fill="#9aa3af"
                      fontSize="10"
                      style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase" }}
                    >
                      Remote MCP server
                    </text>

                    {/* wires */}
                    <path
                      id="pd"
                      d="M94 128V182"
                      stroke="#4b5563"
                      strokeOpacity=".5"
                      strokeWidth="1.5"
                      fill="none"
                      className="fl"
                      markerEnd="url(#mg)"
                    />
                    <path
                      id="pa"
                      d="M172 218H216"
                      stroke="#6b7280"
                      strokeOpacity=".6"
                      strokeWidth="1.6"
                      fill="none"
                      className="fl"
                      markerStart="url(#ms)"
                      markerEnd="url(#ms)"
                    />
                    <path
                      id="po"
                      d="M94 254V308"
                      stroke="#4b5563"
                      strokeOpacity=".5"
                      strokeWidth="1.5"
                      fill="none"
                      className="fl"
                      markerEnd="url(#mg)"
                    />

                    <text
                      x="104"
                      y="158"
                      fill="#9aa3af"
                      fontSize="10"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      schema only
                    </text>
                    <text
                      x="104"
                      y="284"
                      fill="#9aa3af"
                      fontSize="10"
                      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                      builds
                    </text>

                    {/* Your data */}
                    <g
                      className="nd"
                      data-i="data"
                      style={{ animationDelay: "0ms" }}
                    >
                      <rect
                        className="box"
                        x="16"
                        y="44"
                        width="156"
                        height="84"
                        rx="10"
                        fill="url(#hg)"
                        stroke="#20201f"
                        strokeWidth="1"
                      />
                      {[0, 1, 2].map((r) =>
                        [0, 1, 2, 3].map((c) => (
                          <rect
                            key={`${r}-${c}`}
                            x={28 + c * 20}
                            y={56 + r * 11}
                            width="16"
                            height="6"
                            rx="2"
                            fill={r === 0 ? "#282a29" : "#222221"}
                          />
                        ))
                      )}
                      <rect className="scan" x="26" y="54" width="86" height="3" rx="1.5" fill="#9aa3af" opacity=".5" />
                      <g transform="translate(138,52)">
                        <g className="lk" id="lk">
                          <rect x="0" y="8" width="20" height="14" rx="3" fill="#151515" stroke="#e5e7eb" strokeWidth={1.7} />
                          <path d="M4 8V5a6 6 0 0 1 12 0v3" fill="none" stroke="#e5e7eb" strokeWidth={1.7} />
                        </g>
                      </g>
                      <text x="28" y="106" style={{ font: "600 13px Inter, sans-serif" }}>
                        Your data
                      </text>
                      <text x="28" y="119" className="sub">
                        rows stay here
                      </text>
                    </g>

                    {/* AI assistant */}
                    <g
                      className="nd"
                      data-i="ai"
                      style={{ animationDelay: "70ms" }}
                    >
                      <rect
                        className="box"
                        x="16"
                        y="182"
                        width="156"
                        height="72"
                        rx="10"
                        fill="url(#hg)"
                        stroke="#20201f"
                        strokeWidth="1"
                      />
                      <rect
                        x="26"
                        y="192"
                        width="26"
                        height="26"
                        rx="7"
                        fill="#151515"
                        stroke="#20201f"
                      />
                      <path
                        d="M40 285h18a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-8l-4 3.5V297h-6a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3z"
                        transform="translate(-8 -84.5)"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <text x="58" y="204" style={{ font: "600 13px Inter, sans-serif" }}>
                        AI assistant
                      </text>
                      <text x="58" y="217" className="sub">
                        your MCP client
                      </text>
                      <text x="24" y="240" className="sub" style={{ fontSize: "9.5px" }}>
                        Claude · Cursor · ChatGPT
                      </text>
                    </g>

                    {/* dashboard preview */}
                    <g
                      className="nd out"
                      data-i="out"
                      style={{ animationDelay: "140ms" }}
                    >
                      <rect
                        className="box"
                        x="16"
                        y="308"
                        width="156"
                        height="128"
                        rx="10"
                        fill="url(#hg)"
                        stroke="#20201f"
                        strokeWidth="1"
                      />
                      <g clipPath="url(#cp)">
                        {/* blank state: dashed canvas waiting for AI */}
                        <g className="out-blank" transform="translate(-6, -122)">
                          <rect x="22" y="436" width="26" height="128" rx="4" fill="#151515" stroke="#20201f" />
                          <rect x="54" y="437" width="124" height="9" rx="3" fill="#151515" stroke="#20201f" />
                          {[0, 1, 2].map((i) => (
                            <rect key={`sk-${i}`} x={54 + i * 42} y="454" width="38" height="42" rx="4" fill="#151515" stroke="#20201f" />
                          ))}
                          <rect x="54" y="504" width="124" height="54" rx="4" fill="#151515" stroke="#20201f" />
                        </g>

                        {/* populated dashboard (animates in when AI response arrives) */}
                        <g className="out-live" transform="translate(-6, -122)">
                          <rect x="22" y="436" width="26" height="128" rx="4" fill="#111" stroke="#20201f" />
                          {[0, 1, 2, 3].map((i) => (
                            <rect
                              key={i}
                              className="k"
                              x={27}
                              y={446 + i * 11}
                              width="16"
                              height="4"
                              rx="2"
                              fill={i ? "#3a3a38" : "#e5e7eb"}
                            />
                          ))}
                          <rect className="k" x="54" y="437" width="124" height="9" rx="3" fill="#1a1a19" stroke="#20201f" />
                          <text className="k" x="58" y="444" fill="#9aa3af" fontSize="6" style={{ fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.06em", fontWeight: 600 }}>DASHBOARD</text>
                          {[0, 1, 2].map((i) => (
                            <rect
                              key={i}
                              className="k"
                              style={{ transitionDelay: `${0.1 + i * 0.08}s` }}
                              x={54 + i * 42}
                              y={452}
                              width="38"
                              height="30"
                              rx="6"
                              fill="#1a1a19"
                              stroke={i === 1 ? "#3a404b" : "#20201f"}
                              strokeOpacity=".8"
                            />
                          ))}
                          {[30, 44, 36, 52, 40, 26, 48, 34].map((v, i) => (
                            <rect
                              key={i}
                              className="b"
                              style={{ transitionDelay: `${0.25 + i * 0.06}s` }}
                              x={56 + i * 15}
                              y={558 - v}
                              width="10"
                              height={v}
                              rx="2"
                              fill={i === 5 ? "#f0f0f0" : "#4b5563"}
                            />
                          ))}
                          <rect className="dw" x="112" y="433" width="68" height="134" rx="6" fill="#1a1a19" stroke="#20201f" />
                          <rect className="dw" x="120" y="443" width="38" height="5" rx="2" fill="#9aa3af" />
                          {[0, 1, 2, 3, 4].map((i) => (
                            <rect
                              key={i}
                              className="dw"
                              x={120}
                              y={457 + i * 12}
                              width={54 - i * 6}
                              height="5"
                              rx="2"
                              fill="#20201f"
                            />
                          ))}
                        </g>
                      </g>
                    </g>

                    {/* remote MCP server panel */}
                    <g
                      className="nd"
                      data-i="hub"
                      style={{ animationDelay: "210ms" }}
                    >
                      <rect
                        className="box"
                        x="216"
                        y="44"
                        width="304"
                        height="392"
                        rx="10"
                        fill="url(#hg)"
                        stroke="#20201f"
                        strokeWidth="1"
                      />
                      <rect
                        x="228"
                        y="56"
                        width="28"
                        height="28"
                        rx="6"
                        fill="#151515"
                        stroke="#20201f"
                      />
                      <text
                        x="242"
                        y="75"
                        textAnchor="middle"
                        style={{ font: "700 12.5px 'IBM Plex Mono', monospace", fill: "#f0f0f0", letterSpacing: "-1px" }}
                      >
                        D/
                      </text>
                      <text x="264" y="68" style={{ font: "600 13.5px Inter, sans-serif" }}>
                        DashLint MCP
                      </text>
                      <text x="264" y="81" className="sub" style={{ fontSize: "9.5px" }}>
                        remote · no API key
                      </text>
                      <text x="264" y="91" className="sub" style={{ fontSize: "7.5px" }}>
                        7 core tools shown · 12 total
                      </text>
                      <g className="eq">
                        {[8, 14, 10, 16].map((v, i) => (
                          <rect
                            key={i}
                            x={474 + i * 7}
                            y={83 - v}
                            width="4.5"
                            height={v}
                            rx="1.5"
                            fill="#9aa3af"
                          />
                        ))}
                      </g>
                      <path d="M228 96H508" stroke="#20201f" />
                    </g>

                    {/* tool rows */}
                    {T.map((n, i) => {
                      const y = rowY(i);
                      return (
                        <g
                          key={n.id}
                          className="nd row"
                          data-i={n.id}
                          style={{
                            "--c": "#e5e7eb",
                            animationDelay: `${(i + 4) * 70}ms`,
                          } as React.CSSProperties}
                        >
                          <rect className="box" x="226" y={y} width="284" height="40" rx="6" fill="#1a1a19" stroke="#20201f" />
                          <rect className="sw" x="226" y={y} width="284" height="40" rx="6" fill="#ffffff" fillOpacity=".04" />
                          <rect
                            x="234"
                            y={y + 7}
                            width="26"
                            height="26"
                            rx="6"
                            fill="#151515"
                            stroke="#20201f"
                          />
                          <path
                            className="icon-glyph"
                            d={ICON[i]}
                            transform={`translate(239 ${y + 12}) scale(.72)`}
                            fill="none"
                            stroke="#9aa3af"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <text x="268" y={y + 18} style={{ font: "600 12px 'IBM Plex Mono', monospace" }}>
                            {n.t}
                          </text>
                          <text x="268" y={y + 31} className="sub" style={{ fontSize: "9.5px" }}>
                            {n.n}
                          </text>
                          <rect className="idle" x="490" y={y + 14} width="11" height="11" rx="3" fill="none" stroke="#2c2c2a" />
                          <path
                            className="ck"
                            d={`M488 ${y + 20}l4.5 4.5L503 ${y + 14}`}
                            fill="none"
                            stroke="#f0f0f0"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                      );
                    })}

                    <g id="pk"></g>
                  </svg>

                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="mf">
          <span>Free · open source · MIT</span>
          <span>Built with DashLint</span>
        </footer>
      </div>

      <div
        className={`scrim ${connectOpen ? "on" : ""}`}
        id="scrim"
        onClick={() => setConnectOpen(false)}
      ></div>
    </>
  );
}
