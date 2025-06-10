declare module 'html-pdf-node' {
  interface Options {
    format?: string
    margin?: {
      top?: string
      right?: string
      bottom?: string
      left?: string
    }
    printBackground?: boolean
  }

  interface File {
    content: string
  }

  const htmlPdf: {
    generatePdf(file: File, options?: Options): Promise<Buffer>
  }

  export = htmlPdf
} 