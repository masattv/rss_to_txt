import { useState } from 'react'
import JSZip from 'jszip'

interface DownloadButtonsProps {
  articles: Array<{
    title: string
    content: string
    link: string
    pubDate: string
  }>
}

export default function DownloadButtons({ articles }: DownloadButtonsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleTxtDownload = async () => {
    setIsLoading(true)
    try {
      const zip = new JSZip()
      
      articles.forEach((article) => {
        const content = `タイトル: ${article.title}\n\n` +
          `公開日: ${article.pubDate}\n\n` +
          `リンク: ${article.link}\n\n` +
          `本文:\n${article.content}`
        
        zip.file(`${article.title}.txt`, content)
      })

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'rss_articles.zip'
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('TXT download error:', error)
      alert('ダウンロードに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePdfDownload = async () => {
    setIsLoading(true)
    try {
      const html = `
        <html>
          <head>
            <style>
              body { font-family: sans-serif; line-height: 1.6; }
              article { margin-bottom: 2em; }
              h1 { font-size: 1.5em; margin-bottom: 0.5em; }
              .meta { color: #666; margin-bottom: 1em; }
              .content { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            ${articles.map(article => `
              <article>
                <h1>${article.title}</h1>
                <div class="meta">
                  <p>公開日: ${article.pubDate}</p>
                  <p>リンク: ${article.link}</p>
                </div>
                <div class="content">${article.content}</div>
              </article>
            `).join('')}
          </body>
        </html>
      `

      const res = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html }),
      })

      if (!res.ok) {
        throw new Error('PDF generation failed')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'rss_articles.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF download error:', error)
      alert('PDFの生成に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-4 mt-4">
      <button
        onClick={handleTxtDownload}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? '処理中...' : 'TXTでダウンロード'}
      </button>
      <button
        onClick={handlePdfDownload}
        disabled={isLoading}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        {isLoading ? '処理中...' : 'PDFでダウンロード'}
      </button>
    </div>
  )
} 