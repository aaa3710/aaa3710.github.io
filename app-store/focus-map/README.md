# ピントと光 — 撮影計算 / Focus & Light — Photo Tools: App Store公開準備

本人の意思は[本人の意思の正本](/Users/minatosuzuki/work_local/アプリ管理/OWNER_INTENT.md)を参照する。公開用メールの現在方針は同正本に従い、過去の採否未定・任意提案を現在の本人判断にしない。

このフォルダは、App Storeの公開表現・表示構成・素材計画を認知担当が整える入口です。公開URL、画像の状態、App Previewの撮影計画と既存正本を参照します。製品メタデータの既存正本は個別アプリ側の [AppStoreMetadata.ja-en.md](/Users/minatosuzuki/work_local/被写界深度計算ツール/Docs/Release/AppStoreMetadata.ja-en.md) に保持し、独立した入力原稿を二重に作りません。保存場所と編集担当を区別し、正本の変更前には [READMEの連携手順](../../README.md) でactive編集との競合を確認します。名称の決定、提出の採用値・外部gateは管理台帳を参照します。

制作背景はアプリ管理側の `app_profiles/focus-map.md`、機能と画面は内部名Focus Mapのアプリ側にある現行仕様を参照します。公開文面は利用場面から始め、専門用語と開発工程を初見の入口へ置きません。ディレクトリ名、Bundle ID、素材名、過去のcommit記述は履歴と実装の識別子なので、公開名に合わせて一括置換しません。

## 現在の状態

