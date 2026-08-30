# Focus Map — App Store公開準備

このフォルダは、App Store Connectへ入れる文面、画像の状態、App Previewの撮影計画、公開前の所有者判断を一か所で確認するための索引です。

制作背景はアプリ管理側の `app_profiles/focus-map.md`、機能と画面はFocus Mapアプリ側の現行仕様を参照します。公開文面は利用場面から始め、専門用語と開発工程を初見の入口へ置きません。

## 現在の状態

- 名前、サブタイトル、プロモーション用テキスト、説明、キーワードの日英案は、現行仕様と再照合済み。事実不一致がないため今回は変更していない。
- 日本語4枚・英語4枚のスクリーンショットは、Focus Mapのコミット`7ec79a1f906195bea31940fbbfdd321f24ca40b8`にある現行Debug fixtureから再撮影済み。8枚とも形式検査と独立した全数原寸目視に合格した。
- 日本語25.5秒・英語24.5秒のApp Preview候補も、同じ現行Simulator画面から実録画・検査済み。静止画だけで提出するか候補を採用するかは所有者判断。
- プライバシー、セルフサポート、フィードバックページはサイトへ公開済み。
- 監視可能な問い合わせ先、最終URL、公開地域、公開日、価格0円は所有者の最終決定待ち。
- App Store Connectへの素材登録、配布用署名、Validate App、TestFlight、提出は未実施。

現在の素材は、iPhone 17 Pro Max Simulatorで表示した現行UIの証拠です。物理的実寸、実指操作、実機のVoiceOver・触覚・片手操作、署名済み候補、TestFlight、App Store配布の証拠ではありません。

## ファイル

- `metadata.ja.md`: 日本語の入力文面
- `metadata.en.md`: 英語の入力文面
- `screenshots.md`: 現行8枚の順序、形式、独立確認、証拠境界
- `app-preview.md`: 日英の実録画候補、技術条件、採否判断
- `release-checklist.md`: App Store Connectへ進む前の残作業

## 現行素材の所在

実素材の正本はFocus Map側に置き、このリポジトリへ複製しません。

- スクリーンショット: `Docs/Release/AppStoreSubmission/Screenshots/{ja,en}/`
- App Preview候補: `Docs/Release/AppStoreSubmission/AppPreviews/{ja,en}/`
- 最新監査: `Docs/Release/2026-08-31-app-store-assets-audit.md`
- 対象コミット: `7ec79a1f906195bea31940fbbfdd321f24ca40b8`

上記はいずれも `/Users/minatosuzuki/work_local/被写界深度計算ツール/` を基準にしたpathです。旧8枚は同じ提出用pathで置換済みで、現行候補へ混ぜません。
