# サイト改修とWordPress編集への移行（2026-09-07）

本人は提案の採用と実装を承認した。希望・採用方針は[OWNER_INTENT](/Users/minatosuzuki/work_local/アプリ管理/OWNER_INTENT.md#webサイトの読みやすさ統一と本人による編集)、日常の操作は[WordPress運用](wordpress/README.md)を参照する。

## 実装した内容

- 一覧をページ先頭から選べる構成にし、巨大な導入・重複するContact誘導・「使いやすさについて／やりたいことへ、迷わず進めるように。」を日英とも削除。
- 3アプリの日英紹介・Support・Privacy・Feedbackで共通ヘッダーと現在位置を使用。案内順序は紹介→サポート→プライバシー。Feedbackは各アプリとそのSupportから案内し、サイトマップへ載せない。既存URLは維持。
- 3アプリは同じカード構成、紹介未整備の6アプリは名前と準備状態だけを表示。専門的な詳細は開閉して読む構成に統一。
- 日本語はBudouXによる意味単位の折り返しと固有名保護を使用。WordPressの見出し・本文・箇条書き・開閉見出しにも適用。英語は通常の単語間で折り返す。極端に長い語や狭い幅・拡大時は横はみ出しを防ぐため緊急折り返しを許す。
- 本文・画像・節の順序は通常のWordPressブロックで編集でき、共通の色・書体はSite Editorへ接続。日英の片方を編集した時は他方の確認を促す。

## 編集環境

Mac内のWordPress Studioを唯一のWeb編集原本にした。日英40ページを階層付きの固定ページに移し、2アイコンをメディアライブラリへ登録。共通テーマと編集支援プラグインのコードは `wordpress/`、本文DB・画像・保存済みデザインはGit対象外の `work/wordpress/site/` に置く。旧React原稿は移行元の記録であり、WordPressと二重に手編集しない。

公式Studio MCPを `wordpress-studio` としてCodexへ登録し、接続・ツール一覧・ブロック検証を実行した。現在のセッションで追加MCPが自動表示されない場合でも公式CLIで操作でき、次のタスクからMCPを読み込める。WordPress.com用プラグインのサインインは別の接続であり、既存のWordPress.comサイトは変更していない。

編集入口は [Webサイトを編集.command](Webサイトを編集.command)。Chromeでは実際のブロック編集・保存ができた。Codex内蔵ブラウザではGutenbergの編集キャンバスが空白になるため、編集入口はChromeを使う。

## 書き出しと公開の構成

WordPress Studio → 公開対象のみ静的出力 → 同じ出力を本人限定Sitesで確認 → 確認した出力をGitHub Pagesへ反映。

`wordpress-snapshot.mjs` は公開・パスワードなしの `/apps/` 配下を抽出し、参照画像・CSSとともに保存する。管理画面・DB・下書き・PHP・動的フォーム・未対応の外部資源を検出した場合は停止する。全ファイルのSHA-256を記録し、未検証ファイルの混入や手編集による改変を検出する。既存URL転送、検索情報、日英対応も検査する。

確認した出力を `site-output/` へ採用し、GitHub Actionsのbuildはそのまま `dist/client/` へコピーする。WordPressや旧Reactから本番用に作り直さない。Sitesは静的な確認用コピーであり、WordPressを稼働させる場所ではない。PHP・ログイン等が必要なプラグインをGitHub Pagesでそのまま動かす構成ではない。

[確認版を書き出す.command](確認版を書き出す.command)を用意した。常駐同期・定期公開は開始していない。Google Formsは引き続き受付準備中で、実送信・実フォーム設定・App Store操作は行っていない。

## バックアップ

[編集原本をバックアップ.command](編集原本をバックアップ.command)はStudioの完全ZIPと共有画像2枚をまとめ、本文・階層・テンプレート・ナビ・スタイル・設定・テーマ・プラグイン・アップロード画像の照合証拠を添える。標準ZIPだけではサイトルートの共有画像が欠けるため、補完している。

別の `work/wordpress/restore-check/` へ復元し、40公開ページ、54保存レコード、テーマ403件、通常プラグイン55件、must-use plugin 45件、アップロード8件、共有画像2件の一致を確認した。Studioが復元先のパスに合わせて作る `99-studio-loader.php` だけはハッシュ比較から除き、バックアップ自体には含める。原本への誤復元、既存バックアップの上書き、破損した構成物の復元を拒否する検証も成功。

最新版CSSを含む復元確認済みバックアップは `work/wordpress/backups/2026-09-07-complete-approved.tar.gz`。バックアップは非公開の `work/wordpress/backups/` に保管し、GitやSitesへ送らない。端末故障に備えた別媒体への定期複製は未設定。

## 検証

- npm test: 37/37成功。旧来の公開設定・文字列保全の21件と、静的書き出しの正常系・漏えい拒否の16件。
- lint、format、TypeScript型検査: 成功。
- 静的検査: 必須28/28ページ、71公開経路、142 HTML、2019項目成功。サイトマップ22URL、Feedback6ページの検索除外、日英相互参照、3アプリの案内順序と現在位置を確認。
- 公式Studio MCPで実際のSupportページ139ブロックを検査し、139件すべて有効。
- Chromeで日本語一覧の本文を手編集して保存通知を確認。英語も対応する文面に更新し、静的ファイルへの反映を確認。共通デザイン画面の書体・色・レイアウトへの入口も確認。
- 日本語一覧・英語一覧・伝わる文字Supportを390px、一覧を1040pxで公式Studio MCPから撮影して目視。開閉見出しの「（任意）」が途中で割れる問題を修正し、単位を保った折り返しを再確認。実機VoiceOverと全幅・全文字倍率の網羅確認は未実施。
- サンドボックス内でのテスト用サーバー・ブラウザ起動は権限エラーになるため、該当するローカル検証を通常権限で実行。

## 外部への反映状態

本人限定Sitesは表示改修版のversion 2を保存・deploy済み。sourceは `e9f5b67ea6b4edb58b1ae7ee45489c3d3cea3a39`。公開範囲は本人1名のみ、外部ユーザー・グループなしを確認した。

WordPress由来の最新版はローカルで完成し、GitHub本番は今回未更新。最新版をSitesソースへpushする操作は、自動承認レビューがAGENTS.mdの「pushは明示指示時だけ」に照らし、今回の承諾では不足と判定して拒否した。回避や再送は行っていない。

送信準備済みの成果物:

- 一時checkout: `/private/tmp/apps-wordpress-sites-20260907/`
- source SHA: `1f0ccb45c2dcaca2e4e941d012ec99d059c04d07`
- 配信用archive: `/private/tmp/apps-wordpress-sites-20260907.tar.gz`（Sites公式package-site.shで検証済み）
- 送信対象: 公開用の静的152ファイルとhosting設定1件。約6MB。元repoの内部資料、元Git履歴、認証情報、WordPress DBは含めない。

再開に必要なのは「この静的確認版を本人限定Sitesへpushしてよい」という明示指示。承認後に公開範囲とリモートHEADを再確認し、fast-forwardで送信、実HEADを再取得して同じarchiveと保存・deployする。GitHub本番反映は別の公開操作として扱う。

## 残る素材

撮影のものさしの改名後の日英実画面は、対象アプリの `Docs/Release/2026-09-05-photo-yardstick-rename.md`（9月7日確認時点）で撮影未完了だった。旧画像への文字加工や未確認画像の流用はしていない。他のアプリも、本体変更と現在画面の一致を確認してから掲載する。

## 参照資料

- [WordPress Studio公式MCP・Codex接続](https://developer.wordpress.com/docs/developer-tools/studio/mcp-on-studio/)
- [WordPressサイトエディター](https://wordpress.org/documentation/article/site-editor/)
- [Google BudouX](https://github.com/google/budoux)
