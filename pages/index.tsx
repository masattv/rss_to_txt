import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setLoading(true)
    try {
      const response = await fetch('/api/fetch-rss', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()
      if (data.error) {
        alert(data.error)
        return
      }

      // ZIPファイルを作成してダウンロード
      const zipBlob = new Blob([Buffer.from(data.zip, 'base64')], { type: 'application/zip' })
      const downloadUrl = URL.createObjectURL(zipBlob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = 'articles.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      alert('エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 11C6.38695 11 8.67613 11.9482 10.364 13.636C12.0518 15.3239 13 17.6131 13 20V21H15V20C15 16.8174 13.7357 13.7652 11.4853 11.5147C9.23485 9.26428 6.1826 8 3 8V11H4Z" fill="currentColor"/>
                <path d="M4 4C7.31371 4 10 6.68629 10 10H12C12 5.58172 8.41828 2 4 2V4Z" fill="currentColor"/>
                <path d="M4 6C5.65685 6 7 7.34315 7 9H9C9 6.23858 6.76142 4 4 4V6Z" fill="currentColor"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              RSS to TXT
            </h1>
          </div>

          <div className="mb-12 text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-200">RSSフィードをテキストファイルに変換</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-gray-800/30 p-6 rounded-xl">
                <h3 className="text-lg font-medium text-blue-400 mb-3">📚 オフライン読書</h3>
                <p className="text-gray-300 text-sm">
                  RSSフィードの記事をテキストファイルとして保存し、いつでもどこでも読書を楽しめます。
                </p>
              </div>
              <div className="bg-gray-800/30 p-6 rounded-xl">
                <h3 className="text-lg font-medium text-purple-400 mb-3">🔍 検索・分析</h3>
                <p className="text-gray-300 text-sm">
                  テキストファイル化することで、記事の内容を簡単に検索・分析できます。
                </p>
              </div>
              <div className="bg-gray-800/30 p-6 rounded-xl">
                <h3 className="text-lg font-medium text-green-400 mb-3">📱 デバイス対応</h3>
                <p className="text-gray-300 text-sm">
                  スマートフォンやタブレットなど、どのデバイスでも快適に読書できます。
                </p>
              </div>
              <div className="bg-gray-800/30 p-6 rounded-xl">
                <h3 className="text-lg font-medium text-yellow-400 mb-3">💾 データ保存</h3>
                <p className="text-gray-300 text-sm">
                  記事をローカルに保存することで、インターネット接続なしでもアクセス可能です。
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                  RSSフィードのURL
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/feed.xml"
                  className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-gray-500 transition-all duration-200"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    処理中...
                  </div>
                ) : (
                  '記事をダウンロード'
                )}
              </button>
            </form>
          </div>

          <div className="mt-12 text-center space-y-4">
            <p className="text-gray-400 text-sm">
              RSSフィードのURLを入力して、記事をテキストファイルとしてダウンロードできます。
            </p>
            <p className="text-gray-500 text-xs">
              ※ 生成したtxtファイルは私的利用に限りご利用いただけます。
            </p>
            <p className="text-gray-500 text-xs">
              要望・お問い合わせは <a href="https://x.com/mk_dev_0430" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">@mk_dev_0430</a> までDMをお願いします。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
