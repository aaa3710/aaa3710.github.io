# Apps website

個人制作アプリを見つけ、内容を誤解せずに紹介・サポートへ進める日英対応サイトです。公開サイトはGitHub Pages、Webの編集原本はこのMacのWordPress Studioです。

## 編集する

デスクトップの **「Webサイト編集」** をダブルクリックすると、WordPressを起動してChromeで編集画面を開きます。`アプリケーション` フォルダにも同じ入口があります。会話内のファイルリンクを実行ボタンとして使う必要はありません。

- 各ページの「編集」で文章・画像・節の順序を変更し、保存します。
- 「共通デザイン」でサイト全体の色や書体を変更します。
- 「ローカルで確認」で仕上がりを確認します。片方の言語を編集すると、対応する他方に確認表示が付きます。

保存先はこのMac内です。WordPressの「ローカルで確認」で仕上がりを見て、Codexへ **「現在のWordPressを公開して」** と伝えてください。Codexが書き出し・検証・GitHub Pagesへの公開まで行います。本人による書き出しやSitesの確認は不要です。保存だけでは一般公開されません。[編集原本をバックアップ.command](編集原本をバックアップ.command)で本文・画像・デザインをまとめて保存できます。

使い方と保守手順は[WordPress運用](wordpress/README.md)、実装・検証・公開の現在地は[改修記録](website-refinement-2026-09-07.md)を参照してください。

## 正本と担当

本人の希望・公開範囲は[OWNER_INTENT](/Users/minatosuzuki/work_local/アプリ管理/OWNER_INTENT.md)、担当は[共通README](/Users/minatosuzuki/work_local/アプリ開発共通事項/README.md#関連projectとの責任境界)に従います。機能事実・実画面・プライバシーの内容は各アプリの現行資料、提出・配信・問い合わせ運用は管理台帳を参照します。新しい機能や提供条件をWeb編集だけで確定しません。

WordPressへ移したWebの文章と配置はWordPressで編集します。`app/`、`components/`、旧公開原稿JSONと `sync-*-copy.mjs` は移行元の記録です。旧同期スクリプトでWordPressを上書きしたり、Web原稿を二重に手編集したりしません。アプリ側で機能事実が変更された時は、その確定差分を照合してWordPressへ反映します。

- 伝わる文字: 本体 `Docs/Public/`、初回取込commit `0350e3df114f3672442545f58ee89cb9553d7695`。[公開記録](app-store/tsutawaru-moji/site-verification-2026-09-05.md)
- 道の記録: 本体 `Docs/AppStoreMetadata-*`・`Support-*`・`PrivacyPolicy-*`、初回取込commit `a850c9e3edff1e2b9c45fc2ba5e71de1e3412a2a`。[準備記録](app-store/location-logger/site-verification-2026-09-05.md)

## 表示と問い合わせの境界

全アプリの紹介・サポート・プライバシーを同じ順序と共通デザインで案内します。紹介未整備のアプリは名前と準備状態のみです。日本語は意味のまとまりで折り返し、長文の詳細は開閉して読めます。実画面との一致が未確認の旧画像は保持し、画面には掲載していません。

Contactと各アプリ専用Feedbackは現在受付準備中です。実フォーム・設定の確認が終わるまで送信可能にしません。専用Feedbackは匿名の自由記述1欄、共通Contactは用件と任意の返信先という区別を維持します。Feedbackはサイトマップへ載せず `noindex, nofollow` とします。

以前の `NEXT_PUBLIC_*_READY` はReact移行元の設定です。現在のビルドは確認済みの静的ファイルをコピーするため、環境変数だけを変更しても受付は有効になりません。受付開始時には[PROJECT_CONTEXT](PROJECT_CONTEXT.md#このサイト変更の外部ゲート)の条件を照合し、WordPress・静的書き出し・実フォームを一緒に改修・検証します。現行の書き出しは動的フォームを検出すると停止します。

## 検証とビルド

```bash
npm ci
npm run format -- --check
npm run lint
npm test
npm run build:pages
npm run verify:pages
npm run dev
```

`build:pages` は `site-output/` の全ファイルのハッシュを検査し、そのまま `dist/client/` へコピーします。WordPressのDBや旧React原稿から再生成しません。`dev` は `site-output/` のローカル確認用です。GitHub Actionsも同じ静的ファイルを公開します。

## URL構成

本人の希望は[意思の正本](/Users/minatosuzuki/work_local/アプリ管理/OWNER_INTENT.md#アプリ関連Webページの共通階層)を参照します。今後の趣味・記事などに大元を使えるよう、アプリの紹介・Support・Privacy・Feedback・運営のContactを共通階層へ揃えました。英語も必ず `/apps/` から始まります。

| 用途                | 日本語                   | English                     |
| ------------------- | ------------------------ | --------------------------- |
| アプリ一覧          | `/apps/`                 | `/apps/en/`                 |
| 紹介                | `/apps/<slug>/`          | `/apps/en/<slug>/`          |
| Support             | `/apps/support/<slug>/`  | `/apps/en/support/<slug>/`  |
| Privacy             | `/apps/privacy/<slug>/`  | `/apps/en/privacy/<slug>/`  |
| Feedback            | `/apps/feedback/<slug>/` | `/apps/en/feedback/<slug>/` |
| アプリ運営のContact | `/apps/contact/`         | `/apps/en/contact/`         |

大元 `/` と `/en/` は当面アプリ一覧へ案内します。旧URL31件は、固定の新URLへの即時HTML転送と手動リンクを持ち、`noindex, nofollow` とします。HTTP 301ではありません。廃止済みの `focus-map` と旧共通Feedbackは復活させません。転送もWordPressからの静的書き出しに含め、確認版と本番に同じファイルを使います。

アプリの機能事実・プライバシーの内容正本は各アプリ、Webの文章・配置の編集原本はWordPress、公開URLと移行の検証記録は[URL移行記録](app-store/url-migration-2026-09-05.md)で管理します。過去の公開検証記録は当時の証拠として保持します。

## 公開URL

以下は共通階層への移行後の公開済みURLです。公開・転送の検証結果は[移行記録](app-store/url-migration-2026-09-05.md)を参照します。旧 `focus-map` と旧共通Feedbackは引き続き404とします。

| 用途      | 日本語                                                               | English                                                                 |
| --------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Marketing | `https://aaa3710.github.io/apps/focus-exposure-calculator/`          | `https://aaa3710.github.io/apps/en/focus-exposure-calculator/`          |
| Support   | `https://aaa3710.github.io/apps/support/focus-exposure-calculator/`  | `https://aaa3710.github.io/apps/en/support/focus-exposure-calculator/`  |
| Privacy   | `https://aaa3710.github.io/apps/privacy/focus-exposure-calculator/`  | `https://aaa3710.github.io/apps/en/privacy/focus-exposure-calculator/`  |
| Feedback  | `https://aaa3710.github.io/apps/feedback/focus-exposure-calculator/` | `https://aaa3710.github.io/apps/en/feedback/focus-exposure-calculator/` |
| Contact   | `https://aaa3710.github.io/apps/contact/`                            | `https://aaa3710.github.io/apps/en/contact/`                            |
