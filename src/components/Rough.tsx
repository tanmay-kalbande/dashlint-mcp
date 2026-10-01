"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";

/**
 * Thin React bridges to roughjs, which draws directly into the DOM rather
 * than returning JSX. Each component renders an empty <g> during SSR
 * (roughjs never runs on the server) and appends the generated hand-drawn
 * shape to it after mount. Pass a fixed `seed` in options so the sketch is
 * stable across re-renders instead of reshuffling its wobble every time.
 */

function useRoughNode(build: (rc: ReturnType<typeof rough.svg>) => SVGGElement, deps: unknown[]) {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    const container = ref.current;
    const svg = container?.ownerSVGElement;
    if (!container || !svg) return;
    const rc = rough.svg(svg);
    const node = build(rc);
    container.appendChild(node);
    return () => {
      while (container.firstChild) container.removeChild(container.firstChild);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

export function RoughRect({
  x,
  y,
  width,
  height,
  options,
  className,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  options: Options;
  className?: string;
}) {
  const ref = useRoughNode(
    (rc) => rc.rectangle(x, y, width, height, options),
    [x, y, width, height, options]
  );
  return <g ref={ref} className={className} />;
}

export function RoughArc({
  cx,
  cy,
  width,
  height,
  start,
  stop,
  options,
  className,
}: {
  cx: number;
  cy: number;
  width: number;
  height: number;
  start: number;
  stop: number;
  options: Options;
  className?: string;
}) {
  const ref = useRoughNode(
    (rc) => rc.arc(cx, cy, width, height, start, stop, false, options),
    [cx, cy, width, height, start, stop, options]
  );
  return <g ref={ref} className={className} />;
}

export function RoughPath({
  d,
  options,
  className,
}: {
  d: string;
  options: Options;
  className?: string;
}) {
  const ref = useRoughNode((rc) => rc.path(d, options), [d, options]);
  return <g ref={ref} className={className} />;
}
