import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { marked } from 'marked';

const __dirname = dirname(fileURLToPath(import.meta.url));

const getStyles = () => `
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 860px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.6;
      color: #24292e;
    }
    pre {
      background: #f6f8fa;
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
    }
    code {
      background: #f6f8fa;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 85%;
    }
    pre code {
      background: none;
      padding: 0;
    }
    h1, h2, h3 {
      border-bottom: 1px solid #eaecef;
      padding-bottom: 0.3em;
    }
    a { color: #0366d6; }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    th, td {
      border: 1px solid #dfe2e5;
      padding: 6px 13px;
    }
    tr:nth-child(even) { background: #f6f8fa; }
  </style>
`;

const wrapHtml = (title, content) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      ${getStyles()}
    </head>
    <body>
      ${content}
    </body>
  </html>
`;

const ROOT_DIR = join(__dirname, '..', '..');

export const renderMarkdown = (title = 'Inforce API') => {
  const markdown = readFileSync(join(ROOT_DIR, 'README.MD'), 'utf8');
  const html = marked(markdown);
  return wrapHtml(title, html);
};
