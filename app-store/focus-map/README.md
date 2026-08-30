# Focus Map — App Store公開準備

このフォルダは、App Store Connectへ入れる文面、画像の状態、App Previewの撮影計画、公開前の所有者判断を一か所で確認するための索引です。

制作背景はアプリ管理側の `app_profiles/focus-map.md`、機能と画面はFocus Mapアプリ側の現行仕様を参照します。公開文面は利用場面から始め、専門用語と開発工程を初見の入口へ置きません。

## 現在の状態

- 名前、サブタイトル、プロモーション用テキスト、説明、キーワードの日英案は準備済み。
- 日英各4枚の既存スクリーンショットは形式条件だけを満たす旧素材であり、8枚すべて提出不可。
- `02-apex.png`は旧APEX画面、`03-actual-size-sensors.png`は実寸表示ページではない。残る画像も現行の正確な画面として一式確認できていないため、現行ビルドから全8枚を撮り直す。
- プライバシー、セルフサポート、フィードバックページはサイトへ公開済み。
- 監視可能な問い合わせ先、最終URL、公開地域、公開日、価格0円は所有者の最終決定待ち。
- App Previewは未制作かつ任意。全8枚の再撮影と現行画面の確認後、実録画できる場合だけ制作する。

## ファイル

- `metadata.ja.md`: 日本語の入力文面
- `metadata.en.md`: 英語の入力文面
- `screenshots.md`: 画像順と撮り直し対象
- `app-preview.md`: 27秒の撮影台本と技術条件
- `release-checklist.md`: App Store Connectへ進む前の残作業

## 現行素材の所在

アプリ側の `Docs/Release/AppStoreSubmission/Screenshots/ja/` と `en/` が素材の置き場ですが、現在の8枚は履歴確認用であり、提出候補ではありません。現行の正確なソースから日英8枚を再撮影し、形式検査と全画像の目視確認を終えた後にだけ正本を更新します。詳細な停止理由と再撮影条件は、アプリ側の `Docs/Release/2026-08-30-final-audit.md` と `Docs/Release/AppStoreSubmission/README.md` を参照します。
