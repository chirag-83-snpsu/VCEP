import React from 'react';

/**
 * Safe, zero-dependency Markdown renderer for Vivi AI.
 * Sanitizes untrusted content, parses headings, lists, bold/italics, safe links,
 * GFM tables with column alignment, code blocks, and financial tabular calculations.
 */

interface ViviMarkdownProps {
  content: string;
  className?: string;
}

type ColumnAlignment = 'left' | 'center' | 'right' | 'default';

export const ViviMarkdown: React.FC<ViviMarkdownProps> = ({ content, className }) => {
  const renderedElements = React.useMemo(() => {
    if (!content) return null;

    // Split content into blocks by double newlines or table/code boundaries
    const rawLines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < rawLines.length) {
      const line = rawLines[i];
      const trimmed = line.trim();

      // 1. Skip completely empty lines
      if (!trimmed) {
        i++;
        continue;
      }

      // 2. Fenced Code Block: ```lang ... ```
      if (trimmed.startsWith('```')) {
        const lang = trimmed.slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < rawLines.length && !rawLines[i].trim().startsWith('```')) {
          codeLines.push(rawLines[i]);
          i++;
        }
        if (i < rawLines.length) i++; // skip closing ```
        elements.push(
          <div key={`code-${elements.length}`} className="vivi-md-code-block">
            {lang && <div className="vivi-md-code-lang">{lang}</div>}
            <pre>
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>
        );
        continue;
      }

      // 3. Markdown Table: starts with | and contains |
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        const tableLines: string[] = [];
        while (
          i < rawLines.length &&
          rawLines[i].trim().startsWith('|') &&
          rawLines[i].trim().endsWith('|')
        ) {
          tableLines.push(rawLines[i].trim());
          i++;
        }

        if (tableLines.length >= 2) {
          const headerCols = tableLines[0]
            .split('|')
            .slice(1, -1)
            .map((c) => c.trim());

          // Check if second line is separator | --- | ---: | :---: |
          let hasSeparator = false;
          const alignments: ColumnAlignment[] = headerCols.map(() => 'default');

          if (tableLines[1].includes('---')) {
            hasSeparator = true;
            const sepCols = tableLines[1].split('|').slice(1, -1).map((c) => c.trim());
            sepCols.forEach((sep, idx) => {
              if (sep.startsWith(':') && sep.endsWith(':')) alignments[idx] = 'center';
              else if (sep.endsWith(':')) alignments[idx] = 'right';
              else if (sep.startsWith(':')) alignments[idx] = 'left';
            });
          }

          const rowLines = hasSeparator ? tableLines.slice(2) : tableLines.slice(1);

          elements.push(
            <div key={`table-${elements.length}`} className="vivi-md-table-wrap">
              <table className="vivi-md-table">
                <thead>
                  <tr>
                    {headerCols.map((col, idx) => (
                      <th
                        key={idx}
                        style={{
                          textAlign: alignments[idx] === 'default' ? 'left' : alignments[idx],
                        }}
                      >
                        {renderInline(col)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rowLines.map((r, rIdx) => {
                    const rowCols = r
                      .split('|')
                      .slice(1, -1)
                      .map((c) => c.trim());
                    return (
                      <tr key={rIdx}>
                        {rowCols.map((c, cIdx) => {
                          const isNumeric = /^[\s₹$€£\d,.\-+%()]+$/.test(c);
                          const align =
                            alignments[cIdx] !== 'default'
                              ? alignments[cIdx]
                              : isNumeric
                              ? 'right'
                              : 'left';
                          return (
                            <td
                              key={cIdx}
                              className={isNumeric ? 'vivi-md-cell-num' : ''}
                              style={{ textAlign: align }}
                            >
                              {renderInline(c)}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // 4. Headings: ### H3, ## H2, # H1
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h4 key={`h4-${elements.length}`} className="vivi-md-h4">
            {renderInline(trimmed.slice(4))}
          </h4>
        );
        i++;
        continue;
      }
      if (trimmed.startsWith('## ')) {
        elements.push(
          <h3 key={`h3-${elements.length}`} className="vivi-md-h3">
            {renderInline(trimmed.slice(3))}
          </h3>
        );
        i++;
        continue;
      }
      if (trimmed.startsWith('# ')) {
        elements.push(
          <h2 key={`h2-${elements.length}`} className="vivi-md-h2">
            {renderInline(trimmed.slice(2))}
          </h2>
        );
        i++;
        continue;
      }

      // 5. Blockquote / Alert: > Note
      if (trimmed.startsWith('> ')) {
        const quoteLines: string[] = [trimmed.slice(2)];
        i++;
        while (i < rawLines.length && rawLines[i].trim().startsWith('> ')) {
          quoteLines.push(rawLines[i].trim().slice(2));
          i++;
        }
        elements.push(
          <blockquote key={`quote-${elements.length}`} className="vivi-md-blockquote">
            {renderInline(quoteLines.join(' '))}
          </blockquote>
        );
        continue;
      }

      // 6. Numbered Lists: 1. Item
      if (/^\d+\.\s/.test(trimmed)) {
        const listItems: string[] = [];
        while (i < rawLines.length && /^\d+\.\s/.test(rawLines[i].trim())) {
          listItems.push(rawLines[i].trim().replace(/^\d+\.\s/, ''));
          i++;
        }
        elements.push(
          <ol key={`ol-${elements.length}`} className="vivi-md-ol">
            {listItems.map((item, idx) => (
              <li key={idx}>{renderInline(item)}</li>
            ))}
          </ol>
        );
        continue;
      }

      // 7. Bullet Lists: - Item or * Item
      if (/^[-*]\s/.test(trimmed)) {
        const listItems: string[] = [];
        while (i < rawLines.length && /^[-*]\s/.test(rawLines[i].trim())) {
          listItems.push(rawLines[i].trim().replace(/^[-*]\s/, ''));
          i++;
        }
        elements.push(
          <ul key={`ul-${elements.length}`} className="vivi-md-ul">
            {listItems.map((item, idx) => (
              <li key={idx}>{renderInline(item)}</li>
            ))}
          </ul>
        );
        continue;
      }

      // 8. Normal Paragraph
      const paraLines: string[] = [line];
      i++;
      while (
        i < rawLines.length &&
        rawLines[i].trim() &&
        !rawLines[i].trim().startsWith('#') &&
        !rawLines[i].trim().startsWith('```') &&
        !rawLines[i].trim().startsWith('|') &&
        !rawLines[i].trim().startsWith('>') &&
        !/^[-*]\s/.test(rawLines[i].trim()) &&
        !/^\d+\.\s/.test(rawLines[i].trim())
      ) {
        paraLines.push(rawLines[i]);
        i++;
      }

      elements.push(
        <p key={`p-${elements.length}`} className="vivi-md-p">
          {renderInline(paraLines.join(' '))}
        </p>
      );
    }

    return elements;
  }, [content]);

  return <div className={`vivi-markdown-container ${className || ''}`}>{renderedElements}</div>;
};

/**
 * Parses inline formatting: **bold**, *italic*, `code`, and safe markdown links [text](url).
 * Disallows javascript:, data:, and other unapproved link schemes.
 */
function renderInline(text: string): React.ReactNode {
  if (!text) return null;

  // Split tokens by bold (**...**), italic (*...*), inline code (`...`), and safe markdown links [text](url)
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[(?:[^\]]+)\]\((?:[^)]+)\))/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Add text preceding the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
      parts.push(
        <strong key={match.index} className="vivi-md-bold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*') && token.length >= 2) {
      parts.push(
        <em key={match.index} className="vivi-md-italic">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`') && token.length >= 2) {
      parts.push(
        <code key={match.index} className="vivi-md-inline-code">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      const splitIdx = token.indexOf('](');
      const linkText = token.slice(1, splitIdx);
      const linkUrl = token.slice(splitIdx + 2, -1).trim();

      // Enforce safe link scheme: only https://, http://, or relative /
      const isSafe = /^https?:\/\//i.test(linkUrl) || linkUrl.startsWith('/');

      if (isSafe) {
        parts.push(
          <a
            key={match.index}
            href={linkUrl}
            target={linkUrl.startsWith('/') ? undefined : '_blank'}
            rel={linkUrl.startsWith('/') ? undefined : 'noopener noreferrer'}
            className="vivi-md-link"
          >
            {linkText}
          </a>
        );
      } else {
        // Disallowed scheme: render as harmless text
        parts.push(linkText);
      }
    } else {
      parts.push(token);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

