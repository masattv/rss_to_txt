import type { NextApiRequest, NextApiResponse } from 'next'
import Parser from 'rss-parser'
import JSZip from 'jszip'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { decode } from 'html-entities'
import * as iconv from 'iconv-lite'

type Data = {
  zip: string  // base64 encoded
}

async function fetchArticleContent(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    // Shift-JISでデコード
    const html = iconv.decode(response.data, 'Shift_JIS')
    const $ = cheerio.load(html)
    
    // 不要な要素を削除
    $('script, style, iframe, .advertisement, .related-articles, .article-footer, .article-header, .article-meta, .article-sidebar').remove()
    
    // 記事本文を取得
    const content = $('#cmsBody')
      .find('p')  // 段落要素のみを取得
      .map((_, el) => {
        const text = $(el).text().trim()
        return text ? decode(text) : ''  // HTMLエンティティをデコード
      })
      .get()  // 配列に変換
      .filter(text => text.length > 0)  // 空の段落を除去
      .join('\n\n')  // 段落間に空行を入れて結合
    
    return content || '本文を取得できませんでした'
  } catch (e) {
    console.error('記事取得エラー:', e)
    return '記事の取得に失敗しました'
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | { error: string }>
) {
  const { url } = req.body
  if (!url) {
    return res.status(400).json({ error: 'URL を指定してください' })
  }

  try {
    const parser = new Parser()
    const feed = await parser.parseURL(url)
    const zip = new JSZip()

    // 記事を並行して取得
    const articlePromises = feed.items.map(async (item, idx) => {
      const title = item.title?.replace(/[\/\\?%*:|"<>]/g, '_') || `article_${idx+1}`
      const articleContent = await fetchArticleContent(item.link || '')
      
      const content = [
        `タイトル: ${item.title}`,
        `公開日: ${item.pubDate}`,
        `リンク: ${item.link}`,
        '',
        articleContent
      ].join('\n')
      
      return { title, content }
    })

    const articles = await Promise.all(articlePromises)
    
    // ZIPファイルに追加
    articles.forEach(({ title, content }) => {
      zip.file(`${title}.txt`, content)
    })

    const blob = await zip.generateAsync({ type: 'nodebuffer' })
    const base64 = blob.toString('base64')
    res.status(200).json({ zip: base64 })
  } catch (e: any) {
    console.error('RSS取得エラー:', e)
    res.status(500).json({ error: e.message })
  }
} 