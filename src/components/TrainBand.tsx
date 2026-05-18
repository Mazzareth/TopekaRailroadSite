"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "tmr:train";
const TRAIN_LOGO_WIDTH = 3088;
const TRAIN_LOGO_HEIGHT = 320;
const RUNNING_GEAR_DURATION = "0.9s";

const DRIVER_WHEELS = [
  { cx: 2429, cy: 268, throw: 28, r: 50 },
  { cx: 2525, cy: 268, throw: 28, r: 47 },
  { cx: 2614, cy: 268, throw: 28, r: 47 },
  { cx: 2739, cy: 268, throw: 28, r: 50 },
];

const CRANK_OFFSETS = [
  { dx: 0, dy: 28 },
  { dx: -20, dy: 20 },
  { dx: -28, dy: 0 },
  { dx: -20, dy: -20 },
  { dx: 0, dy: -28 },
  { dx: 20, dy: -20 },
  { dx: 28, dy: 0 },
  { dx: 20, dy: 20 },
  { dx: 0, dy: 28 },
];

function pinPoint(wheel: (typeof DRIVER_WHEELS)[number], offset: (typeof CRANK_OFFSETS)[number]) {
  return {
    x: wheel.cx + offset.dx,
    y: wheel.cy + offset.dy,
  };
}

const couplingRodValues = CRANK_OFFSETS.map((offset) => {
  const [rear, middle, front, lead] = DRIVER_WHEELS.map((wheel) => pinPoint(wheel, offset));
  return `M${rear.x} ${rear.y} L${middle.x} ${middle.y} L${front.x} ${front.y} L${lead.x} ${lead.y}`;
}).join("; ");

const mainRodValues = CRANK_OFFSETS.map((offset) => {
  const lead = pinPoint(DRIVER_WHEELS[3], offset);
  const crossheadX = 2810 + offset.dx * 0.7;
  const crossheadY = 267 + offset.dy * 0.18;
  return `M${lead.x} ${lead.y} L${crossheadX.toFixed(1)} ${crossheadY.toFixed(1)}`;
}).join("; ");

function AnimatedBearing({ wheel }: { wheel: (typeof DRIVER_WHEELS)[number] }) {
  const cxValues = CRANK_OFFSETS.map((offset) => pinPoint(wheel, offset).x).join("; ");
  const cyValues = CRANK_OFFSETS.map((offset) => pinPoint(wheel, offset).y).join("; ");

  return (
    <circle className="rod-bearing" cx={wheel.cx} cy={wheel.cy + wheel.throw} r={wheel.r > 48 ? 11 : 10}>
      <animate attributeName="cx" dur={RUNNING_GEAR_DURATION} repeatCount="indefinite" values={cxValues} />
      <animate attributeName="cy" dur={RUNNING_GEAR_DURATION} repeatCount="indefinite" values={cyValues} />
    </circle>
  );
}

function AnimatedCrank({ wheel, index }: { wheel: (typeof DRIVER_WHEELS)[number]; index: number }) {
  const cxValues = CRANK_OFFSETS.map((offset) => pinPoint(wheel, offset).x).join("; ");
  const cyValues = CRANK_OFFSETS.map((offset) => pinPoint(wheel, offset).y).join("; ");

  return (
    <g className={`wheel-crank crank-${index + 1}`}>
      <line
        className="crank-arm"
        x1={wheel.cx}
        y1={wheel.cy}
        x2={wheel.cx}
        y2={wheel.cy + wheel.throw}
      >
        <animate attributeName="x2" dur={RUNNING_GEAR_DURATION} repeatCount="indefinite" values={cxValues} />
        <animate attributeName="y2" dur={RUNNING_GEAR_DURATION} repeatCount="indefinite" values={cyValues} />
      </line>
      <circle className="crank-pin" cx={wheel.cx} cy={wheel.cy + wheel.throw} r={wheel.r > 48 ? 10 : 9}>
        <animate attributeName="cx" dur={RUNNING_GEAR_DURATION} repeatCount="indefinite" values={cxValues} />
        <animate attributeName="cy" dur={RUNNING_GEAR_DURATION} repeatCount="indefinite" values={cyValues} />
      </circle>
    </g>
  );
}

function RunningGear() {
  return (
    <svg
      className="train-motion"
      viewBox={`0 0 ${TRAIN_LOGO_WIDTH} ${TRAIN_LOGO_HEIGHT}`}
      aria-hidden="true"
      focusable="false"
    >
      <g className="running-gear">
        <g className="drive-rods">
          <path className="rod-shadow" d="M2429 296 L2525 296 L2614 296 L2739 296" pathLength="1">
            <animate attributeName="d" dur={RUNNING_GEAR_DURATION} repeatCount="indefinite" values={couplingRodValues} />
          </path>
          <path className="rod-body" d="M2429 296 L2525 296 L2614 296 L2739 296" pathLength="1">
            <animate attributeName="d" dur={RUNNING_GEAR_DURATION} repeatCount="indefinite" values={couplingRodValues} />
          </path>
          <path className="main-rod-shadow" d="M2739 296 L2810 272">
            <animate attributeName="d" dur={RUNNING_GEAR_DURATION} repeatCount="indefinite" values={mainRodValues} />
          </path>
          <path className="main-rod" d="M2739 296 L2810 272">
            <animate attributeName="d" dur={RUNNING_GEAR_DURATION} repeatCount="indefinite" values={mainRodValues} />
          </path>
          {DRIVER_WHEELS.map((wheel) => (
            <AnimatedBearing key={`rod-${wheel.cx}`} wheel={wheel} />
          ))}
        </g>
        {DRIVER_WHEELS.map((wheel, index) => (
          <AnimatedCrank key={wheel.cx} wheel={wheel} index={index} />
        ))}
      </g>
    </svg>
  );
}

export function TrainBand() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    try {
      setOn(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // ignore — privacy mode, etc.
    }
  }, []);

  function toggle() {
    setOn((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  }

  return (
    <div className="trainband">
      <button
        type="button"
        className="train-toggle"
        aria-pressed={on}
        aria-label={on ? "Stop the scrolling train" : "Run the scrolling train"}
        onClick={toggle}
      >
        <span className="dot" aria-hidden />
        {on ? "Stop Train" : "Run Train"}
      </button>
      {on && (
        <div className="train" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="train-art" src="/tmrr-train-logo.png" alt="" width={TRAIN_LOGO_WIDTH} height={TRAIN_LOGO_HEIGHT} />
          <RunningGear />
        </div>
      )}
    </div>
  );
}
