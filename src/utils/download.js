export function downloadFile(filename, content, type) {
  const blob = new Blob(type.startsWith('text/csv') ? ['﻿', content] : [content], { type })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
