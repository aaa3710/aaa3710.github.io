# LocationLogger 日英サイトのローカル整備

2026-09-05。**ローカル実装。未push・未公開、受付無効。** LocationLogger担当からの明示依頼に基づく。既存アプリの公開証拠を本アプリへ流用しない。

## 正本と実装範囲

- 本体commit `c0532a568e760eb98f87a5aeceb28770ea795789` の `Docs/AppStoreMetadata-ja.md` / `-en.md`、`Support-ja.md` / `-en.md`、`PrivacyPolicy-ja.md` / `-en.md` を内容正本とする。サイト側の生成データにはcommit、6原稿の本文とSHA-256を保持し、`scripts/sync-location-logger-copy.mjs` で確定原稿との一致を確認する。
- 本体側の2.4(20)、XCTest 177/177、iPhone＋同梱Watch Release、runtimeWarnings空、日英同梱policyとDocs byte一致はLocationLogger担当から受領した別証拠であり、サイトbuildへ加算しない。監査正本は本体の `Docs/2026-09-05-release-risk-audit.md`。
- 日英の紹介・Support・Privacy・Feedback計8routeを追加。一覧から紹介、共通ContactからSupport、Supportから専用Feedbackへ進む。紹介や共通ナビから専用Feedbackへ直結させない。
- 紹介はApp Store原稿、Support／Privacyは各全文を限定Markdown表示する。地図併記、住所表示のApple送信、Shortcutsの現地iPhone本人認証、内部記録のOSバックアップ対象外、アプリ内一括削除操作がない現在境界を日英とも保持する。
- 実画面・地図・位置記録の画像は追加していない。座標、住所、移動履歴、実データ、識別子、認証情報をサイトrepoへ取り込んでいない。
- 専用Feedbackは `noindex, nofollow`。フォームURL、入力UI、公開メール、App Store URL、環境変数による有効化経路を持たず、現在送信不可を明記する。

## 予定URL

originは `https://aaa3710.github.io`。本作業では公開していない。

| 用途        | 日本語path                   | English path                    |
| ----------- | ---------------------------- | ------------------------------- |
| 紹介        | `/apps/location-logger/`     | `/en/apps/location-logger/`     |
| Support     | `/support/location-logger/`  | `/en/support/location-logger/`  |
| Privacy     | `/privacy/location-logger/`  | `/en/privacy/location-logger/`  |
| Feedback    | `/feedback/location-logger/` | `/en/feedback/location-logger/` |
| 共通Contact | `/contact/`                  | `/en/contact/`                  |

紹介／Support／Privacyの6URLだけをsitemapへ追加し、全体は22URL。専用Feedbackはcanonical／hreflang／sitemapから除外する。

## ローカル検証

- 原稿同期6/6一致。単体14/14成功、失敗・skip 0。LocationLogger固有では、4つのprivacy/support境界、6原稿の構文・hash、フォーム未接続を回帰確認。
- format、lint、差分whitespace検査成功。
- 受付変数・公開メールを未設定にした静的build成功。41routeをprerenderし、GitHub Pages用40routeを生成。NodeのDEP0205警告は依存ツール由来で、ページ例外とは分ける。
- 生成検証は28/28必須ページ、40公開route、HTML 80ファイル、932assertions成功。sitemap 22URL、日英言語、canonical／hreflang、内部リンク、Feedbackのnoindex／nofollowと入力UI・フォームURL不在を確認。
- 実ブラウザでは日本語紹介390×844、日英Supportの言語切替、英語Support 1440×900、英語Privacy、日本語Feedback 390×844を確認。h1、日英本文、開閉項目、横幅、送信不可表示を確認し、browser error 0。実VoiceOverや英語母語話者査読ではない。

## 公開前に残る条件

- 本体commit `c0532a5` とサイト生成データの6原稿は照合済み。公開直前に本体正本が更新されていないか再確認する。
- 初回配信予定地域はLocationLogger固有に日本のみと本人意思の正本へ反映済み。ただし、この記録はApp Store Connect入力、提出、アプリ公開の許可ではない。
- 公開前に日英8routeを初見の読者として再確認し、実Support URLから実際の連絡手段へ容易に到達できる状態を別に完成させる。共通Contactも現在送信不可であり、公開ページがあるだけでは実窓口完成にならない。
- LocationLogger専用Feedbackフォームの作成・設定・受付試験は未実施。現在の案内を、フォーム受付済み・返信可能として表示しない。
- push、GitHub Pages公開、repository variables、実フォーム、実回答、メール、外部AI、App Store Connect、Apple build/test、Simulator、実機操作は今回行っていない。
