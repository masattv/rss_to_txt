import type { NextApiRequest, NextApiResponse } from 'next'
import Parser from 'rss-parser'
import JSZip from 'jszip'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { decode } from 'html-entities'
import * as iconv from 'iconv-lite'

type Data = {
  zip?: string
  error?: string
}

const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'content'],
      ['description', 'description'],
    ],
  },
})

async function fetchArticleContent(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
      },
    })

    // Shift-JISでデコード
    const html = iconv.decode(response.data, 'Shift_JIS')
    const $ = cheerio.load(html)

    // 不要な要素を削除
    $('script, style, .article-footer, .article-header, .article-meta, .article-sidebar, .ad, .related-articles').remove()

    // 記事本文を取得
    const content = $('#cmsBody')
      .find('p')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(text => text.length > 0)
      .join('\n\n')

    return decode(content)
  } catch (error) {
    console.error('記事の取得に失敗:', error)
    return '記事の取得に失敗しました'
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { url } = req.body

  if (!url) {
    return res.status(400).json({ error: 'URL is required' })
  }

  try {
    const feed = await parser.parseURL(url)
    const zip = new JSZip()

    // 記事の内容を並行して取得
    const articles = await Promise.all(
      feed.items.map(async (item) => {
        const content = await fetchArticleContent(item.link || '')
        return {
          title: item.title || '無題',
          date: item.isoDate || new Date().toISOString(),
          link: item.link || '',
          content: content,
        }
      })
    )

    // 各記事をZIPファイルに追加
    articles.forEach((article) => {
      const fileName = `${article.title.replace(/[\\/:*?"<>|]/g, '_')}.txt`
      const content = `タイトル: ${article.title}\n\n` +
        `公開日: ${new Date(article.date).toLocaleString('ja-JP')}\n\n` +
        `URL: ${article.link}\n\n` +
        `本文:\n${article.content}\n\n` +
        `※ このファイルは私的利用に限りご利用いただけます。`
      zip.file(fileName, content)
    })

    // ZIPファイルを生成
    const zipContent = await zip.generateAsync({ type: 'nodebuffer' })
    const base64Zip = zipContent.toString('base64')

    res.status(200).json({ zip: base64Zip })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Failed to fetch RSS feed' })
  }
} 