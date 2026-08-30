# App Preview候補

## 方針

App Previewは必須ではありませんが、日本語・英語の実録画候補は制作・検査済みです。静止画だけで提出するか、この候補を使うかは、App Store Connect入力前に所有者が決めます。

## 現行候補

| 言語 | file | 長さ | SHA-256 |
|---|---|---:|---|
| 日本語 | `AppPreviews/ja/FocusMap-AppPreview-ja-6.9inch.mp4` | 25.5秒 | `1d21440e9b3f5e8ae67d354d1cb2982af20fda7b1867f7325d3aa866830c21e7` |
| English | `AppPreviews/en/FocusMap-AppPreview-en-6.9inch.mp4` | 24.5秒 | `7fdf672a43e955af06a23f79ae86a673b3806688f9b5bd14e786e170138db924` |

pathは `/Users/minatosuzuki/work_local/被写界深度計算ツール/Docs/Release/AppStoreSubmission/` を基準にします。実素材の正本はFocus Map側に置き、このリポジトリへ動画を複製しません。

## 実際の構成

1. ピント主画面 — 許容範囲と連続曲線
2. 実寸センサー比較 — 数字だけでなく大きさで比較
3. APEX — 絞り・シャッター速度・ISOの関係
4. 蛇腹補正 — 大判・接写の露出補正

旧27秒台本を現行画面と照合し、実録画候補では初見の理解を優先して4つの現行画面へ絞りました。scene再launch中のホーム画面、launch animation、白画面だけを除き、字幕、合成UI、生成画像、架空機能、音声は加えていません。

## 検査結果

- 日本語・英語を別々に録画し、各動画は選択した一言語だけで完結。
- H.264 High、886×1920px、30fps、yuv420p、audio streamなし、500MB未満。
- Appleの15〜30秒条件内。
- 全sceneを高密度contact sheetと原寸frameで独立確認し、言語分離、4場面の順序、起動／白画面の不在、下部タブとの非干渉、実画面だけであることに合格。

## 採否判断

採用する場合は、App Store Connectへ登録するbinaryと画面・文言が一致していること、ポスターフレームが最初の価値を伝えることを最終確認します。静止画だけにする場合も、制作済み候補は履歴としてFocus Map側に保持します。

この動画はSimulator上の現行UIを示す証拠であり、実機操作、署名済み配布候補、TestFlight、App Store配布の証拠ではありません。

参考: https://developer.apple.com/help/app-store-connect/reference/app-information/app-preview-specifications/
