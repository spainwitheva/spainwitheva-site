import type { ReactNode } from "react";
import { umamiForHref } from "./umami";

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

function inline(text: string, keyPrefix: string, tour?: string): ReactNode[] {
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let index = 0;
  for (const match of text.matchAll(re)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(text.slice(last, start));
    if (match[1] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-b${index}`}>{inline(match[1], `${keyPrefix}-b${index}`, tour)}</strong>);
    } else {
      const label = match[2];
      const href = match[3];
      if (isExternal(href)) {
        nodes.push(
          <a
            key={`${keyPrefix}-a${index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            {...umamiForHref(href, { place: "article", tour })}
          >
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

function renderBlock(block: string, index: number, tour?: string) {
  const figure = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+(\d+)x(\d+))?\)$/.exec(block);
  if (figure) {
    const width = figure[3] ? Number(figure[3]) : undefined;
    const height = figure[4] ? Number(figure[4]) : undefined;
    return (
      <figure className="article-figure" key={index}>
        <img
          src={figure[2]}
          alt={figure[1]}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
        />
      </figure>
    );
  }
  const lines = block.split("\n");
  const heading = /^(#{1,3}) (.+)$/.exec(lines[0] ?? "");
  if (heading && lines.length === 1) {
    const level = heading[1].length;
    const Tag = `h${level}` as "h1" | "h2" | "h3";
    return <Tag key={index}>{inline(heading[2], `h${index}`, tour)}</Tag>;
  }
  if (lines.every((line) => /^[-*] /.test(line))) {
    return (
      <ul key={index}>
        {lines.map((line, item) => (
          <li key={item}>{inline(line.slice(2), `ul${index}-${item}`, tour)}</li>
        ))}
      </ul>
    );
  }
  if (lines.every((line) => /^\d+\. /.test(line))) {
    return (
      <ol key={index}>
        {lines.map((line, item) => (
          <li key={item}>{inline(line.replace(/^\d+\. /, ""), `ol${index}-${item}`, tour)}</li>
        ))}
      </ol>
    );
  }
  return <p key={index}>{inline(lines.join("\n"), `p${index}`, tour)}</p>;
}

export function ArticleBody({ markdown, tour }: { markdown: string; tour?: string }) {
  const blocks = markdown.replace(/\r\n/g, "\n").trim().split(/\n{2,}/);
  return blocks.filter(Boolean).map((block, index) => renderBlock(block.trim(), index, tour));
}
