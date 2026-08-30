# Apps website

Focus Mapを最初の完成例として、個人制作アプリの正確な入口をつくる日英対応サイトです。

## 現在公開する内容

- Focus Mapのトップページと詳細ページ
- 日本語・英語
- プライバシーポリシー
- サポートと計算の前提
- 全アプリ共通の公開フィードバックページと、アプリ内からだけ開くFocus Map専用ページ
- ほかのアプリの準備中ページ
- 検索向けのサイトマップ、robots.txt、共有用画像
- GitHub Pages向けの自動公開設定

## ローカル確認

```bash
npm install
npm run dev
```

## 検証

```bash
npm run lint
npm run build
npm run build:pages
```

GitHub Pagesでは、ログイン後に確認するアカウント名の `<アカウント名>.github.io` リポジトリを使い、`dist/client/` の静的ファイルをGitHub Actionsから公開します。このルート形式にすることで、画像や共有URLをサブディレクトリに依存させません。

フィードバックページは匿名のGoogleフォームを埋め込みます。公開用の回答者URLだけを `lib/feedback.ts` で管理し、フォーム編集URL、回答本文、認証情報はGitへ保存しません。Webサイト共通入口だけを公開導線とサイトマップへ載せ、対象アプリを選択します。アプリ専用入口ではアプリ名・言語を質問せず、対象アプリからだけ開く非掲載ページとして `noindex, nofollow` を指定します。
