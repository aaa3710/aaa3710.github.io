# Apps website

アプリの公開・運営に関する希望、個人情報の公開範囲、公開用メールの方針は[本人の意思の正本](/Users/minatosuzuki/work_local/アプリ管理/OWNER_INTENT.md)に集約しています。 判断前・新しい意思を受けた時・作業終了前の扱いは[参照・更新手順](/Users/minatosuzuki/work_local/アプリ開発共通事項/スキル/app-design-philosophy/SKILL.md#本人の意思を参照更新する)を使います。

個人制作アプリを一覧から見つけ、内容を誤解せずに詳しい紹介やApp Storeへ進めるための日英対応サイトです。`撮影のものさし`（英語: `Photo Yardstick`）は最初の詳しい紹介例ですが、`/apps/` の一覧は全アプリを同じ規則で案内します。

命名相談・公開準備は共通の [app-design-philosophy](/Users/minatosuzuki/work_local/アプリ開発共通事項/スキル/app-design-philosophy/SKILL.md) と [命名節「名前は、単独で用途と価値を伝える」](/Users/minatosuzuki/work_local/アプリ開発共通事項/思想/アプリ設計全体思想.md#名前は単独で用途と価値を伝える) を入口にします。製品metadataの内容正本は個別アプリ側に置き、このrepoは公開サイトと日英URLを保守します。

## 現在のサイト構成

- 全アプリを同じ大きさで案内する `/apps/` の一覧と、`撮影のものさし`の詳細ページ
- 日本語・英語
- プライバシーポリシー
- サポートと計算の前提
- 業務・運営・プライバシー請求・その他のための共通Contactと、個別アプリ／Supportから開くアプリ専用Feedback
- ほかのアプリの準備中ページ
- 検索向けのサイトマップ、robots.txt、共有用画像
- GitHub Pages向けの自動公開設定

旧名が写る4画面のWeb用実画像は、加工せずファイルを保持し、現在のサイトUIには表示しません。改名後の実画面への差し替えは公開前確認に残します。

一般向け文面は、機能名や開発工程ではなく、使う場面と得られる変化から始めます。専門的な計算や限界は省かず、必要になった人が詳しいページで確認できる順序にします。変更後は日本語・英語とスマートフォン・デスクトップを初見の読者として再確認します。

## ローカル確認

### 伝わる文字のローカル準備（未公開）

日英の紹介・Support・Privacy・専用Feedbackを追加し、一覧と共通Contactから接続しています。App Store未配信・受付準備中を明記し、実フォーム、公開メール、旧buildの画像は追加していません。`NEXT_PUBLIC_APP_FEEDBACK_READY` は既存の撮影計算アプリ用で、伝わる文字には流用しません。伝わる文字はフォーム未登録で、環境変数による有効化経路もありません。

製品本文の正本は本体 `Docs/Public/` です。確定commit `0350e3df114f3672442545f58ee89cb9553d7695` の4原稿を、管理コメントを除いた出典付き生成データとして保持します。本文をサイト側だけで修正せず、本体で確定後に次の明示操作で同期してください。ビルドは兄弟repoやネットワークから原稿を取得しません。

```bash
node --experimental-strip-types scripts/sync-tsutawaru-copy.mjs \
  '/Users/minatosuzuki/work_local/会話用音声文字起こし' \
  0350e3df114f3672442545f58ee89cb9553d7695 --check
```

更新時は採用commitを指定し、`--check` を外して生成します。管理側の受付条件は `0dfec49f6bcbff649ad893af2f3a3c80832dc816` を参照し、90日保持案は未採用のままです。[予定URL・検証・公開前条件](app-store/tsutawaru-moji/site-verification-2026-09-05.md)を参照してください。以下の既存サイト公開記録を、新規ページの公開証拠として扱わないでください。

### 開発サーバー

```bash
npm install
npm run dev
```

## 検証

```bash
npm run format -- --check
npm run lint
npm test
npm run build:pages
npm run verify:pages
```

GitHub Pagesでは、ログイン後に確認するアカウント名の `<アカウント名>.github.io` リポジトリを使い、`dist/client/` の静的ファイルをGitHub Actionsから公開します。全アプリのページは `/apps/` 配下に置き、共有アセットとrobots.txt／sitemap.xmlは大元に残します。

## 問い合わせ経路と公開設定

実Googleフォーム4件の改修・設定照合は完了していません。既定ではFeedback／Contactとも埋め込みと外部フォームリンクを表示せず、「準備中のため現在は送信できない」ことを日本語・英語で明示します。フォーム経由の受付・返信が可能になったとは扱いません。部分的な準備状況は [PROJECT_CONTEXT](PROJECT_CONTEXT.md#このサイト変更の外部ゲート) を参照します。

必須同意チェックボックスは保守的な提案であり、未採用です。専用Feedbackの自由記述1欄を標準として維持し、追加同意の採否未決定と実フォーム未確認を含め、受付フラグは `false`（未設定）のままにします。AIによる処理の現在状態は管理側の実証照合待ちで、稼働中とも未運用とも断定しません。受付無効時のサイトにはAIの将来利用文も表示しません。

有効化後のアプリ専用Feedbackは匿名のGoogleフォームです。アプリと言語は入口で確定し、カテゴリ、端末、OSを尋ねず、大きな自由記述1欄だけにします。原則として個別返信は行わず、個人情報、秘密、パスワードや認証コード、URLを送らないよう案内します。個別アプリとそのSupportから到達できますが、サイトマップへは載せず `noindex, nofollow` を指定します。Google側の技術情報処理と回答保持の説明、匿名のため個別の回答を特定できない場合があることも専用ページで明示します。返信を伴うプライバシー請求は共通Contactへ統合し、別窓口は増やしません。

共通Contactは業務・運営・プライバシー請求・その他の連絡用です。アプリの不具合・要望は受け付けず、各アプリのSupportを経由して専用Feedbackへ案内します。有効化後は本文を必須、返信を希望する人の連絡先だけ任意とし、本文と任意の連絡先は対応・返信のためだけに使い、不要になった時点で削除する方針を示します。業務等の任意問い合わせへの返信は保証しませんが、法令に基づくプライバシー権利請求は適用法令に従って対応します。不要な個人情報、秘密、パスワード、認証コード、非公開共有リンクは禁止し、用件に必要な公開ページURLは許容します。匿名・URL禁止のFeedbackとは利用目的、入力制限、返信の扱いを分けます。Googleフォームの公開用回答者URLだけを `lib/feedback.ts` で管理し、フォーム編集URL、回答本文、認証情報はGitへ保存しません。

| GitHub Actionsのrepository variable | ビルド時の環境変数               | 有効化条件                                                                                  |
| ----------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------- |
| `APP_FEEDBACK_READY`                | `NEXT_PUBLIC_APP_FEEDBACK_READY` | 日本語・英語両方の専用Feedbackを実編集し、質問項目・説明・設定を照合した後だけ文字列 `true` |
| `CONTACT_READY`                     | `NEXT_PUBLIC_CONTACT_READY`      | 日本語・英語両方のContactを実編集し、質問項目・説明・設定を照合した後だけ文字列 `true`      |
| `PUBLIC_SUPPORT_EMAIL`              | `NEXT_PUBLIC_SUPPORT_EMAIL`      | 採用が決まった共通公開サポートメールの実値を設定した場合だけ表示                            |

受付フラグは `lib/feedback.ts` で文字列 `true` と厳密比較します。未設定やそれ以外の値では無効のままです。追加同意の採否とAI処理の実証照合を含む説明・設定の確定、Googleフォーム4件（Feedback／Contact各日英）の実編集、回答者の下書き自動保存の無効化、両窓口で異なる入力制限・返信契約の日英照合、受付フラグ有効化は、まとめてサイトのローカル実装とは別の外部ゲートです。

送信ボタンを押していなければ開発者へ回答としては届きませんが、Googleの下書き保存や通常のWeb処理は別です。Googleアカウントでログイン中の回答途中データは、設定によって30日間下書き保存されるため、「閉じれば一切送信されない」とは説明しません。[Google公式の下書き自動保存の説明](https://support.google.com/docs/answer/10952360?hl=en)（2026-09-04確認）

公開サポートメールは必須と断定せず、採用して実値を設定した場合だけSupportへ表示します。未設定時に仮アドレスや準備中表示は出しません。App Store提出前には、Support URLから容易に実際の連絡手段へ進めるかを改めて確認します。

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

大元 `/` と `/en/` は当面アプリ一覧へ案内します。公開済みの旧URL25件は、固定の新URLへの即時HTML転送と手動リンクを持ち、`noindex, nofollow` とします。HTTP 301ではありません。廃止済みの `focus-map` と旧共通Feedbackは復活させません。転送は `build:pages` の出力に生成するため、確認は開発サーバーではなく `dist/client/` の静的サーバーで行います。

原稿の内容正本は各アプリ、公開URLと移行の検証記録は[URL移行記録](app-store/url-migration-2026-09-05.md)で管理します。過去の公開検証記録は当時の証拠として保持します。

## 公開URL

以下は共通階層への移行後の公開済みURLです。公開・転送の検証結果は[移行記録](app-store/url-migration-2026-09-05.md)を参照します。旧 `focus-map` と旧共通Feedbackは引き続き404とします。

| 用途      | 日本語                                                               | English                                                                 |
| --------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Marketing | `https://aaa3710.github.io/apps/focus-exposure-calculator/`          | `https://aaa3710.github.io/apps/en/focus-exposure-calculator/`          |
| Support   | `https://aaa3710.github.io/apps/support/focus-exposure-calculator/`  | `https://aaa3710.github.io/apps/en/support/focus-exposure-calculator/`  |
| Privacy   | `https://aaa3710.github.io/apps/privacy/focus-exposure-calculator/`  | `https://aaa3710.github.io/apps/en/privacy/focus-exposure-calculator/`  |
| Feedback  | `https://aaa3710.github.io/apps/feedback/focus-exposure-calculator/` | `https://aaa3710.github.io/apps/en/feedback/focus-exposure-calculator/` |
| Contact   | `https://aaa3710.github.io/apps/contact/`                            | `https://aaa3710.github.io/apps/en/contact/`                            |
