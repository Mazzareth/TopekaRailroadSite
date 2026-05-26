import Link from "next/link";
import { TrainBand } from "./TrainBand";

type MastheadProps = {
  clubName?: string;
  volume?: string;
  established?: string;
  tagline?: string;
  logoUrl?: string;
  logoAlt?: string;
  trainDefaultOn?: boolean;
};

function titleParts(clubName: string) {
  if (clubName.trim().toLowerCase() === "topeka model railroaders") {
    return <>Topeka <em>Model</em> Railroaders</>;
  }
  return clubName;
}

export function Masthead({ clubName = "Topeka Model Railroaders", volume, established, tagline, logoUrl, logoAlt, trainDefaultOn }: MastheadProps) {
  return (
    <header className="masthead">
      <div className="wrap">
        <div className="topbar">
          <span>{volume ? `Vol. ${volume}` : clubName}</span>
          <span>{established ? `Est. ${established} · Topeka, Kansas` : "Topeka, Kansas"}</span>
          <span>All Gauges Welcome</span>
        </div>

        <div className="plate">
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="masthead-logo" src={logoUrl} alt={logoAlt || `${clubName} logo`} />
          )}
          <div className="sub1">— The —</div>
          <h1>{titleParts(clubName)}</h1>
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
          <Link href="/about">About</Link>
          <Link href="/#events">Events</Link>
          <Link href="/blog">Dispatches</Link>
          <Link href="/photo-gallery">Photo Gallery</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/signup">Join</Link>
          <Link href="/login">Sign In</Link>
        </nav>
      </div>

      <TrainBand defaultEnabled={trainDefaultOn} />
    </header>
  );
}
