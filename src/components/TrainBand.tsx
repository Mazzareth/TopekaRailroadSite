"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "tmr:train";

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
        /* eslint-disable-next-line @next/next/no-img-element */
        <img className="train" src="/train.svg" alt="" width={480} height={140} />
      )}
    </div>
  );
}
