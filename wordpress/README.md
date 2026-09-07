# WordPressでWebサイトを編集する

デスクトップの **「Webサイト編集」** をダブルクリックし、Chromeの「Webサイト」から編集します。WordPressが停止している場合も、起動を待ってから編集画面を開きます。WordPressでの保存はこのMac内だけです。既存のWordPress.comサイトとは別の編集環境です。

## 普段の操作

1. 日本語または英語の「編集」を開き、文章・画像・節の順序を変更して保存する。
2. もう片方の言語を照合し、「日英を確認済みにする」を押す。
3. 「ローカルで確認」でページを確認する。全ページに共通する色・書体は「共通デザイン」で変更する。
4. Codexへ **「現在のWordPressを公開して」** と伝える。書き出し・検証・GitHub Pagesへの公開はCodexが行います。保存だけでは一般公開されません。

画像の追加・交換、通常のブロックの追加・移動はWordPressで行えます。PHP、会員ログイン、サーバー内検索、動的フォーム等を必要とするプラグイン機能はGitHub Pages上では動きません。そのような機能や未対応の外部資源が混ざると、書き出しを停止し、前の配信物を保持します。

フォームの受付条件は[PROJECT_CONTEXT](../PROJECT_CONTEXT.md#問い合わせ導線の境界)を参照してください。現在は全件受付準備中です。

## 編集原本と配信物

| 場所                                    | 役割                                                                                       |
| --------------------------------------- | ------------------------------------------------------------------------------------------ |
| `work/wordpress/site/`                  | 本文・固定ページ階層・Site Editorのカスタマイズ・アップロード画像を持つ編集原本。Git対象外 |
| `wordpress/theme/`・`wordpress/plugin/` | 共通テーマと編集支援のコード。Gitで保管                                                    |
| `work/wordpress/exports/`               | 日時別の静的書き出し。成功時だけ `latest-export.json` を更新                               |
| `site-output/`                          | 確認して採用した静的ファイル。ハッシュ一覧付き。手編集しない                               |
| `dist/client/`                          | GitHub Pagesへ渡す、採用済み静的ファイルのコピー                                           |
| `work/wordpress/backups/`               | 編集原本全体の非公開バックアップ                                                           |

Webの文章・配置はWordPressが原本です。機能事実・実画面・プライバシー上の仕様は引き続き各アプリの正本へ照合します。旧 `app/` と生成JSONは初回移行元として保持しますが、二つのWeb原稿を並行保守しません。`build:legacy` と `sync-*-copy.mjs` は移行元の検証用であり、通常の編集・配信に使いません。

テーマコードの更新は `node scripts/wordpress-install-code.mjs` で行います。この操作はコードだけをコピーし、本文DB・画像・保存済み共通スタイルを上書きしません。`wordpress/bootstrap.php` は初回移行専用で、移行済みの原本への再投入を拒否します。

## Codexが「公開して」と依頼された時

1. 本人意思の正本と現在のWordPress原本、Git差分、公開先の最新履歴を確認する。過去のSitesや古い書き出しを現在の原本と取り違えない。別の公開修正がある場合は原本と照合して後退を防ぐ。
2. `scripts/studio.sh site start --path work/wordpress/site --skip-browser --skip-log-details` で原本を起動し、`npm run wordpress:export` でその時点の公開対象を新しく書き出す。保存前の編集や下書きは含まれない。
3. 書き出した日英の表示・390px前後とデスクトップ・主要導線・受付停止・原本との一致を確認する。編集中に内容が変わった場合は混在した版を公開しない。
4. `node scripts/wordpress-promote.mjs <今回検証した出力ディレクトリ>` で採用し、GitHub Actionsと同じformat・lint・test・build・verifyを通す。配信対象は静的ファイルだけで、WordPress DB・管理画面・認証情報を含めない。
5. 差分を確認しコミットする。「公開して」の対象範囲で既存の `aaa3710/aaa3710.github.io` のmainへ通常pushし、Actionsのbuild・deploy成功と実公開URLを確認する。force pushしない。公開指示を再確認しない。
6. 今回の出力・commit・配信結果をPROJECT_CONTEXTへ記録し、公開URLを本人へ返す。公開完了前に完了と報告しない。Sitesの送信・deployは不要。

## バックアップと復元

[編集原本をバックアップ.command](../編集原本をバックアップ.command)は、WordPress Studioの完全ZIPに、標準ZIPの対象外となる共有画像2枚と整合性の記録を加えた非公開の `tar.gz` を作ります。本文・固定ページ階層・テンプレート・ナビゲーション・共通スタイル・設定・テーマ・プラグイン・メディアを照合します。実行中に本文等が変わった場合は混在したバックアップを採用しません。

バックアップは認証・編集データを含むため、Sitesや公開Gitへ送りません。ファイルはこのMac内に保存します。別端末の故障にも備える保管先への複製はまだ設定していません。

復元は新しい空のStudioサイトを用意し、対象を指定して行います。原本の `work/wordpress/site` への上書きはスクリプトが拒否します。移行先を確認する前に原本を消しません。

```bash
node scripts/wordpress-backup.mjs --path work/wordpress/site --output work/wordpress/backups/<日時>-complete.tar.gz
node scripts/wordpress-restore.mjs --backup work/wordpress/backups/<日時>-complete.tar.gz --path <新しいStudioサイトの絶対パス>
```

復元先は `work/wordpress/` の配下だけを受け付けます。Studio標準ZIPだけで復元した場合は共有画像2枚が欠けるため、この完全バックアップを使用してください。

## Codexの保守操作

起動入口は `~/Applications/Webサイト編集.app`、デスクトップはそのショートカットです。`scripts/open-wordpress.sh` が起動確認とChromeへの案内を行い、旧 `.command` もこの処理を使用します。失敗時はアプリがダイアログを表示します。会話内のファイルリンクは起動ボタンとして案内しません。

入口を再作成する場合は `scripts/install-wordpress-launcher.sh` を使います。既存の同名項目は上書きしません。インストール先のアプリはローカルで署名し、認証情報を含みません。

WordPress Studio CLI 1.20.0、WordPress 7.1、PHP 8.4で構築しています。Studio用のNodeは既存のCodex同梱Node 24を使い、システム全体のNodeは変更していません。

```bash
scripts/studio.sh site start --path work/wordpress/site --skip-browser --skip-log-details
node scripts/wordpress-snapshot.mjs
node scripts/wordpress-promote.mjs <確認した書き出しディレクトリ>
npm run build:pages
npm run verify:pages
```

静的出力は公開済み・パスワードなしの `/apps/` 配下だけを取得します。管理画面、DB、下書き、PHP、秘密情報を配信物へ含めません。サイトマップは22URL、Feedbackは6ページとも検索対象外です。旧URLのHTML転送を含め71経路を検査しています。

公式Studio MCPは `wordpress-studio` としてCodexへ登録済みです。接続とツール呼び出しを検証しました。現在のセッションで新規MCPが自動表示されない場合は、次のCodexタスクで読み込まれます。同じ操作は上記の公式CLIで実行できます。WordPress.com用プラグインへのサインインは、このローカルStudio MCPへの接続とは別です。

`studio site status --format json` は管理者パスワードも返すため、その生出力を表示・記録しません。管理画面はローカルのStudio自動ログイン経路を使用し、認証情報をGitや会話へ保存しません。

## 旧Sites確認版（通常運用では更新しない）

Sitesは現在の編集内容と同期しません。通常の確認・公開には使わず、削除や閲覧範囲変更は行っていません。以下は以前の反映手順の記録です。

[本人限定Sites](https://focus-map-apps.minato-yokohama.chatgpt.site/apps/)には、本人の明示承認を受け、WordPress由来の最新版（version 3）を反映済みです。公開用153ファイルのみを送り、本人1名だけの閲覧範囲を維持しています。

次回の反映時は `site-output/` の検証済みファイルを、Sites専用の一時checkoutの `out/` にコピーします。設定の静的出力先も `out` とし、Sites公式package-site.shで配信用archiveを作ります。Sitesの既存mainを親にし、fast-forwardで送信してから実HEADを確認し、そのSHAとarchiveを同じversionに保存します。本人限定の公開範囲を確認してdeployします。

元のリポジトリ全体やその履歴はSitesへ送りません。WordPressのDB・内部運用資料・認証情報も対象外です。このSites反映時点ではGitHub本番へのpushは未実行でした。現在は上記の直接公開手順を使います。自動同期・定期公開は行いません。

## 検証

[改修記録](../website-refinement-2026-09-07.md)に、実際の編集保存、静的検査、スマートフォン表示、MCPと復元の証拠を記録しています。日本語改行はGoogle BudouX 0.7.0のモデルをローカルのPHP処理に移植し、ライセンスを同梱しています。端末から文章を外部サービスへ送りません。
