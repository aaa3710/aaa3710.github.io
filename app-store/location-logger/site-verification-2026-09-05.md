# 道の記録 / LocationLogger 日英サイトのローカル整備

2026-09-05。**ローカル実装。未push・未公開、受付無効。** LocationLogger担当からの明示依頼に基づく。既存アプリの公開証拠を本アプリへ流用しない。

## 名称反映（2026-09-05）

本体確定commit `a850c9e3edff1e2b9c45fc2ba5e71de1e3412a2a` の6原稿を既存同期経路で同期6/6一致を確認した。英語3原稿は前回から不変。

本人の採用名「道の記録」と補足「通った道を地図で見返す」を、日本語の一覧、紹介見出し・metadata、Support／Privacy／Feedback、共通Contactの導線へローカル反映した。先行した[名称調査](/Users/minatosuzuki/work_local/LocationLogger/Docs/2026-09-05-name-review.md)は具体的衝突なしの一次スクリーニングであり、非侵害保証・商標登録可能性・App Store名称確保・リリース承認とは分ける。英語名、URL slug、内部識別子、過去検証の当時値を維持する。公開直前の再検索と最終表示確認は同記録に従う。

横断学習は特定project固有の採用名反映。本人意思の正本は管理のOWNER_INTENT、製品原稿は本体Docs、サイトの生成コピーは既存同期経路を維持する。

名称変更後の検証: 原稿同期6/6、単体17/17、lint・変更sourceのformat・whitespace、静的build（41 prerender / 40 Pages route）、生成検証28/28ページ・80 HTML・944 assertionsが成功。日本語原稿の「名前」節追加で概要が初期表示から閉じる回帰を実ブラウザで発見し、紹介の重複する名前節だけを表示対象から外した後、単体・build・生成検証を再実施して成功。最終画面は日本語紹介・Support・Feedbackを390×844、英語紹介を1440×900で確認し、名称・指定補足・概要初期表示・日英切替・SupportからFeedback導線・受付停止を確認した。横幅超過なし、browser error 0。依存ツールのDEP0205警告は従前どおりで、実VoiceOver・実フォーム・公開は未実施。

## 名称変更前の整備記録と実装範囲

- 本体commit `b7241ea86b357212b78defc38db7bd536846c831` の `Docs/AppStoreMetadata-ja.md` / `-en.md`、`Support-ja.md` / `-en.md`、`PrivacyPolicy-ja.md` / `-en.md` を内容正本とする。サイト側の生成データにはcommit、6原稿の本文とSHA-256を保持し、`scripts/sync-location-logger-copy.mjs` で確定原稿との一致を確認する。旧採用commit `c0532a5` からApp Store原稿2本は不変、Support／Privacy日英4本だけを更新した。
- 本体側の2.5(21)、Feedback追加テスト7/7、iPhone＋同梱Watchの開発署名付きRelease、runtimeWarnings空、日英同梱policyとDocs byte一致はLocationLogger担当から受領した別証拠であり、サイトbuildへ加算しない。これは配布署名・Archive・Validate・実機適合の証拠ではない。正本は本体の `Docs/2026-09-05-build21-feedback-verification.md` と `Docs/2026-09-05-release-risk-audit.md`。
- 日英の紹介・Support・Privacy・Feedback計8routeを追加。一覧から紹介、共通ContactからSupport、Supportから専用Feedbackへ進む。紹介や共通ナビから専用Feedbackへ直結させない。
- 紹介はApp Store原稿、Support／Privacyは各全文を限定Markdown表示する。地図併記、住所表示のApple送信、Shortcutsの現地iPhone本人認証、内部記録のOSバックアップ対象外、アプリ内一括削除操作がない現在境界を日英とも保持する。
- 実画面・地図・位置記録の画像は追加していない。座標、住所、移動履歴、実データ、識別子、認証情報をサイトrepoへ取り込んでいない。
- 専用Feedbackは `noindex, nofollow`。LocationLogger専用の日英フォームURLと受付フラグがすべて検証済みの場合だけ、外部リンクと埋め込みを表示できる。既定ではURL、入力UI、公開メール、App Store URLを出さず、現在送信不可を明記する。

## 全アプリ共通方針の訂正

