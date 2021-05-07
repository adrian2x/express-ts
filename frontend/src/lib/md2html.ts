import Marked from 'marked'
import dompurify from 'dompurify'

export function md2html(content: string) {
  return Marked(content, {
    breaks: true,
    gfm: true,
    smartLists: true,
    smartypants: true,
    sanitizer: (data) => dompurify.sanitize(data)
  })
}
