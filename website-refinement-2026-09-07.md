# サイト改修と手動編集の移行案（2026-09-07）

本人の希望・確定事項は [OWNER_INTENT](/Users/minatosuzuki/work_local/アプリ管理/OWNER_INTENT.md#webサイトの読みやすさ統一と本人による編集)を参照する。本書は認知側の実装と提案の記録であり、WordPress採用を決定済みとは扱わない。

## 今回の実装

- 一覧をページ先頭から選べる構成にし、巨大な導入・重複するお問い合わせ誘導・「使いやすさについて」を日英とも削除。
- 3アプリの日英紹介・Support・Privacy・Feedbackを共通ヘッダーに統一。「紹介→サポート→プライバシー」の順序と現在位置を共有し、FeedbackはSupport内に置く。URLは維持。
- app-catalogを一覧・案内・検索サイトマップの共通定義にする。紹介未整備の6アプリは一覧内で名前と準備状態だけを示す。
- BudouXによる日本語の意味単位の折り返し、固有名・専門語の保護、見出しの句単位の調整を共通化。英語は通常の単語間で折り返す。非常に狭い幅や拡大時には横はみ出しを避けるための緊急折り返しを許す。完全な日本語解析や実機VoiceOver検証を保証しない。
- BudouX 0.7.0に固定。必要なAPIと日本語モデルに対応し、後続版の不要な認証依存を持たない。plain textのparseのみ使用し、HTML文字列の挿入や外部への文章送信は行わない。
- 本文16px以上、通常のナビ14px以上。白に近い背景、共通の余白と見出し尺度を使用。
- 公開準備中は押せないボタン風の表示を廃止。Contact・Feedbackの受付停止は冒頭で確認できる。フォーム有効化・実送信・外部URLの追加は行わない。
- 撮影アプリのPrivacy・Supportを他アプリと同じ開閉式の文書表示へ合わせる。同時期の別タスクが加えたプライバシー・TestFlight説明は保持し、この表示改修を法的内容の再監査とは扱わない。
- TSXからの手動編集を不要にする管理画面は今回まだ構築していない。共通化した表示基盤と、以下のWordPress移行案を分ける。

## 推奨する編集構成

WordPress Studio（Mac内の唯一のWeb編集原本）
→ 公開対象だけを静的出力
→ 同じ出力をSitesで本人確認
→ 確認した出力をGitHub Pagesへ反映

WordPressを本番公開サーバーにする必要はない。Sitesは書き出したページの確認用コピーであり、WordPressを実行する場所でも、独立して手修正する原本でもない。Studioの公式MCPをCodexへ接続すれば、本人とCodexが同じWordPressを扱える。現在のセッションにはWordPress専用MCPが接続されていない。

初回移行では現在のReact画面をWordPressのブロックテーマへ移し、紹介・Support・Privacyの共通テンプレート、日英の対応、既存URLを再現する。文章・画像・節の追加・順序はブロックエディター、サイト全体の字間・余白・色は共通スタイルで編集する。任意の個別CSSを常用せず、全アプリへの一括反映を可能にする。

機能事実とプライバシーの内容正本は当面各アプリの既存資料にあるため、移行時に責任境界と同期方法を確定する必要がある。移行済み原稿を旧JSON同期で上書きしないよう切り替える。WordPressの文章とTSXの文章を並行して手編集しない。

下書き保存、プレビュー、公開反映、過去版へ戻す操作を分離する。WordPressのDB・アップロード画像・テーマを復元できるバックアップを用意し、静的HTMLだけを編集原本のバックアップとはしない。日英の片方を編集した際に他方の確認が必要だと分かる編集状態を持たせる。

静的出力にはSimply Static等が候補。PHP・ログイン・WordPress内検索・動的フォーム・会員制など、WordPressサーバーを必要とするプラグイン機能はそのままGitHub Pagesで動かない。Google Formsの埋め込み等は出力後の実動作と既存の受付条件を確認する。すべてのWordPressプラグインが自在に使えるという意味ではない。

Studioの共有プレビューは最長7日なので恒久原本にしない。SitesとGitHub Pagesの同期は、将来の公開操作で同じ成果物を配る処理として実装する。今回、常駐同期・定期実行は開始していない。

## 次の実装単位

1. Mac上のWordPress Studioと公式MCPをセットアップする。
2. 1アプリの日英の紹介・Support・Privacyを共通ブロックテーマで再現し、本人が文章・画像・順序を変更できることを確認する。
3. その編集内容を静的出力し、既存URL、言語切替、改行、フォーム停止、サイトマップを検証する。
4. 3アプリへ展開し、原稿の管理先を一度だけ切り替える。確認用と本番は同じ出力を使用し、GitHub本番反映は本人の公開指示範囲で行う。

## 残る素材

撮影のものさしの改名後の日英実画面は、対象アプリの `Docs/Release/2026-09-05-photo-yardstick-rename.md`（9月7日更新）で撮影未完了。旧画像への文字加工や未確認画像の流用はしていない。他のアプリも進行中の本体変更と現在画面の一致を確認してから掲載する。

## 一次資料

- [WordPress Studio公式MCP・Codex接続](https://developer.wordpress.com/docs/developer-tools/studio/mcp-on-studio/)
- [WordPressサイトエディター](https://wordpress.org/documentation/article/site-editor/)
- [Simply Static](https://wordpress.org/plugins/simply-static/)
- [Studioプレビューの有効期間](https://developer.wordpress.com/docs/developer-tools/studio/preview-sites/)
- [Google BudouX](https://github.com/google/budoux)

## 検証（2026-09-07）

- npm test: 21/21成功。日本語の意味単位・固有名保護・文字列保全を含む。
- lint、TypeScript型検査、Git差分形式検査: 成功。
- GitHub Pagesビルド: 成功。既存の環境上の非推奨警告は残るが、静的生成は完了。
- 本番origin設定での静的検査: 必須28/28ページ、71公開ルート（旧転送を含む）、2019検証成功。検索サイトマップ22URL、Feedback除外、日英の相互参照、3アプリの共通ナビ順序・現在位置を検査。
- ブラウザ確認: 日本語の一覧・撮影紹介・道の記録紹介・Contact、日英の伝わる文字Support、英語一覧を確認。390pxと1100pxで代表ページを目視し、道の記録は320pxでも横はみ出しなし。紹介リンク、共通Contact、同じページへの言語切替を実操作。実機VoiceOverと全幅・全文字倍率の網羅確認は未実施。
- 依存検査: 採用版導入後、npmは既知の脆弱性0件を報告。
- GitHub本番へのpushは今回未実行。Sitesの本人限定確認版と本番を区別する。

## 確認版への反映状態

2026-09-07、本体リポジトリを既存Sitesのソースへpushする操作は、自動承認レビューが「内部資料を含み得る送信先別の承認不足」として拒否した。送信とSites更新は未実行。GitHub本番も未更新。

対応として、実装ファイル・公開画像・公開原稿スナップショット・構築/検証設定だけの94ファイル（約4.5MB）を `/private/tmp/apps-preview-source-20260907/` に読み取り元とバイト一致で準備した。`AGENTS.md`、`OWNER_INTENT.md`、PROJECT_CONTEXT、運用資料、.env、認証情報、.git履歴、node_modulesは含めない。ファイル別SHA-256の一覧は同フォルダのSOURCE_MANIFEST.json。送信していない。

静的配信用アーカイブは `/private/tmp/apps-preview-20260907.tar.gz` にSites公式パッケージ手順で準備・検証済み。承認後はこの限定ソースから独立したSites用checkoutを用意し、元のGitHubリポジトリ履歴を外部へ送らず、同じ公開内容を保存・本人限定公開する。Sites側の既存履歴を上書きするforce pushはしない。既存のSite IDを再利用し、公開範囲は再確認する。

再開条件: 本人が、内部資料とGit履歴を除いた公開ページ用ソースを本人限定Sitesへ送信する範囲を承認すること。WordPress移行の実施とは別の確認である。
