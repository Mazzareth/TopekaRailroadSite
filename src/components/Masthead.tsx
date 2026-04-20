import Link from "next/link";
import { TrainBand } from "./TrainBand";

type MastheadProps = {
  volume?: string;
  established?: string;
  tagline?: string;
};

export function Masthead({ volume, established, tagline }: MastheadProps) {
  return (
    <header className="masthead">
      <div className="wrap">
        <div className="topbar">
          <span>{volume ? `Vol. ${volume}` : "Topeka Model Railroaders"}</span>
          <span>{established ? `Est. ${established} · Topeka, Kansas` : "Topeka, Kansas"}</span>
          <span>All Gauges Welcome</span>
        </div>

        <div className="plate">
          <div className="sub1">— The —</div>
          <h1>Topeka <em>Model</em> Railroaders</h1>
          <div className="sub2">{tagline || "a friendly gathering of hobbyists, tinkerers & track-layers"}</div>
        </div>

        <div className="rulebar">
          <span className="dot" />
          <span className="line" />
          <span className="dot" />
          <span className="line" />
          <span className="dot" />
        </div>

        <nav>
          <Link href="/#about">About</Link>
          <Link href="/#events">Events</Link>
          <Link href="/#blog">Dispatches</Link>
          <Link href="/#gallery">Layout Gallery</Link>
          <Link href="/#visit">Visit</Link>
          <Link href="/signup">Join</Link>
          <Link href="/login">Sign In</Link>
        </nav>
      </div>

      <TrainBand />
    </header>
  );
}
