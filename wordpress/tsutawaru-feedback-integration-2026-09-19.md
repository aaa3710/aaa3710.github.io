# 伝わる文字のフィードバック統合

2026-09-19、伝わる文字の本人直接依頼に基づくローカル改修。WordPress原本への保存・日英・表示・静的書き出し・回帰検証まで完了。一般公開、GitHubへのpush、Google Formsの設定変更・回答操作は行っていない。本人意思の内容正本は管理のOWNER_INTENTとする。

## URLとページ構成

| 用途               | 日本語                           | 英語                                |
| ------------------ | -------------------------------- | ----------------------------------- |
| 正規フィードバック | `/apps/feedback/tsutawaru-moji/` | `/apps/en/feedback/tsutawaru-moji/` |
| 旧Supportから転送  | `/apps/support/tsutawaru-moji/`  | `/apps/en/support/tsutawaru-moji/`  |
| 共通Contact        | `/apps/contact/`                 | `/apps/en/contact/`                 |

アプリのSupport／Feedbackリンクはいずれも正規フィードバックを使える。旧SupportはWordPressでは301、GitHub Pages用出力では即時HTML転送と手動リンクになる。さらに古い `/support/tsutawaru-moji/` と `/en/support/tsutawaru-moji/` も、途中ページを挟まず正規フィードバックへ向ける。

既存FeedbackページID54/75へ、Supportで本人が残した共通Contactの説明を統合した。アプリ名・アイコン・アプリ一覧の入口を保持し、紹介／フィードバック／プライバシーの3タブで現在地を表示する。専用の匿名Feedbackと、返信先を任意入力できる共通Contactを混同しない。通常問い合わせの返信非保証と、適用法令に基づくプライバシー請求への対応も維持した。説明書は復活させていない。

送信ボタンは確認済みの同じ日英Google Forms回答者URLをそれぞれ1つだけ保持。送信内容の制限・利用目的・国外処理・保持削除・AI未稼働の説明を残し、詳しい取扱いは従来の折りたたみで読める。noindex/nofollowとサイトマップ非掲載は従来どおりだが、アプリ内の3タブから直接到達でき、隠れた別動線ではない。

旧SupportのID68/89と保存済み本文は復旧用に保持し、表示時は転送する。WordPressの通常「Webサイト」一覧では転送ページを除外する。紹介ID25/45の `_apps_feedback_tab=1` と、旧Supportの `_apps_redirect_to` が設定正本。他アプリのタブ・本文・受付は変更しない。

## 本人編集と版の区別

WordPressのページ・下書き・メディア・テンプレート部品・共通スタイル・ナビゲーション、計129件を読み、全公開ページの見出し・画像・概要を見渡した。今回の本文変更は8件、metadataだけの変更は旧Support2件。Contactの2件は伝わる文字のリンクとラベルだけ、Privacyの2件は重複した旧Supportリンクだけを変更した。他の119件、共通テーマの外観、画像と受付optionは不変。

本人編集済みの紹介本文・料金説明は変更していない。配布状態の段落のみ、1.0.1準備中・料金と50回利用枠は1.0.1の仕様・現在App Store配信停止へ日英で更新した。配信停止は依頼元が今回App Store ConnectのアプリID6808933286、1.0.0 build29と「App Storeの配信から削除」表示を照合した結果に基づく。過去の1.0.0公開宣言と、今回の配信状態・今後の1.0.1準備を混同しない。購入成立や再配信をWeb側で検証済みとはしていない。

`list_threads` はこの実行環境にないため使えなかった。代わりに、親タスク内で編集担当を認知repoに限定し、開始時のGit clean、全対象の変更直前content/excerpt hash・modified一致とWordPressの編集lock、保存後の全文読み戻し、最終差分範囲を確認した。同時編集を上書きしていない。

## 検証・復元

- 変更8本文の422/422標準ブロックと、Contactリンク表示の仕上げ後の52/52ブロックが実エディタで妥当。自動修正なし。
- 日英Feedbackを390pxと1040pxで目視。3タブ・現在地・フォームボタン・折りたたみ・下線付きContactリンクが表示され、横はみ出しなし。
- 元のページID・slug・紹介本文を保全し、最終の変更IDは9/25/31/45/54/61/68/75/82/89だけ。全変更を読み戻し、他オブジェクトと受付optionの不変を確認。
- 回帰53/53成功。追加の試験は日英旧Supportの直接転送、旧aliasからの多段転送防止、フォームの重複なし、外部／不存在／循環／別言語／indexable転送拒否。
- 最終出力 `work/wordpress/exports/2026-09-19T11-35-44Z` は必須68/68ページ、113経路、226 HTML、3552検査に成功。format・変更scriptのlint成功。採用済み `site-output/` への昇格はしていない。
- 最終の再書き出し照合で242配信ファイルが一致。WordPress上の日英旧SupportのHTTP 301、紹介／Privacy／Feedback全6ページの3タブと現在地、適用済みプラグインと追跡sourceのbyte一致も確認した。
- 編集前後の公開原本文・差分・ログは非公開 `work/wordpress/feedback-integration-2026-09-19/`。原本全体のバックアップは `work/wordpress/backups/2026-09-19-tsutawaru-feedback-complete.tar.gz`、35,431,202 bytes、SHA-256 `210b0ea4f68065d968105d673906f6d5b0b0ba0e22fe30d9f859b7626516c075`。DB・認証情報はGit対象外。

## 公開前に残ること

Web公開の明示指示後、現在のWordPressを再書き出し・比較して採用し、通常の公開手順でGitHub Pagesへ反映する。その時点のASC配信状態と1.0.1の実装・購入可能性を照合して版注記を更新する。今回のローカル検証は実フォームの新たな送受信確認や本番のURL転送成立を証明しない。Google Forms設定・回答を変更する必要はこの統合では生じていない。
