import { Fragment } from 'react';
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
        {token.text}
      </a>
    ) : token.kind === 'code' ? (
      <code key={index}>{token.text}</code>
    ) : (
      <Fragment key={index}>{token.text}</Fragment>
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
  return (
    <div className="public-document">
      <Blocks blocks={document.introduction} />
      {document.sections.map((section, index) => (
        <details
          key={section.title}
          open={index < (kind === 'privacy' ? 1 : 2)}
        >
          <summary>
            <h2>{section.title}</h2>
          </summary>
          <div className="public-document-body">
            <Blocks blocks={section.blocks} />
          </div>
        </details>
      ))}
    </div>
  );
}
