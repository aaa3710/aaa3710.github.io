import { Fragment } from 'react';
import { readingUnits } from '@/lib/readable-text';
export function ReadableText({
  children,
  phrases = false,
}: {
  children: string;
  phrases?: boolean;
}) {
  if (phrases && /[、。]/u.test(children)) {
    return children.match(/[^、。]+[、。]?/gu)?.map((phrase, index) => (
      <Fragment key={index}>
        {index > 0 && <wbr />}
        <span className="reading-unit">
          <ReadableText>{phrase}</ReadableText>
        </span>
      </Fragment>
    ));
  }
  const units = readingUnits(children);
  if (units.length === 1) return children;
  return units.map((unit, index) => (
    <Fragment key={index}>
      {index > 0 && <wbr />}
      <span className="reading-unit">{unit}</span>
    </Fragment>
  ));
}
