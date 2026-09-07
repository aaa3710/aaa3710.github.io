import { ReadableText } from '@/components/readable-text';
import {
  inlineTokens,
  parsePublicDocument,
  type PublicBlock,
} from '@/lib/public-document';
import { sitePath } from '@/lib/site';

function Inline({ text }: { text: string }) {
  return inlineTokens(text).map((token, index) =>
    token.kind === 'link' ? (
      <a
        key={index}
        href={sitePath(token.href)}
        rel={token.href.startsWith('https:') ? 'noreferrer' : undefined}
      >
        <ReadableText>{token.text}</ReadableText>
      </a>
    ) : token.kind === 'code' ? (
      <code key={index}>{token.text}</code>
    ) : (
      <ReadableText key={index}>{token.text}</ReadableText>
    ),
  );
}

function Blocks({ blocks }: { blocks: PublicBlock[] }) {
  return blocks.map((block, index) => {
    if (block.kind === 'list') {
      const List = block.ordered ? 'ol' : 'ul';
      return (
        <List key={index}>
          {block.items.map((item, i) => (
            <li key={i}>
              <Inline text={item} />
            </li>
          ))}
        </List>
      );
    }
    return block.kind === 'subheading' ? (
      <h3 key={index}>
        <Inline text={block.text} />
      </h3>
    ) : (
      <p key={index}>
        <Inline text={block.text} />
      </p>
    );
  });
}

export function PublicDocument({
  body,
  kind,
}: {
  body: string;
  kind: 'app' | 'support' | 'privacy';
}) {
  const document = parsePublicDocument(body);
  const sections = document.sections.filter(
    (section) =>
      kind !== 'app' ||
      !['名前', 'Name', 'サブタイトル', 'Subtitle'].includes(section.title),
  );
  return (
    <div className="public-document">
      <Blocks blocks={document.introduction} />
      {sections.map((section, index) => (
        <details
          key={section.title}
          open={index < (kind === 'privacy' ? 1 : 2)}
        >
          <summary aria-label={section.title}>
            <h2>
              <ReadableText>{section.title}</ReadableText>
            </h2>
          </summary>
          <div className="public-document-body">
            <Blocks blocks={section.blocks} />
          </div>
        </details>
      ))}
    </div>
  );
}
