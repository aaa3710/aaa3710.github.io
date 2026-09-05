# App Store公開前チェックリスト

本人の意思は[本人の意思の正本](/Users/minatosuzuki/work_local/アプリ管理/OWNER_INTENT.md)を参照する。公開用メールの現在方針は同正本に従い、過去の採否未定・任意提案を現在の本人判断にしない。

## サイトと連絡先

**再開許可受領（2026-09-04）:** 記録のみの保留後、所有者が既存サイト本番反映と4フォーム変更を明示許可。サイトのpush／Pages公開／受付変数はアプリ認知、実フォーム編集はアプリ管理が担当する。両受付無効・公開メール未設定で先行公開し、用途別の日英フォーム実検証完了通知後だけ該当受付を有効化する。App Store操作、AI／scheduler有効化、新規メール・個人連絡先公開へ許可を広げない。

実Googleフォーム4件の改修・設定照合は完了していません。既定では埋め込み・外部フォームリンクを表示せず、Feedback／Contactが準備中で送信できないことを日英で明記します。以下のサイト構成・方針の完了は、実際の受付や返信可能を意味しません。部分的な準備状況は [PROJECT_CONTEXT](../../PROJECT_CONTEXT.md#このサイト変更の外部ゲート) を参照します。

必須同意チェックボックス案は未採用で、専用Feedbackの自由記述1欄を標準として維持します。Googleフォーム送信で同意を得たい本人の希望と法的結論を分け、実フォームの説明・設定・適用要件とAI処理の実状態を照合するまで受付フラグは `false`（未設定）を維持します。AIによる半自動整理は現在未稼働で、稼働中とは表示しません。

Contactでは業務等の任意問い合わせの返信非保証と、法令に基づくプライバシー権利請求への適用法令に従う対応を区別します。不要な個人情報、秘密、パスワード、認証コード、非公開共有リンクは禁止し、用件に必要な公開ページURLは許容します。専用Feedbackは匿名・URL禁止のままです。

開発者メールのWeb非掲載は、返信相手への送信元アドレス・表示名・Reply-Toの非開示を保証しません。公開メールは未設定、返信用送信元は未確定です。今回のサイト・フォーム反映許可に、実メールの返信・試験送信・新規メール作成は含まれません。実返信が必要な時の送信元判断は親タスクへ集約し、新規メール作成を必須条件にはしません。

- [x] `ピントと光 — 撮影計算` / `Focus & Light — Photo Tools` の日本語・英語ページを、新slug `focus-exposure-calculator` で構成
- [x] 日本語・英語のPrivacy Policy URLを新slugへ統一
- [x] Supportをセルフヘルプ、専用Feedback、採用時だけ表示する共通公開サポートメールの位置で構成
- [x] 業務・運営・プライバシー請求・その他の共通Contactと、アプリ不具合・要望の専用Feedbackを分離する方針を確定
- [x] 返信を伴うプライバシー請求は共通Contactへ統合し、新窓口は増やさない。Contactから不具合・要望は各Supportを経由して専用Feedbackへ案内
- [x] 専用Feedbackを匿名・自由記述1欄とし、アプリ／言語／カテゴリ／端末／OSの再入力をなくす。個別返信を通常運用にせず、有用な報告は概ね1か月以内の改善反映を目標とするが、全件採用・全件返信・期限内の修正や公開を保証しない方針を確定
- [ ] Googleフォーム送信で同意を得たい本人の希望と法的結論を分け、実際の説明・設定・適用要件とAI処理の実状態を照合する。Feedback／Contactの実Googleフォーム4件を編集して回答者下書き自動保存をすべて無効化し、各用途の日英両フォームの質問・説明・必須／任意・情報収集等の設定、異なる入力制限（FeedbackはURL禁止／Contactは必要な公開ページURLを許容）と返信契約を照合後、repository variables `APP_FEEDBACK_READY` / `CONTACT_READY` を文字列 `true` にして有効化
- [ ] [本人の意思の正本](/Users/minatosuzuki/work_local/アプリ管理/OWNER_INTENT.md)に従う管理側の必要性確認を受領する。不要ならメール作成の残件を閉じ、必要な場合だけ具体化する
- [ ] 再開後、4フォームの実設定（メール収集、ログイン要否、公開回答概要、共同編集権限、回答者下書き自動保存等）を確認し、周期削除を既定にしない保持方針、機微情報の誤送信対応、AI処理、同意方式、Privacy／App Privacyの説明と一致させる
- [ ] 日英Supportから該当Feedback／共通Contactへ到達し、管理担当が最小限の合成入力でフォーム送信 → 所有者の受信・通知 → 試験回答の削除を確認する。これは合成試験データだけを消す受付経路の証拠であり、通常回答の周期削除や返信手段の確認とは分ける
- [ ] Contactの必要な返信・法定請求対応の手段を、実メールを送らずに確認する。実返信が必要になった場合は、親タスクを通じた所有者の送信元判断と、相手に見えるアドレス・表示名・Reply-Toを踏まえた別途の送信許可を得るまで、返信・試験送信を行わない
- [x] 2026-09-04、`107f949`をGitHubへpushしPages公開成功。新しい日英Marketing／Support／Privacy／Feedback／Contact URLと旧slug・旧共通Feedbackの転送なし404を確認（実受付は無効のまま）
- [ ] 確認済みの公開URLをApp Store ConnectのMarketing URL / Privacy Policy URL / Support URLへ入力
- [ ] App Store公開後、サイトの準備中表示をApp Storeリンクへ変更

完了証拠は再開後の実ページ・実設定・合成入力の受付試験とし、ローカルサイトのテストだけでは完了にしない。実回答や認証情報は記録しない。公開メールは一律に不要／必須とせず、再開時のApple要件と実窓口で判定する。新名称の実画面素材差し替えは下の「画像と動画」にある未完了項目を維持する。

## App Store Connect

- [x] 日本語メタデータは個別アプリ側の内容正本への参照と採用値の照合用抜粋へ整理
- [x] 英語メタデータは個別アプリ側の内容正本への参照と採用値の照合用抜粋へ整理
- [x] 無料、広告なし、サブスクリプションなし、アプリ内課金なしという方針
- [x] 個人登録時の法的実名表示を許容
- [x] 価格を0円として確定
- [x] 初回配布地域を日本のみに確定し、EU 27か国を含めない
- [ ] App Store Connectで公開地域が日本だけであることを再確認し、EU 27か国を含めない
- [ ] 公開日を確定
- [ ] 年齢区分とカテゴリを最終確定
- [ ] App Privacyを「データ収集なし」として最終Archive内容と照合
- [ ] 提出前に、フォームの実編集・日英照合・有効化と連絡先設定を踏まえ、Support URLから容易に実際の連絡手段へ進めることを確認

## 画像と動画

完了済みの撮影・形式検査は2026-08-31の旧名当時の証拠です。改名後の最終binaryと照合済みの提出素材を意味しません。

- [ ] サイトUIから非表示にした旧名4画面は無加工で保持し、公開前に改名後の実画面へ差し替えて日英・画面一致を確認
- [x] 日英01: 現行fixtureから被写界深度画面を再撮影
- [x] 日英02: 現行APEX画面を再撮影
- [x] 日英03: 現行の実寸センサー画面を再撮影
- [x] 日英04: 現行fixtureから蛇腹伸長画面を再撮影
- [x] 新しい8枚すべての寸法、PNG、RGB、sRGB、アルファ、hashを検査
- [x] 新しい8枚すべてを、現行画面・言語・数値・単位と独立目視照合
- [x] 素材制作時の現行Debug fixtureと全スクリーンショットの表示を照合
- [ ] App Store Connectへ登録する最終binaryと全スクリーンショットの表示を再照合
- [x] 初回提出は静止画だけに確定（旧名当時のPreview候補は履歴として保持）
- [x] 判断用の日英App Preview候補を現行Simulator画面で実録画・検査

## 初めて見る人としての確認

以下の素材・文面に関する完了記録は当時の制作・監査結果です。現在の公開名・最終binary・metadata正本との提出前照合は未完了のまま残します。

- [x] 一枚目と説明冒頭だけで、誰のどんな撮影に役立つか分かる
- [x] APEX、錯乱円、蛇腹などを、説明なしの主要見出しにしていない
- [x] 日本語と英語が、それぞれ自然な文章で同じ利用場面を伝えている
- [x] App Store文面を現行機能と再照合し、事実不一致がないことを確認
- [x] 制作を担当していない独立した視点で、画像8枚の順序・文言とPreview全sceneを確認
- [ ] App Store Connect入力時に、Webサイト、最終binary、Privacy表示、個別アプリ側のmetadata内容正本、採用サブタイトル（日: `被写界深度と露出をすばやく確認`／英: `Depth of Field & Exposure`）とpromo空欄、登録文面・素材を一式照合

## 素材実装基準の証拠

- [x] Focus Map素材実装基準コミット`7ec79a1f906195bea31940fbbfdd321f24ca40b8`に素材・狭い蛇腹修正・恒久回帰を保存
- [x] 日英の値・単位・pixel crop・注意書き余白の狭いUI回帰1/1成功（2026-08-31、Simulator）
- [x] 素材実装基準のDebug Simulator build成功（2026-08-31）
- [x] スクリーンショットvalidatorとPreview仕様検査成功（2026-08-31）

## 記録済みsourceの全体検証

- [x] sourceコミット`33f4062d371b34a92adf717428d875ac43cdf339`のUnit 141/141成功
- [x] 同sourceのUI 14/14成功（Clarity 8、グラフ連続drag 4、機材根拠表示2）
- [x] 同sourceのscheme既定Analyze成功
- [x] 同sourceのDebug／Release Simulator build成功
- [x] 同sourceの署名なしgeneric iOS Release build成功
- [x] 文書のみの最終HEAD`67c08486f72bfc2488319c625d8759b527c492e6`でsource／testが変わっていないことを最新監査へ同期

## 外部・実機ゲート

- [ ] Apple Distribution署名の配布用Archive／Privacy Report／Validate App
- [ ] 実機の触覚
- [ ] 実機の片手操作
- [ ] VoiceOver実読み上げ
- [ ] 物理カード／定規との実寸表示照合
- [ ] TestFlight配布
- [ ] App Store配布

## 手動提出の境界

- [x] Bundle ID `com.minatosuzuki.FocusMap`を維持
- [x] 最終提出操作は所有者が手動で行う
- [x] App Store上の公開名だけを変更し、内部履歴、素材名、ファイル名、Bundle IDを無差別に置換しない
- [ ] 公開用メールは上の必要性確認と[本人の意思の正本](/Users/minatosuzuki/work_local/アプリ管理/OWNER_INTENT.md)に従う。任意の審査リスク低減だけで作成を追加しない
- [ ] Googleフォームだけで「容易な実連絡手段」として十分かはAppleの明文保証がないため、App Reviewへ出す前にSupport URL全体を再確認
- [x] 初回配布は日本だけとし、住所・電話番号を現時点で公開しない
- [ ] 将来EUでtraderとして配布する場合は、メール、電話番号、住所または私書箱等の登録・表示要件をその時点で再確認

記録済みの素材・source検証はFocus Map側の `Docs/Release/2026-08-31-app-store-assets-audit.md`、その前の全体監査は `Docs/Release/2026-08-30-final-audit.md` を参照します。commit番号だけを現在証拠として流用せず、作業時のlive Git状態とsource hashを再照合します。Simulator、未署名build、実機、Apple Distribution署名Archive、Privacy Report、Validate App、TestFlight、App Store配布を相互に代用しません。

受付フラグは `lib/feedback.ts` で `NEXT_PUBLIC_APP_FEEDBACK_READY` / `NEXT_PUBLIC_CONTACT_READY` を文字列 `true` と厳密比較します。GitHub Actionsではrepository variables `APP_FEEDBACK_READY` / `CONTACT_READY` から対応する `NEXT_PUBLIC_` 付きの環境変数へ渡し、未設定やそれ以外の値では無効のままにします。任意メールは `PUBLIC_SUPPORT_EMAIL` から `NEXT_PUBLIC_SUPPORT_EMAIL` へ渡します。

送信ボタン未押下なら開発者へ回答として届きませんが、Googleの下書き保存・通常Web処理は別です。ログイン時の未送信下書きが設定によって30日保存されることを踏まえ、全4フォームの回答者下書き自動保存の無効化は未完了ゲートに残します。「閉じれば一切送信されない」とは説明しません。

Apple公式参照:

- Support URL / Marketing URL: https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information
- EU Digital Services Act trader requirements: https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements
- Google Formsの下書き自動保存: https://support.google.com/docs/answer/10952360?hl=en （2026-09-04確認）
