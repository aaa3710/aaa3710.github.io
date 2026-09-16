# 本人編集に合わせた日英・紹介形式・アイコンの同期

2026-09-16。管理タスク `01a0a8af-17b5-7763-9c34-d62c3c429d7c` の直接依頼。WordPress原本への保存・ローカル検証。GitHub Pagesへの公開は実施していない。

## 反映範囲

- 紹介済み8アプリの日英16ページを同じ順序・文字の階層へ統一。基準の日本語「伝わる文字」の本文は変更せず、他7アプリ14ページは既存の全テキストを保ったまま移動・形式変更。撮影のものさしのカード構成と折りたたみ、道の記録の料金折りたたみは通常の本文へ変更した。
- 日本語で編集された伝わる文字の紹介・Support、アプリ一覧、共通フッターを英語へ反映。紹介の46テキスト区間、Supportの13区間を対応させ、週間50回・100円・外部API費用も日本語どおり翻訳。製品実装やApple販売設定の変更は行っていない。
- 一覧の退避版の日本語見出し変更も対応する英語へ反映。現行ページと退避版を混同して入れ替えていない。
- 上記3組のページ概要6件を現在の内容へ更新し、日英確認済みとした。共通フッターのcaptionJaを保ったままcaptionEnを保存。
- 採用済み日英名を管理資料に照合。旧内部識別子へ戻さず、本人が伝わる文字の紹介に加えた補足表現も保全。
- 道の記録の仮SVGを本体アイコンへ交換。英文を読んで覚えるの未掲載アイコンを追加。立体・写真も本体の実画像を取り込み、その他4アプリは本体とのbyte一致を確認。既存メディアは削除していない。
- GenomeNotebook・TaskRailは公開見送りの準備中ページを維持し、機能説明を創作して増やしていない。

## 検証と復元

WordPressへの全45件の保存後に本文を読み戻して一致を確認。追加の形式修正4件も同様に検証。基準日本語紹介とSupportの文言は保全。紹介は見出しタグと先頭説明のタグだけを修正し、文字サイズ・位置・行間・太さが変更前と一致することを実測した。変更ブロックはStudioの実エディタで全件検証し、追加修正も検証した。日英の代表ページを390pxと1040pxで目視確認。

編集前ページ・テンプレート本文は `work/wordpress/backups/2026-09-16-format-sync/pages-before.json`、編集後の原本一式は同ディレクトリの `after-final.tar.gz` に非公開保存。DB・認証・私的情報をGitに入れない。公開前は現在のWordPressから改めて出力・公開検証する。

## 素材照合

次の表は今回の証拠であり、採用値の並行正本ではない。次回は各アプリの現行assetと採用記録を再読する。

| Web画像 | 本体の素材 | SHA-256 |
| --- | --- | --- |
| location-logger-release-icon.png | [LocationLogger/LocationLogger/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png](/Users/minatosuzuki/work_local/LocationLogger/LocationLogger/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png) | `7f1390ad19c830176d6fe466ca254759df6e68bcf4fbee86a1d0a0b17ec6419c` |
| context-english-release-icon.png | [英語のためのアプリ/Resources/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png](/Users/minatosuzuki/work_local/英語のためのアプリ/Resources/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png) | `dfdd0343649edf025b34fa9a5c1322f41e67e47101e7d079778c120c69d8eaf3` |
| spatial-fold-release-icon.png | [空間認知能力を刺激するアプリ/Resources/Assets.xcassets/AppIcon.appiconset/AppIcon.png](/Users/minatosuzuki/work_local/空間認知能力を刺激するアプリ/Resources/Assets.xcassets/AppIcon.appiconset/AppIcon.png) | `ca92f69eafc7c8e3e15d3d373c999f649431f7d7715b4acea5faf2dc6493d0a6` |
| card-relay-release-icon.png | [写真取り込み用のMacBookのアプリ/CardRelay/Assets.xcassets/AppIcon.appiconset/icon_512x512@2x.png](/Users/minatosuzuki/work_local/写真取り込み用のMacBookのアプリ/CardRelay/Assets.xcassets/AppIcon.appiconset/icon_512x512@2x.png) | `f2027f00bce1cb90d0d5d1ff05ba3439cde7a2ff660e8f8ad4b5e7e2722e0a74` |
| tsutawaru-moji-icon.png | [会話用音声文字起こし/TsutawaruMoji/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png](/Users/minatosuzuki/work_local/会話用音声文字起こし/TsutawaruMoji/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png) | `7ccb2465e763bde174f0715986ea48513f8edeb8aa1da0b4d9db4c0e059aa781` |
| focus-exposure-calculator-icon.png | [被写界深度計算ツール/PhotoYardstick/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png](/Users/minatosuzuki/work_local/被写界深度計算ツール/PhotoYardstick/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png) | `467028c8afa78388590e5390dae9e14c81100be2f5acd166a6dbb4ccdaebc0ab` |
| mastery-steps-current-icon.png | [習慣のためのアプリ/Resources/Assets.xcassets/AppIcon.appiconset/AppIcon-iOS.png](/Users/minatosuzuki/work_local/習慣のためのアプリ/Resources/Assets.xcassets/AppIcon.appiconset/AppIcon-iOS.png) | `09759d725bd668ccdf3fc3e86be0eea064b68f4cc48dc1d16f9435ca3286d5b1` |
| wrist-morse-icon.png | [モールス信号用のアプリ/iOSApp/Assets.xcassets/AppIcon.appiconset/AppIcon.png](/Users/minatosuzuki/work_local/モールス信号用のアプリ/iOSApp/Assets.xcassets/AppIcon.appiconset/AppIcon.png) | `f5a647a9dd344a41c78267ea947efc3e38fe4158f0db937ac7dbd6631442e2e5` |

## 書き出し検証の完了

最初の静的検証では主見出し不足6件と旧仮アイコン限定8件を検出した。紹介16ページに小さい表示を保つ主見出しと太字の導入文を適用し、道の記録の新アイコンを本体と一致するSHA-256で許可した。過去の出力検証用の仮マークhashは保持し、無関係な画像は引き続き拒否する。最終出力 `work/wordpress/exports/2026-09-16T05-44-57Z` は必須68/68ページ、113経路、226 HTML、3652検査すべて成功。採用済み配信物へは昇格せず、push・一般公開は行っていない。

今回の教師信号は「特定project固有」と分類し、本人意思は管理OWNER_INTENT、編集手順と素材照合はWordPress運用へ統合した。常駐同期・自動公開は追加していない。

補助テストは通常権限で32件成功、ローカル待受のEPERMで5つの試験が停止した。同じ書き出し試験だけを必要な権限で再実行し、子試験を含む19件すべて成功。最終WordPressの直接検査で既存16ページの全テキスト保全と紹介16ページの主見出しを確認。最終バックアップは35,457,435 bytes、SHA-256 `b6268271af6b5fc570c3bfdc874f35f56a0af2427f9f9d6f5726b8840d7d8055`。
