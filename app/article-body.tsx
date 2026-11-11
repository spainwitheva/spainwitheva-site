import type { ReactNode } from "react";

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

function inline(text: string, keyPrefix: string): ReactNode[] {
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let index = 0;
  for (const match of text.matchAll(re)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));
    if (match[1] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-b${index}`}>{inline(match[1], `${keyPrefix}-b${index}`)}</strong>);
    } else {
      const label = match[2];
      const href = match[3];
      if (isExternal(href)) {
        nodes.push(
          <a key={`${keyPrefix}-a${index}`} href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>,
        );
      } else {
        nodes.push(
          <a key={`${keyPrefix}-a${index}`} href={href}>
            {label}
          </a>,
        );
      }
    }
    last = start + match[0].length;
    index += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function renderBlock(block: string, index: number) {
  const lines = block.split("\n");
  const heading = /^(#{1,3}) (.+)$/.exec(lines[0] ?? "");
  if (heading && lines.length === 1) {
    const level = heading[1].length;
    const Tag = `h${level}` as "h1" | "h2" | "h3";
    return <Tag key={index}>{inline(heading[2], `h${index}`)}</Tag>;
  }
  if (lines.every((line) => /^[-*] /.test(line))) {
    return (
      <ul key={index}>
        {lines.map((line, item) => (
          <li key={item}>{inline(line.slice(2), `ul${index}-${item}`)}</li>
        ))}
      </ul>
    );
  }
  if (lines.every((line) => /^\d+\. /.test(line))) {
    return (
      <ol key={index}>
        {lines.map((line, item) => (
          <li key={item}>{inline(line.replace(/^\d+\. /, ""), `ol${index}-${item}`)}</li>
        ))}
      </ol>
    );
  }
  return <p key={index}>{inline(lines.join("\n"), `p${index}`)}</p>;
}

export function ArticleBody({ markdown }: { markdown: string }) {
  const blocks = markdown.replace(/\r\n/g, "\n").trim().split(/\n{2,}/);
  return blocks.filter(Boolean).map((block, index) => renderBlock(block.trim(), index));
}
