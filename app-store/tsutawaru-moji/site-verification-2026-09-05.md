# 伝わる文字 日英サイトのローカル整備

2026-09-05。**ローカル実装。未push・未公開、受付無効。** 本体担当からの明示依頼に基づく。既存撮影計算サイトの2026-09-04公開証拠を本アプリへ流用しない。

## 正本と実装範囲

- 本体の [公開原稿](/Users/minatosuzuki/work_local/会話用音声文字起こし/Docs/Public/) 4件の最終採用commitは `a112293d335cb855b051bfba2501243057250e18`。初回採用 `ce0e5d1d10e591be2dd6cbd8446f2e9b72d472c4` から、日英Support／Privacyの各1段落末尾だけが変わったことを照合した。18歳未満の保護者許可、13歳未満の音声・個人情報をOpenAIへ送らないこと（成人による録音も同じ）を取り込んだ。本体 `33dfde2b08547a1ee61fe17a0a2ae76ff836da14` は前段build23の証拠であり、最新本体は同意版2・build24へ更新中との担当報告。サイト側で本体の最新検証成立を宣言しない。
- 受付条件: 管理repo `0dfec49f6bcbff649ad893af2f3a3c80832dc816` の [専用Form準備](/Users/minatosuzuki/work_local/アプリ管理/feedback/tsutawaru-moji-form-preparation.md) と [配布台帳](/Users/minatosuzuki/work_local/アプリ管理/publishing/tsutawaru-moji-app-store.md)。原文90日保持は未採用案で、公開本文へ入れない。
- 製品内容の正本は本体に維持。`scripts/sync-tsutawaru-copy.mjs` は指定commitの4原稿だけを読み、管理コメントを除いた `lib/tsutawaru-public.generated.json` とsource hashを生成する。手修正しない。通常buildは兄弟repoにも外部サイトにも原稿取得を依存しない。
- 日英8routeを同じcomponentで実装。紹介は実装済み機能に絞り、Support／PrivacyはHTMLを実行しない限定Markdown表示で全本文を保持。見出しごとに開ける。旧build8画像、架空Storeリンク、公開メール、実Google Formは追加していない。
- 一覧から紹介へ、共通Contactから本アプリSupportへ、Supportから専用Feedbackへ接続。ヘッダー／フッター／紹介／Contactから専用Feedbackへ直結させない。
- Feedbackは環境変数による有効化経路を持たない。Focus専用 `NEXT_PUBLIC_APP_FEEDBACK_READY` や共通Contact設定を流用しない。1欄自由記述・署名不要・原則返信なしの予定と、現在送信不可を区別する。
- Contactは共通窓口を維持。本文必須・返信先任意、Feedback AI分類／開発課題と分離、通常返信非保証と法定請求対応を分ける。新たな窓口や私用連絡先を増やさない。

## 予定URL（この記録は公開済み証拠ではない）

originは `https://aaa3710.github.io`。以下の日本語pathと、先頭に `/en` を付けた英語pathを本体担当と合意済み。

| 用途        | 日本語path                  | English path                   |
| ----------- | --------------------------- | ------------------------------ |
| 紹介        | `/apps/tsutawaru-moji/`     | `/en/apps/tsutawaru-moji/`     |
| Support     | `/support/tsutawaru-moji/`  | `/en/support/tsutawaru-moji/`  |
| Privacy     | `/privacy/tsutawaru-moji/`  | `/en/privacy/tsutawaru-moji/`  |
| Feedback    | `/feedback/tsutawaru-moji/` | `/en/feedback/tsutawaru-moji/` |
| 共通Contact | `/contact/`                 | `/en/contact/`                 |

紹介／Support／Privacyの6URLをsitemapへ追加し、全体は16URL。専用Feedbackは `noindex, nofollow`、canonical／hreflang／sitemapから除外する。言語切替は同用途の対になるページへ進む。

## ローカル検証

検証buildのoriginは上記、既存Feedback／Contactの両フラグは文字列 `false`、公開メールは空。本記録のHTTP成功は `127.0.0.1` 上の生成物に対するもの。

