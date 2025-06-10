import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export default function GoogleAdsense() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="YOUR-CLIENT-ID"
      data-ad-slot="YOUR-AD-SLOT"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
} 