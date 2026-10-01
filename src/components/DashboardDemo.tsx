"use client";

import { useState } from "react";
import { RoughRect, RoughPath } from "./Rough";

const RULE_MARKS = Array.from({ length: 46 }, (_, index) => ({
  flagged: [4, 15, 29, 40].includes(index),
}));
const PRODUCT_REVENUE: [string, number, string][] = [
  ["Product A", 100, "$38K"],
  ["Product B", 76, "$29K"],
  ["Product C", 58, "$22K"],
  ["Product D", 45, "$17K"],
  ["Product E", 34, "$13K"],
  ["Product F", 24, "$9K"],
  ["Product G", 21, "$8K"],
  ["Other", 16, "$6K"],
];

// "Before" chart data — same underlying shares as PRODUCT_REVENUE, laid out
// as an eight-slice donut (start/stop in radians) to illustrate the
// harder-to-compare view DashLint flags. Colors deliberately alternate
// hue families so neighboring slices never blend into one blob.
const DONUT_SLICES: [number, number, string][] = [
  [0, 1.68, "#b84f35"],
  [1.68, 2.957, "#3e7182"],
  [2.957, 3.931, "#397568"],
  [3.931, 4.687, "#8d7fa8"],
  [4.687, 5.259, "#c99a4a"],
  [5.259, 5.662, "#a85c52"],
  [5.662, 6.015, "#7a8b5f"],
  [6.015, 6.283, "#8a7d6b"],
];

// Builds a hand-drawable donut-wedge path: an outer arc, a straight edge in
// to the inner radius, an inner arc back, and a close — with `pad` radians
// trimmed off each end so every slice gets a visible gap from its neighbors.
function donutWedgePath(cx: number, cy: number, rOuter: number, rInner: number, start: number, stop: number, pad: number) {
  const a0 = start + pad;
  const a1 = stop - pad;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const point = (r: number, a: number): [number, number] => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [ox0, oy0] = point(rOuter, a0);
  const [ox1, oy1] = point(rOuter, a1);
  const [ix1, iy1] = point(rInner, a1);
  const [ix0, iy0] = point(rInner, a0);
  return `M ${ox0} ${oy0} A ${rOuter} ${rOuter} 0 ${large} 1 ${ox1} ${oy1} L ${ix1} ${iy1} A ${rInner} ${rInner} 0 ${large} 0 ${ix0} ${iy0} Z`;
}

const BEFORE_BARS: [number, number, number, number, string][] = [
  [514, 232, 57, 105, "#7093a0"],
  [584, 207, 57, 130, "#7093a0"],
  [654, 254, 57, 83, "#7093a0"],
  [724, 192, 116, 145, "#cb785b"],
];

// Pictogram for the 27% "largest share" stat: filled left-to-right, top-to-bottom.
const PICTOGRAM_TOTAL = 25;
const PICTOGRAM_FILLED = 7;