- 単体12/12成功、失敗・skip 0。設定6件と原稿・リンク・無効境界6件。初回と表示修正後の2実行とも同じ12件であり24種類とは数えない。
- format check、lint、差分whitespace検査成功。最初のsitemap追加に閉じ括弧不足があり、format／lintが検出したため修正した。
- 静的build: 初回はローカルlistenがsandboxでEPERM、許可された環境で成功。目視修正後も成功。NodeのDEP0205警告は依存ツール由来で、ブラウザ例外とは別。
- 静的検証: 最終20/20必須ページ、生成route34、HTML68、697assertions成功。新規8ページの言語・SEO・送信不可・画像／秘密・旧名／他app混入・内部リンク・Contact経由を検査。最初のbuild失敗直後に検証を呼んだ1回は生成物未完成のためENOENTで中断し、成功数へ含めない。
- 4原稿のcommit固定再生成比較が一致。先頭管理コメント、未解決placeholder、90日保持の確約が本文にないことを検査。
- 最終の子どもの情報補足は、4原稿各1行の置換だけであることを確認し、採用commitを `a112293` へ更新。限定単体1/1（失敗・skip 0）、生成本文4/4一致、390pxで該当4段落を実際に開いて日英の表示・全文・横幅を確認し、4画像も目視した。全24条件は再実施していない。取り込み後の静的再生成も成功し、この作業のbuild合計は成功3・sandbox待受失敗1。補助本文検査1回はReactの通常HTMLコメントまで拒否して誤検出したため、管理メモ固有文字列の検査へ修正し4/4成功した（サイト修正なし）。
- ブラウザ: 一覧／紹介／Support／Privacy／Feedback／Contact × 日英 × 390px／1440px = 24条件。初回と表示修正後の2batchで24条件ずつ成功。最終batchの全pageがHTTP200、正しいhtml言語、h1一つ、横はみ出し0、破損画像0、入力UI0、ページ例外0、外部向け自動リクエスト0。
- 実クリックは日英のContact → Support → 専用Feedbackを確認し、Feedbackの日英相互切替、共通Contactへの帰還、Privacyへの移動も確認（リンク8操作）。PrivacyのOpenAI節はクリックでopen=true、Enterでopen=falseを実測。実VoiceOver読み上げや翻訳者査読の証拠ではない。
- 画像を初見の読者として別工程で確認。原稿リストの番号／黒丸がTailwindの共通resetで消える、h1の局所サイズが後続CSSに上書きされる、段落間隔がない、一覧説明が撮影計算1例に固定される、の4点を対象範囲内で修正。日英の意味、未配信／未受付、費用の主体、端末内と外部処理、画像を使わない境界を照合。第三者・英語母語話者の査読ではない。
- ブラウザ補助実行: wrapperのregistry取得が制限されたため新規installせず既存CLIを使用。最初の検査補助が `require is not defined` で止まり、不要なNodeファイルAPIを除去後に実行。初回作業sessionは後続時点で利用不能だったため、新しい作業sessionで最終24条件を実施。これらをページ自体の不具合やApple runtime failureへ混ぜない。
- 画面画像は `output/playwright/tsutawaru-2026-09-05/` にローカル保持、Git対象外。実データ、認証、Forms回答を使用していない。

## 公開・受付前に残る判断

サイトpush／公開の明示許可、原稿の公開前一次資料照合、本体の実機・実API・BYOK／Privacy／暗号輸出等の最終判定は別ゲート。Store配信操作の許可は得ていない。

受付には、専用日英Formの新規作成許可と実設定、保持期間・削除・Google国外処理の事前情報、共通Contactの公表事項・返信元・必要な請求対応を確定する必要がある。90日案や同意checkboxを勝手に採用しない。個人Googleアカウントであること、外部連携履歴なしは確認済み事項として再質問しない。作成、synthetic送信・受信・削除、受付開始は今回行わず、ready通知前に有効化しない。

今回のApple lane 0、xcodebuild 0、xcrun 0、Apple test 0、Apple build 0、fresh 0、Apple retry 0、Apple failure 0、status64 0、status69 0、Apple起動失敗0、host終了0、Apple assertion／crash検出0。Apple実行由来の新規IPSは0（実行なし）で、Mac全体のIPS増減は未調査。Simulator 0、物理端末0、実API0、実Form0、実回答0、メール0、外部AI0、ASC操作0、push0、公開0。本体／管理側テストは加算していない。

## 横断学習の扱い

「特定project固有」および「既存正本に包含」。共通README「関連projectとの責任境界」、説明・学習・透明性設計の段階的開示、品質・検証・完成条件の日英・証拠分離へ戻した。新規の全アプリ規則は追加しない。今回の具体的な再発防止はcommit指定取込・コメント除去・許可リンクと未登録Formの拒否テスト、`npm test` と `verify:pages` からの到達、最終ブラウザ目視で閉じる。
