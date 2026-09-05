# アプリ関連URLの共通階層への移行 — 2026-09-05

## 対象と本人の依頼

アプリ関連ページを日英とも `/apps/` 配下に統一し、大元を将来ほかの活動にも使えるようにする。[URL規則](../README.md#url構成)を適用する。本人は本番サイト変更と関連する正本の変更を含め、残作業の完了を直接依頼した。意思の内容正本はアプリ管理のOWNER_INTENT「アプリ関連Webページの共通階層」。

## 公開範囲

公開済み `741c747dd657eabdf447154d53873d9d784d1f4a` から隔離ブランチを作成し、URL移行だけを適用した。Focus & Light、Tsutawaru Mojiの公開本文、その他の準備中表示を維持する。別のローカル作業で準備したLocationLoggerの詳しいページ・新しい公開名・アイコン等をこの移行で公開しない。

新階層の実ページ34件と、従来URL25件からの即時HTML転送を生成する。転送はHTTP 301ではなくmeta refreshと手動リンク。転送ページは `noindex, nofollow` とし、canonical・hreflang・サイトマップへ旧URLを載せない。専用Feedbackも `noindex, nofollow` とサイトマップ除外を維持する。旧 `focus-map` と旧共通Feedbackは404を維持する。

ログイン済みGitHubのブラウザ画面で所有者 `aaa3710` と対象repositoryを確認。Actionsのrepository／environment variablesは0件であり、問い合わせの受付と公開メールは無効のままにする。

## 公開前検証

- 13テスト、lint、型検査、静的ビルドが成功。
- 主要20ページ、生成59経路、HTML118ファイル、1493項目の静的検証が成功。
- 内部リンク、言語切替、canonical／hreflang／OG、サイトマップを新階層に統一。
- 本番用静的ファイルをブラウザで確認。旧Feedbackから新URLへ移動し、英語切替も成功。日英Feedbackは390pxで横はみ出しなし、日本語一覧は1440pxで表示を確認。ブラウザ警告・エラー0。

## 本番の結果

2026-09-05、`182639bd2666d79fd08b3bbe63cc274d0440de78` を既存GitHub Pagesへpushし、[Actions run 33953638860](https://github.com/aaa3710/aaa3710.github.io/actions/runs/33953638860) は成功した。

- 新ページ34件＋旧URL25件、計59経路のHTTP 200を本番で確認。HTML転送先・手動リンク、言語、canonical／hreflang／OG、robots指定と全ページのリンクが検証済みローカル出力と一致。
- サイトマップ16件はすべて `/apps/` 配下。Feedbackと旧URLを含まない。robots.txtも一致。
- 廃止済み旧 `focus-map`／旧共通Feedbackの10経路は404。今回未公開のLocationLogger Support／Privacy／Feedback日英6経路も404を維持。
- 本番の旧 `/feedback/tsutawaru-moji/` をブラウザで開き、新 `/apps/feedback/tsutawaru-moji/` への自動移動を確認。英語切替後も `/apps/en/feedback/tsutawaru-moji/` へ到達。390pxで横はみ出しなし、ブラウザ警告・エラー0。
- 実フォームへの埋込・送信リンクは無効のまま。公開メール、フォーム設定、ASCとアプリ配布は変更していない。

今回のURL移行と関連正本の更新は完了。後続の別件の製品公開は、その時点の確定内容・公開許可と別途照合する。

## 関連する正本

各アプリのリンク実装・既存URLテスト・現行公開原稿と、アプリ管理の採用URLを新階層へ更新した。

| 正本           | ローカル保存commit                         | 検証                                          |
| -------------- | ------------------------------------------ | --------------------------------------------- |
| FocusMap       | `703fae2b96bb9ab64384d0879ca5c22e27c87c10` | URLの既存Unit 1/1成功                         |
| Tsutawaru Moji | `1b76347447519d76f9acdacba655609e101f335c` | URLの既存Unit 1/1成功（4言語設定・4用途）     |
| LocationLogger | `b22b5a0311b5ef113d1dc08be44770bd1c96adfe` | URLの既存Unit 6/6成功                         |
| アプリ管理     | `a26a49d`                                  | 本人意思の公開依頼と台帳の採用URLを読戻し照合 |

伝わる文字のSupport／Privacy日英4原稿を上記commitから再同期した。URL以外の公開本文は不変、生成スナップショットと4原稿のSHA照合が成功。

過去の監査・当時の検証URLは履歴として保持する。アプリ本体のソース変更はローカル保存であり、App Storeの入力・再配布とは別。既存binaryの旧リンクは上記の転送で利用を継続できる。
