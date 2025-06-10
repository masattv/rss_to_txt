import type { NextApiRequest, NextApiResponse } from 'next'
import chromium from 'chrome-aws-lambda'
import puppeteer from 'puppeteer-core'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { html } = req.body
  if (!html) {
    return res.status(400).json({ error: 'html is required' })
  }

  let browser = null
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    })

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    const pdfBuffer = await page.pdf({
      format: 'a4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="rss_output.pdf"')
    res.send(pdfBuffer)
  } catch (error) {
    console.error('PDF generation error:', error)
    res.status(500).json({ error: 'PDF generation failed' })
  } finally {
    if (browser) await browser.close()
  }
} 