import Link from "next/link";
import { Fragment } from "react";

/** Tiny, dependency-free renderer for the lightweight markdown used in blog posts. */
function inline(text: string, key: string) {
  const parts: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<strong key={`${key}-b${i++}`}>{m[1]}</strong>);
    else if (m[2] && m[3]) {
      const href = m[3];
      parts.push(
        href.startsWith("/") ? (
          <Link key={`${key}-l${i++}`} href={href}>{m[2]}</Link>
        ) : (
          <a key={`${key}-l${i++}`} href={href} target="_blank" rel="noopener noreferrer">{m[2]}</a>
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function slugifyHeading(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function extractHeadings(md: string) {
  return md
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => ({ text: l.slice(3).trim(), id: slugifyHeading(l.slice(3)) }));
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n\s*\n/);
  return (
    <div className="prose-dx">
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        const k = `b${bi}`;
        if (block.startsWith("## ")) {
          const t = block.slice(3).trim();
          return <h2 key={k} id={slugifyHeading(t)} className="scroll-mt-28">{t}</h2>;
        }
        if (block.startsWith("### ")) return <h3 key={k}>{inline(block.slice(4).trim(), k)}</h3>;
        if (block.startsWith("> ")) return <blockquote key={k}>{inline(lines.map((l) => l.replace(/^>\s?/, "")).join(" "), k)}</blockquote>;
        if (lines.every((l) => l.startsWith("- ")))
          return (
            <ul key={k}>
              {lines.map((l, li) => (
                <li key={li}>{inline(l.slice(2), `${k}-${li}`)}</li>
              ))}
            </ul>
          );
        if (lines.every((l) => /^\d+\.\s/.test(l)))
          return (
            <ol key={k}>
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\d+\.\s/, ""), `${k}-${li}`)}</li>
              ))}
            </ol>
          );
        return (
          <p key={k}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {inline(l, `${k}-${li}`)}
                {li < lines.length - 1 && " "}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
