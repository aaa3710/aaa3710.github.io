import test from 'node:test';
import assert from 'node:assert/strict';
import { readingUnits } from '../lib/readable-text.ts';

test('Names and technical terms never receive an internal break opportunity', () => {
  for (const word of [
    '撮影のものさし',
    '伝わる文字',
    '道の記録',
    '被写界深度',
    'マニュアルフォーカス',
  ]) {
    const text = `「${word}」について、${word}を確認します。`;
    const units = readingUnits(text);
    assert.equal(units.join(''), text);
    assert.equal(units.filter((unit) => unit.includes(word)).length, 2);
  }
});

test('Japanese line breaks preserve the audited words and following kana', () => {
  assert.deepEqual(readingUnits('読みやすい文字'), ['読みやすい', '文字']);
  assert.deepEqual(readingUnits('使い方と困ったとき'), [
    '使い方と',
    '困った',
    'とき',
  ]);
  assert.deepEqual(readingUnits('マニュアルフォーカス'), [
    'マニュアルフォーカス',
  ]);
});
test('Typography preserves text, punctuation, spaces, and English exactly', () => {
  for (const text of [
    '',
    'Photo Yardstick — Support',
    'iPhoneとApple Watch。',
    '「話した言葉」を、大きく見やすく。',
    '住所・連絡先を送信しない。',
  ]) {
    assert.equal(readingUnits(text).join(''), text);
  }
  assert.deepEqual(readingUnits('Privacy and data handling'), [
    'Privacy and data handling',
  ]);
});
