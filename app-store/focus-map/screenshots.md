# スクリーンショット構成

日本語4枚・英語4枚は、Focus Mapの素材実装基準コミット`7ec79a1f906195bea31940fbbfdd321f24ca40b8`にあるDebug提出fixtureから2026-08-31に再撮影済みです。iPhone 6.9インチ表示向け1320×2868pxのPNGとして、RGB／sRGB、アルファなし、8枚すべて異なるSHA-256であることを当時検査しました。旧名当時の証拠であり、改名後の最終binaryと照合済みの提出素材とは扱いません。現在の採否は個別アプリ側の正本を確認します。

App Storeの公開名は `ピントと光 — 撮影計算` / `Focus & Light — Photo Tools` とします。以下の `focus-map` ファイル名と「Focus Map側」という表記は、検査済み素材と内部履歴を指すため維持します。

## 日本語・英語の共通順序

1. `01-focus-map.png` — 撮影前に、ピントの範囲を確認
   - 最初の一枚。専門用語より先に、ユーザーが得る答えを示す。
   - 2m、F8、FF換算20µmの合成機材fixture。許容範囲と連続曲線を示す。
2. `02-apex.png` — 絞り・シャッター速度・ISOの関係
   - 現行の固定4行と中央復帰型入力を示す。
3. `03-actual-size-sensors.png` — センサーの大きさを図で比較
   - 現行の実寸表示ページを示す。物理カード／定規との一致は実機ゲートのまま。
4. `04-bellows.png` — 大判・接写の露出補正
   - 蛇腹の説明、3入力、補正結果、下部タブまで同時に読める画面を示す。

## 2026-08-31の検査結果

- portrait／light／9:41。01〜03はLarge、04はMedium文字サイズ。
- 日本語と英語で同じ画面構成と順序を保ち、各言語の文言、値、単位を照合済み。
- 実際のSimulator画面だけを使い、存在しない機能、生成画像、合成UIを加えていない。
- 8枚すべてについて、寸法、PNG、RGB／sRGB、アルファ、異なるhashを自動検査済み。
- 制作時とは別の視点で全8枚を原寸確認し、画面、言語、値、単位、下部タブとの非干渉、順序、自然な日英表現に合格。

## SHA-256

| 言語 | 画像                         | SHA-256                                                            |
| ---- | ---------------------------- | ------------------------------------------------------------------ |
| ja   | `01-focus-map.png`           | `cf56a5b49239e3bde1129b9cfe1a750b380a1378ee50fe51ee61bbceaabcbc15` |
| ja   | `02-apex.png`                | `b33a536f132687223588e1157381392d88dfdc61087efe5bac8ea20f6b5e0387` |
| ja   | `03-actual-size-sensors.png` | `9ee9486327ffbfd49682808b0fdbeb3d304aa173b0ea6be1c4e266685636d969` |
| ja   | `04-bellows.png`             | `a5928098504d0eeeb97dc3ff3b67b123b3910c9b708f91cdd65e3a7e2bb9cf26` |
| en   | `01-focus-map.png`           | `76df03f8f06317b00d1de0560194d2d8780ca96fde9e9e79daa619ef4a4efb8c` |
| en   | `02-apex.png`                | `a732f6e8cdb2c36c50d9a1cc36b41f1422aa20f7cfb90573dd3dcc1c32cc5290` |
| en   | `03-actual-size-sensors.png` | `b00b87c7f4b99dd1ac16ef2d4e98f351ce504c4bdd0338d3b03ed07e2a0c263a` |
| en   | `04-bellows.png`             | `c2e80739f75de66a495d37399878d3569701ca6f6536ee3c419f0d1ffb4ce972` |

実素材、撮影fixture、対象Simulator、検査手順、全hashの正本は、Focus Map側の `Docs/Release/AppStoreSubmission/README.md` と `Docs/Release/2026-08-31-app-store-assets-audit.md` です。

## 証拠の境界

この8枚はiPhone 17 Pro Max Simulator上の2026-08-31時点の画面を示します。改名後の最終binary、物理的実寸、実指での片手操作、実機のVoiceOver・触覚・屋外視認性、署名済み候補、TestFlight、App Store配布を示しません。App Store Connectへ登録する直前にも、選択したbinaryと画像の文言・機能が一致することを再照合します。

参考: https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/
