# 撮影のものさし / Photo Yardstick の名称反映

採用日: 2026-09-05。再開・確認完了: 2026-09-07。

## 反映内容

本人の採用名・サブタイトル・Bundle IDは[管理のOWNER_INTENT](/Users/minatosuzuki/work_local/アプリ管理/OWNER_INTENT.md#個別アプリの公開名--focusmap)、製品入力原稿は[本体metadata](/Users/minatosuzuki/work_local/被写界深度計算ツール/Docs/Release/AppStoreMetadata.ja-en.md)を正本とする。

日英の一覧、紹介、Support、Privacy、Feedback、Contact内のアプリ参照、検索・共有metadata、共有画像をローカルで更新した。日本語は「撮影のものさし」「ピントと露出を計算」、英語は「Photo Yardstick」「Depth of Field & Exposure」。紹介冒頭にもサブタイトルを併記した。認知側のApp Store原稿は正本参照と照合用抜粋を更新し、採用日と内部名の旧説明も訂正した。

安定slug `focus-exposure-calculator`、`/apps/` 配下の日英URL、内部component名、検証済みの過去素材・監査は維持した。Bundle ID `com.minatosuzuki.PhotoYardstick` の本体反映と検証は[本体の改名記録](/Users/minatosuzuki/work_local/被写界深度計算ツール/Docs/Release/2026-09-05-photo-yardstick-rename.md)を参照する。

## 2026-09-07の確認

- `npm test`: 18/18成功。名称・サブタイトル・URLの整合を含む。
- `npm run lint`、`git diff --check`: 成功。
- `verify:pages`: 28/28必須ページ、71公開route、142 HTML、1937検査中2件失敗。失敗は `/apps/tsutawaru-moji/` と英語対の `unverified app imagery present` だけ。9月5日に改名前HEADでも確認された別件のアイコンと検査期待値の不一致で、今回修正しない。撮影計算アプリの名称・導線・metadata検査に失敗はない。
- 静的buildは9月5日の継続作業で成功済みとして引き継いだ。9月7日は名称変更後に生成された既存 `dist/client/` を使用してローカル表示を確認し、build成功を新たな実行証拠へ読み替えない。
- 紹介ページを専用headless Chromeで日英それぞれ390×844pxと1440×1000pxの計4画面を撮影・目視。名称とサブタイトルの欠け・重なりなし。両言語の390px幅でdocumentのscrollWidthも390px。日本語から英語へのLanguage切替は対応ページへ到達した。確認画像はGit対象外の `output/playwright/rename-{ja,en}-{mobile,desktop}.png`。
- 共有画像 `public/images/focus-exposure-calculator/og-{ja,en}.png` は各1200×630px。両画像を個別に目視し、正しい名称・サブタイトル、文字欠けなし、余白を確認。静的出力の画像とbyte単位で一致した。

静的成果物・ローカルbrowserの証拠であり、実機、提出用binary、外部公開、実Forms、App Store Connectの確認ではない。今回の確認用browserとローカルserverは終了した。

## 公開と素材の残件

今回のpush・本番公開・実Forms改名・Apple登録／ASC保存は未実施。ローカルmainにある別アプリの未公開変更を改名として一括公開しない。公開サイト読取は前回の `not safe to open (non-retryable error)` 以後、別経路を含め再試行していない。

旧名時点のスクリーンショット・動画は保持し、サイトの旧画面画像は非表示を維持した。本体のUI撮影が未完了のため、改名後の実画面への差し替え・最終binary照合は残件。初回提出は静止画のみとする既存方針を維持する。

今回の知見は個別project固有の名称反映・証拠境界として本記録へ保存した。共通工程への新原則追加は不要で、[既存の名称・アイコン制作手順](/Users/minatosuzuki/work_local/アプリ開発共通事項/開発標準/名称とアイコンの制作手順.md)と[担当境界](/Users/minatosuzuki/work_local/アプリ開発共通事項/README.md#関連projectとの責任境界)に包含される。
