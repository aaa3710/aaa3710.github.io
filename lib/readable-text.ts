import { loadDefaultJapaneseParser } from 'budoux';

// Parse plain text only at render/build time; React retains HTML escaping.
// No visitor text is sent to an external service.
const parser = loadDefaultJapaneseParser();
const protectedTerms = [
  '撮影のものさし',
  '伝わる文字',
  '道の記録',
  '被写界深度',
  'マニュアルフォーカス',
];
export function readingUnits(text: string): string[] {
  if (!/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(text))
    return [text];
  const ranges = protectedTerms.flatMap((term) => {
    const matches: [number, number][] = [];
    let start = text.indexOf(term);
    while (start !== -1) {
      matches.push([start, start + term.length]);
      start = text.indexOf(term, start + term.length);
    }
    return matches;
  });
  const units: string[] = [];
  let offset = 0;
  for (const unit of parser.parse(text)) {
    if (
      units.length &&
      ranges.some(([start, end]) => offset > start && offset < end)
    ) {
      units[units.length - 1] += unit;
    } else units.push(unit);
    offset += unit.length;
  }
  return units;
}
