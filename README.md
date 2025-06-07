# RSS to TXT Converter

RSSフィードの記事をTXTファイルに変換し、ZIPファイルとしてダウンロードできるWebアプリケーションです。

## 技術スタック

- フロントエンド：Next.js（React）
- API／サーバーサイド：Next.js API Routes（Node.js）
- RSS パース：npm パッケージ rss-parser
- ZIP 圧縮：npm パッケージ jszip

## 機能

- RSSフィードのURLを入力して記事を取得
- 各記事をTXTファイルに変換
- 複数のTXTファイルをZIP圧縮してダウンロード
- 記事のタイトル、公開日、リンク、本文を含む

## セットアップ

1. リポジトリをクローン
```bash
git clone [repository-url]
cd rss-to-txt
```

2. 依存関係をインストール
```bash
npm install
```

3. 開発サーバーを起動
```bash
npm run dev
```

4. ブラウザで http://localhost:3000 にアクセス

## デプロイ

Vercelにデプロイする場合：

1. GitHubリポジトリをVercelに連携
2. 自動的にデプロイが完了

## 注意事項

- RSSフィードのURLは有効なものを入力してください
- 大量の記事がある場合、処理に時間がかかる可能性があります
