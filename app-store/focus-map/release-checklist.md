# App Store公開前チェックリスト

## サイトと連絡先

- [x] Focus Mapの日本語・英語ページ
- [x] プライバシーポリシー
- [x] セルフサポートと計算の前提
- [ ] 監視可能な問い合わせ先を決め、サポートページへ追加
- [ ] GitHub Pagesの公開URLをPrivacy Policy URL / Support URLへ入力
- [ ] App Store公開後、サイトの準備中表示をApp Storeリンクへ変更

## App Store Connect

- [x] 日本語メタデータ案
- [x] 英語メタデータ案
- [x] 無料、広告なし、サブスクリプションなし、アプリ内課金なしという方針
- [x] 個人登録時の法的実名表示を許容
- [ ] 価格を0円として確定
- [ ] 公開地域と公開日を確定
- [ ] 年齢区分とカテゴリを最終確定
- [ ] App Privacyを「データ収集なし」として最終Archive内容と照合
- [ ] Support URLが実際の連絡先へ到達することを確認

## 画像と動画

- [x] 日英01: 現行fixtureから被写界深度画面を再撮影
- [x] 日英02: 現行APEX画面を再撮影
- [x] 日英03: 現行の実寸センサー画面を再撮影
- [x] 日英04: 現行fixtureから蛇腹伸長画面を再撮影
- [x] 新しい8枚すべての寸法、PNG、RGB、sRGB、アルファ、hashを検査
- [x] 新しい8枚すべてを、現行画面・言語・数値・単位と独立目視照合
- [x] 素材制作時の現行Debug fixtureと全スクリーンショットの表示を照合
- [ ] App Store Connectへ登録する最終binaryと全スクリーンショットの表示を再照合
- [ ] App Previewを作るか、静止画だけで出すかを最終判断
- [x] 判断用の日英App Preview候補を現行Simulator画面で実録画・検査

## 初めて見る人としての確認

- [x] 一枚目と説明冒頭だけで、誰のどんな撮影に役立つか分かる
- [x] APEX、錯乱円、蛇腹などを、説明なしの主要見出しにしていない
- [x] 日本語と英語が、それぞれ自然な文章で同じ利用場面を伝えている
- [x] App Store文面を現行機能と再照合し、事実不一致がないことを確認
- [x] 制作を担当していない独立した視点で、画像8枚の順序・文言とPreview全sceneを確認
- [ ] App Store Connect入力時に、Webサイト、最終binary、Privacy表示、登録文面・素材を一式照合

## 素材実装基準の証拠

- [x] Focus Map素材実装基準コミット`7ec79a1f906195bea31940fbbfdd321f24ca40b8`に素材・狭い蛇腹修正・恒久回帰を保存
- [x] 日英の値・単位・pixel crop・注意書き余白の狭いUI回帰1/1成功（2026-08-31、Simulator）
- [x] 素材実装基準のDebug Simulator build成功（2026-08-31）
- [x] スクリーンショットvalidatorとPreview仕様検査成功（2026-08-31）

## 現行sourceの全体検証

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

最新の素材・現行source検証はFocus Map側の `Docs/Release/2026-08-31-app-store-assets-audit.md`、直前の全体監査は `Docs/Release/2026-08-30-final-audit.md` を参照します。commit番号だけを現在証拠として流用せず、作業時のlive Git状態とsource hashを再照合します。Simulator、未署名build、実機、Apple Distribution署名Archive、Privacy Report、Validate App、TestFlight、App Store配布を相互に代用しません。
