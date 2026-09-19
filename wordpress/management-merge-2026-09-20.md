# 管理への統合とリリース情報整合 — 2026-09-20

Web制作をアプリ管理へ統合し、WordPress原本と既存公開Gitを `アプリ管理/website/` へ移した。旧認知directoryは残していない。元394 tracked filesの欠落0、DB・media・Git履歴を保持。Studio登録、ランチャー、MCPの参照も新pathへ変更した。PHPとStudioのpath表現はNFDへ統一し、移動後のopen_basedirエラーを解消。許可範囲の拡大はない。

WordPressの変更は24ページ。日英一覧でGenomeNotebookとTaskRailを同じ配布準備中カードへ移し、20紹介ページと2一覧にStoreリンク部品を配置。対象8本ではheader内へ置いた。公開URLが未確認なら押せない準備中表示とし、実在するURLと到達確認後だけ有効になる。

道の記録・習慣のステップ・英文を読んで覚えるの紹介日英6件を最新仕様へ、道のPrivacy2件を場所検索と週利用枠へ同期。ほか86公開関連レコードは本文・概要不変。110レコードを編集前後で照合。専用FeedbackとContactの18受付リンク・役割は保持し、実回答の読取・新送信・フォーム設定変更はしていない。

検証: 53テスト、Storeリンクの実render境界5件、format／lint成功。390pxと通常幅を実ブラウザで確認。候補 `work/wordpress/exports/2026-09-19T16-41-19Z` は68必須ページ・113経路・226 HTML・3552検査成功。現在WordPressと242配信ファイルの一致を確認して `site-output/` へ採用した。一般公開は行っていない。

移動前後の完全backupを `work/wordpress/backups/2026-09-20-before-management-merge.tar.gz` と `2026-09-20-after-management-merge.tar.gz` に保持。原本はローカル保存済み。次の公開依頼では現在WordPressとの一致を再確認してから通常手順で公開する。developerページURL・未登録のアプリIDが確定するまでは、実Storeへの導線完了とは扱わない。

今後の入力元は管理 `publishing/release-drafts.md`。Web本文の正本はこのWordPressのまま、各アプリのsource／仕様は各本体projectに保持する。