function ReviewScene({ isAfter }: { isAfter: boolean }) {
  return (
    <div
      className={`review-scene${isAfter ? ' is-after' : ''}`}
      data-state={isAfter ? 'after' : 'before'}
      role="group"
      aria-label={isAfter ? 'Refined dashboard: all 46 checks pass' : 'First draft: four findings among 46 design checks'}
    >
      <div className="scene-topline">
        <span><i /> DASHLINT DESIGN REVIEW <b>·</b> SAMPLE SPEC</span>
        <strong>{isAfter ? '46 / 46 CHECKS PASS' : '42 PASS · 04 NEED ATTENTION'}</strong>
      </div>
      <svg className="scene-art" viewBox="0 0 1000 500" role="img" aria-labelledby="scene-title scene-desc">
        <title id="scene-title">The same dashboard before and after DashLint</title>
        <desc id="scene-desc">Use the stage selector to see a dashboard change from an eight-slice donut, crowded bars, and KPIs below the charts to a labeled horizontal bar chart with KPIs above and clear spacing.</desc>
        <defs>
          <pattern id="scene-grid-dark" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M36 0H0V36" fill="none" stroke="#c6c0b5" strokeOpacity=".09" strokeWidth=".8" />
          </pattern>
          <linearGradient id="afterBarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8fb9c4" />
            <stop offset="100%" stopColor="#3e7182" />
          </linearGradient>
        </defs>
        <rect width="1000" height="500" fill="url(#scene-grid-dark)" />

        <text x="164" y="70" className="scene-kicker">DASHBOARD / SALES OVERVIEW</text>
        <text x="835" y="70" textAnchor="end" className="scene-kicker">DESIGN SYSTEM / 01</text>
        <rect x="160" y="88" width="680" height="330" rx="7" className="scene-board" />
        <path d="M160 124 H840" className="scene-board-line" />
        <circle cx="181" cy="106" r="3" className="board-dot" />
        <circle cx="193" cy="106" r="3" className="board-dot" />
        <circle cx="205" cy="106" r="3" className="board-dot" />
        <text x="228" y="110" className="scene-board-title">REVENUE SNAPSHOT</text>
        <text x="818" y="110" textAnchor="end" className="scene-kicker">LAST 30 DAYS</text>

        <g className="mock-state mock-before">
          <g transform="translate(286 252)">
            {DONUT_SLICES.map(([start, stop, color], i) => (
              <RoughPath
                key={i}
                d={donutWedgePath(0, 0, 65, 45, start, stop, 0.035)}
                options={{
                  fill: color,
                  fillStyle: "hachure",
                  hachureGap: 3.4,
                  hachureAngle: -41 + i * 9,
                  roughness: 2.2,
                  bowing: 2.2,
                  stroke: color,
                  strokeWidth: 1.4,
                  seed: 100 + i,
                }}
              />
            ))}
          </g>
          <text x="218" y="333" className="scene-chart-caption">SALES BY CATEGORY</text>
          <text x="215" y="157" className="scene-callout">8-SLICE DONUT</text>
          <path d="M270 162 L278 183" className="scene-callout-line" />
          <text x="499" y="157" className="scene-chart-caption">WEEKLY REVENUE</text>
          <line x1="500" y1="180" x2="829" y2="180" className="scene-axis" />
          {BEFORE_BARS.map(([x, y, w, h, color], i) => (
            <RoughRect
              key={i}
              x={x}
              y={y}
              width={w}
              height={h}
              options={{
                fill: color,
                fillStyle: "hachure",
                hachureGap: 6,
                roughness: 2.5,
                bowing: 3,
                stroke: color,
                strokeWidth: 1.6,
                seed: 300 + i,
              }}
            />
          ))}
          <path d="M770 346 H837" className="scene-callout-line" />
          <text x="777" y="363" className="scene-callout">0PX CLEARANCE</text>
          <line x1="188" y1="356" x2="813" y2="356" className="scene-chart-separator" />
          <text x="190" y="379" className="scene-callout">KPIs BELOW THE CHARTS</text>
          <rect x="190" y="387" width="162" height="1" className="scene-underfold" />
          <text x="528" y="379" className="scene-kpi-label">REVENUE</text>
          <text x="528" y="401" className="scene-kpi-number">$142K</text>
          <text x="682" y="379" className="scene-kpi-label">SESSIONS</text>
          <text x="682" y="401" className="scene-kpi-number">48.2K</text>
          <circle cx="829" cy="337" r="5" className="scene-issue-mark" />
        </g>

        <g className="mock-state mock-after">
          <g>
            <rect x="187" y="143" width="199" height="60" rx="4" className="after-kpi-card" />
            <rect x="399" y="143" width="199" height="60" rx="4" className="after-kpi-card" />
            <rect x="611" y="143" width="212" height="60" rx="4" className="after-kpi-card" />
            <text x="202" y="161" className="scene-kpi-label">TOTAL REVENUE</text>
            <text x="202" y="188" className="scene-kpi-number scene-number-fixed">$142K</text>
            <text x="414" y="161" className="scene-kpi-label">SESSIONS</text>
            <text x="414" y="188" className="scene-kpi-number scene-number-fixed">48.2K</text>
            <text x="626" y="161" className="scene-kpi-label">CONVERSION</text>
            <text x="626" y="188" className="scene-kpi-number scene-number-fixed">3.8%</text>
          </g>
          <text x="192" y="232" className="scene-chart-caption">REVENUE BY CATEGORY</text>
          <text x="630" y="232" textAnchor="end" className="scene-micro">8 CATEGORIES · $142K</text>
          <line x1="192" y1="243" x2="815" y2="243" className="scene-axis" />
          <g className="after-bar-row">
            <text x="198" y="260" className="scene-category">Product A</text><rect x="294" y="251" width="245" height="8" rx="4" className="after-bar-wash" /><text x="548" y="260" className="scene-value">$38K</text>
            <text x="198" y="277" className="scene-category">Product B</text><rect x="294" y="268" width="187" height="8" rx="4" className="after-bar-wash" /><text x="490" y="277" className="scene-value">$29K</text>
            <text x="198" y="294" className="scene-category">Product C</text><rect x="294" y="285" width="142" height="8" rx="4" className="after-bar-wash" /><text x="445" y="294" className="scene-value">$22K</text>
            <text x="198" y="311" className="scene-category">Product D</text><rect x="294" y="302" width="110" height="8" rx="4" className="after-bar-wash" /><text x="413" y="311" className="scene-value">$17K</text>
            <text x="198" y="328" className="scene-category">Product E</text><rect x="294" y="319" width="84" height="8" rx="4" className="after-bar-wash" /><text x="387" y="328" className="scene-value">$13K</text>
            <text x="198" y="345" className="scene-category">Product F</text><rect x="294" y="336" width="58" height="8" rx="4" className="after-bar-wash" /><text x="361" y="345" className="scene-value">$9K</text>
            <text x="198" y="362" className="scene-category">Product G</text><rect x="294" y="353" width="52" height="8" rx="4" className="after-bar-wash" /><text x="355" y="362" className="scene-value">$8K</text>
            <text x="198" y="379" className="scene-category">Other</text><rect x="294" y="370" width="39" height="8" rx="4" className="after-bar-wash" /><text x="342" y="379" className="scene-value">$6K</text>
          </g>
          <line x1="650" y1="246" x2="650" y2="384" className="scene-insight-divider" />
          <rect x="670" y="254" width="148" height="127" rx="4" className="scene-insight-card" />
          <text x="684" y="275" className="scene-micro">LARGEST SHARE</text>
          <g transform="translate(684 284)">
            {Array.from({ length: PICTOGRAM_TOTAL }, (_, i) => {
              const size = 9;
              const gap = 2;
              const col = i % 5;
              const row = Math.floor(i / 5);
              return (
                <rect
                  key={i}
                  x={col * (size + gap)}
                  y={row * (size + gap)}
                  width={size}
                  height={size}
                  rx="1.5"
                  className={i < PICTOGRAM_FILLED ? "pictogram-cell filled" : "pictogram-cell"}
                />
              );
            })}
          </g>
          <text x="750" y="300" className="scene-insight-number-sm">27%</text>
          <text x="750" y="318" className="scene-category">Product A</text>
          <line x1="684" y1="345" x2="804" y2="345" className="scene-insight-divider" />
          <text x="684" y="365" className="scene-micro">$38K OF $142K TOTAL</text>
        </g>
      </svg>

      <div className="scene-mobile">
        <div className="mobile-dashboard">
          <div className="mobile-dashboard-top"><span>SALES OVERVIEW</span><span>{isAfter ? 'TO SPEC' : 'FIRST DRAFT'}</span></div>
          {!isAfter ? (
            <div className="mobile-before-content">
              <div className="mobile-chart-pair"><div className="mobile-donut" /><div className="mobile-column-bars"><i /><i /><i /><i /></div></div>
              <div className="mobile-chart-warning">8-slice donut · edge-to-edge bars</div>
              <div className="mobile-kpis"><span><small>REVENUE</small>$142K</span><span><small>SESSIONS</small>48.2K</span></div>
              <div className="mobile-warning-label">4 design findings</div>
            </div>
          ) : (
            <div className="mobile-after-content">
              <div className="mobile-kpis"><span><small>REVENUE</small>$142K</span><span><small>SESSIONS</small>48.2K</span><span><small>CONVERSION</small>3.8%</span></div>
              <div className="mobile-horizontal-chart">
                {PRODUCT_REVENUE.map(([label, width, value]) => <span key={label}><b>{label}</b><i style={{ width: `${width}%` }} /><small>{value}</small></span>)}
              </div>
              <div className="mobile-insight"><span>TOP CATEGORY</span><strong>27%</strong><small>Product A · $38K of $142K</small></div>
              <div className="mobile-pass-label">✓ 46 of 46 checks passed</div>
            </div>
          )}
        </div>
        <div className="mobile-rule-sequence">
          <div className="mobile-rule-sequence-label"><span>46</span> DESIGN CHECKS <b>{isAfter ? 'ALL PASS' : '04 FLAGGED'}</b></div>
          <div className="mobile-rule-marks">{RULE_MARKS.map((mark, index) => <i key={index} className={!isAfter && mark.flagged ? 'flagged' : ''} />)}</div>
        </div>
      </div>

      <div className="scene-footer">
        <span className="scene-footer-note"><i /> {isAfter ? 'Same data. A clearer hierarchy, category comparison, and 12px of breathing room.' : 'Four issues flagged across chart choice, hierarchy, spacing, and number alignment.'}</span>
        <span className="scene-footer-count">{isAfter ? '46 / 46' : '04 / 46'} <small>{isAfter ? 'PASS' : 'NEEDS ATTENTION'}</small></span>
      </div>
    </div>
  );
}
export default function Demo() {
  const [isAfter, setIsAfter] = useState(false);

  return (
    <section className="demo-section" id="demo">
      <div className="wrap">
        <div className="review-heading">
          <div className="review-heading-copy">
            <div className="review-eyebrow"><span>01</span> DESIGN REVIEW <i /> 46 PRACTICAL CHECKS</div>
            <h2>One dashboard.<br /><span>Better considered.</span></h2>
            <p>Watch the same data move from first draft to a clearer, more considered dashboard.</p>
          </div>
          <div className="review-controls" role="tablist" aria-label="Dashboard design stage">
            <button role="tab" aria-selected={!isAfter} className={!isAfter ? 'selected' : ''} onClick={() => setIsAfter(false)}>
              <span>01</span> First draft
            </button>
            <button role="tab" aria-selected={isAfter} className={isAfter ? 'selected' : ''} onClick={() => setIsAfter(true)}>
              <span>02</span> After DashLint
            </button>
          </div>
        </div>

        <ReviewScene isAfter={isAfter} />

        <div className={`review-ledger${isAfter ? ' is-after' : ''}`} aria-live="polite">
          <div className="ledger-heading"><span>{isAfter ? 'REFINED TO THE RULES' : 'A FEW DETAILS THAT CHANGE THE READ'}</span><span>{isAfter ? 'ALL RESOLVED' : '4 FINDINGS'}</span></div>
          <div className="ledger-grid">
            <div className="ledger-item"><span className={`ledger-id${isAfter ? ' resolved' : ''}`}>R-CHART-01</span><p>{isAfter ? 'Use length to compare categories.' : 'Eight donut slices make comparison harder.'}</p><i>{isAfter ? '✓' : '↗'}</i></div>
            <div className="ledger-item"><span className={`ledger-id${isAfter ? ' resolved' : ''}`}>R-LAYOUT-01</span><p>{isAfter ? 'Bring the KPIs above the charts.' : 'Key figures are below the charts.'}</p><i>{isAfter ? '✓' : '↗'}</i></div>
            <div className="ledger-item"><span className={`ledger-id${isAfter ? ' resolved' : ''}`}>R-SPACE-03</span><p>{isAfter ? 'Give each chart 12px of clearance.' : 'The bars touch the card edge.'}</p><i>{isAfter ? '✓' : '↗'}</i></div>
            <div className="ledger-item"><span className={`ledger-id${isAfter ? ' resolved' : ''}`}>R-TYPE-01</span><p>{isAfter ? 'Keep figures aligned with tabular nums.' : 'KPI digits shift as values change.'}</p><i>{isAfter ? '✓' : '↗'}</i></div>
          </div>
        </div>
      </div>
    </section>
  );
}
