import { Search } from "lucide-react";
import { topLinks } from "../content/navigation";
import { MobileNav } from "./mobile-nav";

type TopNavProps = {
  activeSlug: string;
};

export function TopNav({ activeSlug }: TopNavProps) {
  return (
    <header className="topNav">
      <div className="brand">
        <MobileNav activeSlug={activeSlug} />
        <div className="brandIdentity">
          <img alt="Beam logo" className="logoMark" src="/beam.png" />
          <span>Beam</span>
        </div>
      </div>
      <nav aria-label="Top navigation" className="topLinks">
        {topLinks.map((link) => (
          <a href={link.href} key={link.href}>
            {link.title}
          </a>
        ))}
      </nav>
      <label className="searchBox">
        <Search size={16} />
        <input aria-label="Search documentation" placeholder="Search..." />
      </label>
      <a
        aria-label="Open Beam on GitHub"
        className="githubLink"
        href="https://github.com/isonlycoolie/beam"
        rel="noreferrer"
        target="_blank"
      >
        <svg
          aria-hidden="true"
          fill="currentColor"
          height="17"
          viewBox="0 0 24 24"
          width="17"
        >
          <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-1.05-.01-1.91-2.51.47-3.16-.63-3.36-1.21-.11-.3-.6-1.21-1.03-1.46-.35-.19-.85-.66-.01-.67.79-.01 1.35.74 1.54 1.05.9 1.55 2.34 1.11 2.91.85.09-.67.35-1.11.64-1.37-2.22-.26-4.55-1.14-4.55-5.05 0-1.11.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.71 0 0 .84-.28 2.75 1.05A9.25 9.25 0 0 1 12 6.97c.85 0 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.79-4.57 5.05.36.32.68.93.68 1.89 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.09 10.09 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z" />
        </svg>
      </a>
    </header>
  );
}
