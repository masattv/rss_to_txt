import type { NextApiRequest, NextApiResponse } from 'next'
import htmlPdf from 'html-pdf-node'

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

  try {
    const options = {
      format: 'A4',
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
      printBackground: true,
    }

    const file = { content: html }
    const pdfBuffer = await htmlPdf.generatePdf(file, options)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="rss_output.pdf"')
    res.send(pdfBuffer)
  } catch (error) {
    console.error('PDF generation error:', error)
    res.status(500).json({ error: 'PDF generation failed' })
  }
} 