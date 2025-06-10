import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR-CLIENT-ID"
          crossOrigin="anonymous"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
