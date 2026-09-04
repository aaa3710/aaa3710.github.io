// A deliberately small Markdown subset for reviewed, app-owned public copy.
// No HTML, images, executable URLs, or hidden release-control comments.
export type PublicBlock =
  | { kind: 'paragraph' | 'subheading'; text: string }
  | { kind: 'list'; ordered: boolean; items: string[] };
export type PublicDocument = {
  title: string;
  introduction: PublicBlock[];
  sections: { title: string; blocks: PublicBlock[] }[];
};

export function publicBody(source: string): string {
  const body = source.replace(/^\s*<!--[\s\S]*?-->\s*/, '').trim();
  if (/<!--|-->|<\/?[a-z]|\{\{|!\[|^```|^\|/im.test(body)) {
    throw new Error(
      'Unsupported markup or unresolved placeholder in public copy',
    );
  }
  return body;
}

export function parsePublicDocument(source: string): PublicDocument {
  const lines = publicBody(source).split(/\r?\n/);
  const title = lines.shift()?.match(/^# (.+)$/)?.[1];
  if (!title) throw new Error('Public copy needs one leading title');
  const document: PublicDocument = { title, introduction: [], sections: [] };
  let blocks = document.introduction;
  for (const line of lines) {
    if (!line.trim()) continue;
    const section = line.match(/^## (.+)$/);
    const subheading = line.match(/^### (.+)$/);
    const item = line.match(/^(- |\d+\. )(.+)$/);
    if (section) {
      const next = { title: section[1], blocks: [] as PublicBlock[] };
      document.sections.push(next);
      blocks = next.blocks;
    } else if (subheading) {
      blocks.push({ kind: 'subheading', text: subheading[1] });
    } else if (item) {
      const ordered = item[1] !== '- ';
      const last = blocks.at(-1);
      if (last?.kind === 'list' && last.ordered === ordered)
        last.items.push(item[2]);
      else blocks.push({ kind: 'list', ordered, items: [item[2]] });
    } else {
      if (/^#|^\s+[-*]/.test(line))
        throw new Error('Unsupported block in public copy');
      blocks.push({ kind: 'paragraph', text: line });
    }
  }
  return document;
}

export function publicLink(href: string): string {
  const url = new URL(href);
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error('Only public HTTPS links are supported');
  }
  if (url.origin === 'https://aaa3710.github.io') {
    if (
      url.search ||
      url.hash ||
      !/^\/(?:en\/)?(?:apps|support|privacy|feedback|contact)\//.test(
        url.pathname,
      )
    ) {
      throw new Error('Unexpected first-party public route');
    }
    return url.pathname;
  }
  if (
    ![
      'help.openai.com',
      'developers.openai.com',
      'developer.apple.com',
    ].includes(url.hostname)
  ) {
    throw new Error('Unreviewed external public-copy link');
  }
  return href;
}

export function inlineTokens(text: string) {
  return text
    .split(/(\[[^\]]+\]\(https:\/\/[^\s)]+\)|`[^`]+`)/g)
    .filter(Boolean)
    .map((part) => {
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link)
        return {
          kind: 'link' as const,
          text: link[1],
          href: publicLink(link[2]),
        };
      if (part.startsWith('`') && part.endsWith('`'))
        return { kind: 'code' as const, text: part.slice(1, -1) };
      if (/\]\(|\[|`/.test(part)) throw new Error('Unsupported inline markup');
      return { kind: 'text' as const, text: part };
    });
}