- 2026-09-05更新の[本人の意思の正本](/Users/minatosuzuki/work_local/アプリ管理/OWNER_INTENT.md)に従い、配信地域はLocationLogger固有ではなく全アプリ共通で日本のみを既定とする。App Store Connect設定、提出、公開は別ゲートのまま。
- アプリごとのFeedbackで不具合・困りごと・要望を受け、設定・メニュー等から容易に開く。入口でアプリと言語を確定し、匿名の自由記述1欄を使う。共通ContactとApp Storeレビューを主な不具合窓口にしない。
- 個別返信を通常運用にせず、既存の安全な処理基盤によるAI半自動整理を将来の運用とする。現在AIは未稼働であり、フォーム受付、AI処理、試験送信は本作業で行わない。
- 有用な報告は概ね1か月以内の改善反映を目標として案内するが、全件採用・全件返信・期限内の修正や公開を保証しない。回答は周期だけを理由に削除せず、法令上の請求や誤送信された機微情報への必要な措置は別に扱う。
- Googleフォーム送信で同意を得たい本人の希望は法的結論と分け、追加チェックを既定にしない。受付開始前に実際の説明・設定・適用要件を管理側で照合する。
- 全アプリのアイコンは100% Codex制作との本人申告を現在方針として扱う。個々の成果物の制作証拠や、具体的な外部素材・権利問題の証拠が出た場合の確認は別に扱う。
- LocationLogger本体のFeedback導線に合わせた正本commit `b7241ea` から6原稿を同期した。Support／Privacyでは、端末内の位置記録を開発者へ送らないことと、利用者が任意に送る報告の取扱いを区別し、専用Feedback／AI整理／別Contactが準備中である現在境界を日英で保持する。

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
- 全アプリ共通方針の訂正後、format、lint、単体14/14、静的build 41route、生成検証28/28ページ・40route・80 HTML・932assertionsを再実施して成功。最初の静的buildはsandbox内のローカル待受制限 `EPERM` だけで停止し、通常権限で同一buildを成功させた。日英生成HTMLに新しい1か月目標・非保証・AI未稼働文が含まれることと、日本語Feedbackのデスクトップ表示を確認した。DOM・style・導線は変更しておらず、実VoiceOverと英語母語話者査読は追加していない。
- 専用接続設定の追加後、format、lint、単体17/17を成功。無効状態では静的build 41route、生成検証28/28ページ・40route・80 HTML・940assertionsを成功し、フォームURLと入力UIが出ないことを確認した。
- 実在しない日英の合成回答者URLを使った有効状態でも、静的build 41route、生成検証28/28ページ・40route・80 HTML・948assertionsを成功。各言語に対応する外部リンクと埋め込みだけが出て、他言語、撮影計算アプリ用Feedback、共通Contactのフォームを流用しないこと、AI稼働未確認表示、位置記録や端末情報を自動添付しない表示を確認した。実Googleフォームへのアクセス・送信は行っていない。
- 最終成果物を受付無効状態へ戻し、日英Feedbackを実ブラウザの390×844とデスクトップ幅で確認した。見出し、長文、言語切替、内部導線、送信不可表示に欠落や横方向の崩れはなく、browser error 0。実VoiceOverと英語母語話者査読は行っていない。
- 本体commit `b7241ea` の6原稿を同期6/6一致。旧採用commitからApp Store原稿日英は不変、Support／Privacy日英4本だけが更新されたことを確認した。単体17/17、静的build 41route、生成検証28/28ページ・40route・80 HTML・944assertionsに成功。日本語Supportと英語PrivacyのContact節を390×844の実ブラウザで確認し、新しい任意報告・位置記録非送信・受付／AI準備中・別Contactの文面に欠落や横方向の崩れはなく、browser error 0だった。

## 公開前に残る条件

- 本体commit `a850c9e3edff1e2b9c45fc2ba5e71de1e3412a2a` とサイト生成データの6原稿を採用する。公開直前にも本体正本の更新有無を確認する。
- 配信地域は全アプリ共通の既定に従い日本のみ。ただし、この記録はApp Store Connect入力、提出、アプリ公開の許可ではない。
- 公開前に日英8routeを初見の読者として再確認し、実Support URLから実際の連絡手段へ容易に到達できる状態を別に完成させる。共通Contactも現在送信不可であり、公開ページがあるだけでは実窓口完成にならない。
- LocationLogger専用Feedbackフォームの作成・設定・受付試験は未実施。日英それぞれの公開回答者URLを確認し、匿名の自由記述1欄、説明、入力上限、下書き自動保存OFF、受付状態を照合するまでは3つのrepository variableを設定しない。
- 実AI整理の稼働は未確認。受付開始時にも稼働中とは表示せず、管理側の隔離処理・実モデル・監査結果が揃った後に別途更新する。
- push、GitHub Pages公開、repository variables、実フォーム、実回答、メール、外部AI、App Store Connect、Apple build/test、Simulator、実機操作は今回行っていない。