- App Storeの公開名は、日本語 `ピントと光 — 撮影計算`、英語 `Focus & Light — Photo Tools` に確定。採用サブタイトルは日本語 `被写界深度と露出をすばやく確認`、英語 `Depth of Field & Exposure`、プロモーション用テキストは両言語とも空欄。認知側の `metadata.*.md` は正本参照と採用値の照合用抜粋だけにする。
- 日本語4枚・英語4枚のスクリーンショットは、Focus Mapの素材実装基準コミット`7ec79a1f906195bea31940fbbfdd321f24ca40b8`にあるDebug fixtureから2026-08-31に再撮影済み。8枚とも当時の形式検査と独立した全数原寸目視に合格した。旧名当時の証拠であり、改名後の最終binaryと照合済みの提出素材とは扱わない。
- 日本語25.5秒・英語24.5秒のApp Preview候補も、同じ旧名当時のSimulator画面から実録画・検査済み。初回提出は静止画だけとし、動画候補は履歴として保持する。
- Web用の旧名4画面はサイトUIから非表示とし、ファイルは無加工で保持する。改名後の実画面への差し替えは公開前確認に残す。
- 新公開名とslugに対応したプライバシー、セルフサポート、専用Feedback、共通Contactをサイト側で更新し、2026-09-04にGitHub Pagesへ公開済み。新しい日英URLの表示と旧URLの転送なし404を確認した。実フォームの受付有効化は別の未完了ゲート。
- アプリの不具合・困りごと・要望は各Supportを経由して専用Feedbackへ案内し、業務・運営・プライバシー請求・その他の返信が必要な連絡は共通Contactへ分離する。返信を伴うプライバシー請求のために新窓口は増やさない。専用Feedbackは匿名、入口でアプリと言語を確定し、大きな自由記述1欄だけにする。個別返信を通常運用にせず、有用な報告は概ね1か月以内に改善へ反映することを目標とするが、全件採用・期限内の修正や公開を保証しない。
- Contactでは業務等の任意問い合わせへの返信を保証しない一方、法令に基づくプライバシー権利請求は適用法令に従って対応する。不要な個人情報、秘密、パスワード、認証コード、非公開共有リンクは禁止し、用件に必要な公開ページURLは許容する。専用Feedbackは匿名・URL禁止を維持する。
- 実Googleフォーム4件の改修・設定照合は未完了。Feedback／Contactは既定で準備中とし、埋め込み・外部フォームリンクを出さず、現在は送信できないことを日英で明記する。フォーム経由の受付・返信可能は未完了。部分的な準備状況は [PROJECT_CONTEXT](../../PROJECT_CONTEXT.md#このサイト変更の外部ゲート) を参照する。
- 専用Feedbackの自由記述1欄を標準とし、必須同意チェックボックス案は未採用。Googleフォーム送信で同意を得たい本人の希望と法的結論を分け、実フォームの説明・設定・適用要件を照合するまで受付フラグは `false`（未設定）に保つ。AIによる半自動整理は現在未稼働で、稼働中とは表示しない。回答は周期だけを理由に削除しないが、法令上の請求や誤送信された機微情報への必要な措置は別に扱う。
- Supportはセルフヘルプ、専用Feedback、採用時だけ表示する共通公開サポートメールで構成する。公開メールの方針は[本人の意思の正本](/Users/minatosuzuki/work_local/アプリ管理/OWNER_INTENT.md)に従う。実値は未設定で、仮の連絡先は公開しない。
- 価格は0円、初回配布地域は日本のみ、Bundle IDは`com.minatosuzuki.FocusMap`のままとする。
- 公開日は未確定。App Store Connectへの最終入力・提出は所有者が手動で行う。
- App Store Connectへの素材登録、配布用署名、Validate App、TestFlight、提出は未実施。

2026-08-31の素材は、iPhone 17 Pro Max Simulatorで表示した当時のUIの証拠です。改名後の最終binary、物理的実寸、実指操作、実機のVoiceOver・触覚・片手操作、署名済み候補、TestFlight、App Store配布の証拠ではありません。

## App Storeとアプリへ渡すURL

公開slugは `focus-exposure-calculator` です。旧 `focus-map` URLはリダイレクトなしの404を確認済みです。App Store Connectへの入力は別の許可後に各ローカリゼーションのMarketing／Support／Privacy URLを使い、アプリ内Feedbackも同じ言語のURLを使います。

2026-09-05の共通階層への移行に合わせ、公開済みの採用URLを下表へ更新しました。新旧URLの本番検証は[移行記録](../url-migration-2026-09-05.md)を参照します。

| 用途                 | 日本語                                                               | English                                                                 |
| -------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Marketing URL        | `https://aaa3710.github.io/apps/focus-exposure-calculator/`          | `https://aaa3710.github.io/apps/en/focus-exposure-calculator/`          |
| Support URL          | `https://aaa3710.github.io/apps/support/focus-exposure-calculator/`  | `https://aaa3710.github.io/apps/en/support/focus-exposure-calculator/`  |
| Privacy Policy URL   | `https://aaa3710.github.io/apps/privacy/focus-exposure-calculator/`  | `https://aaa3710.github.io/apps/en/privacy/focus-exposure-calculator/`  |
| アプリ内Feedback URL | `https://aaa3710.github.io/apps/feedback/focus-exposure-calculator/` | `https://aaa3710.github.io/apps/en/feedback/focus-exposure-calculator/` |

共通Contactは `https://aaa3710.github.io/apps/contact/` と `https://aaa3710.github.io/apps/en/contact/` です。業務・運営・プライバシー請求・その他に使い、アプリの不具合・要望の送信先としてApp Storeやアプリへ設定しません。Contactからの不具合・要望は各Supportを経由して専用Feedbackへ案内します。

## この変更の外部ゲート

- 公開用メールは[本人の意思の正本](/Users/minatosuzuki/work_local/アプリ管理/OWNER_INTENT.md)に従い、管理側で必要性が確認された場合だけ具体化する。提出前のSupport URLの実連絡導線確認は別に行う。
- 追加同意の採否とAI処理の実証照合を含めて説明・設定を確定し、既存のGoogleフォーム4件を実編集する。回答者下書き自動保存をすべて無効化し、各用途の日英両フォームの質問項目・入力制限・返信契約・説明・設定を照合した後、対応する受付フラグを有効化する。専用Feedbackは自由記述1欄のみを標準、共通Contactは本文必須・返信希望者の連絡先のみ任意とし、両者の利用目的とプライバシー説明を分ける。GitHub Actionsのrepository variables `APP_FEEDBACK_READY` / `CONTACT_READY` がそれぞれ `NEXT_PUBLIC_APP_FEEDBACK_READY` / `NEXT_PUBLIC_CONTACT_READY` へ渡り、文字列 `true` の場合だけ埋め込みと外部フォームリンクを表示する。
- GitHubへpushした後、上記の日英URLが表示できること、canonical／hreflang／内部リンクが揃うこと、旧slugが存在しないことを確認する。

初回配布は日本だけとする。将来EUでtraderとして配布する場合は、Appleの要件に従ってメール、電話番号、住所または私書箱等を別途登録・表示する必要があるが、現時点では住所・電話番号を公開しない。

共通公開サポートメールを採用する場合は、GitHub Actionsのrepository variable `PUBLIC_SUPPORT_EMAIL` を `NEXT_PUBLIC_SUPPORT_EMAIL` へ渡す。メールと受付フラグの未設定を、実連絡導線の完成として扱わない。

送信ボタン未押下なら開発者へ回答として届かないが、Googleの下書き保存・通常Web処理は別である。ログイン時の未送信下書きは設定によって30日保存されるため、「閉じれば一切送信されない」とは説明しない。根拠は [Google公式の下書き自動保存の説明](https://support.google.com/docs/answer/10952360?hl=en)（2026-09-04確認）。

## ファイル

- `metadata.ja.md`: 日本語metadata正本への参照と採用値の照合用抜粋
- `metadata.en.md`: 英語metadata正本への参照と採用値の照合用抜粋
- `screenshots.md`: 2026-08-31の8枚の順序、形式、独立確認、証拠境界
- `app-preview.md`: 旧名当時の日英実録画候補、技術条件、採否判断
- `release-checklist.md`: App Store Connectへ進む前の残作業
- [site-verification-2026-09-04.md](site-verification-2026-09-04.md): 公開名・導線・受付無効状態のローカル検証と証拠境界

## 素材の所在

実素材の正本はFocus Map側に置き、このリポジトリへ複製しません。

- スクリーンショット: `Docs/Release/AppStoreSubmission/Screenshots/{ja,en}/`
- App Preview候補: `Docs/Release/AppStoreSubmission/AppPreviews/{ja,en}/`
- 2026-08-31の素材監査: `Docs/Release/2026-08-31-app-store-assets-audit.md`
- 素材実装基準コミット: `7ec79a1f906195bea31940fbbfdd321f24ca40b8`

上記はいずれも `/Users/minatosuzuki/work_local/被写界深度計算ツール/` を基準にしたpathです。素材の現在の採否は個別アプリ側の正本を確認し、過去のhashを改名後の提出素材の証拠へ流用しません。後続の文書更新commitを含む現在のHEADは固定番号から推定せず、live Git状態と最新監査を照合します。
