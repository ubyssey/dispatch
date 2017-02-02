import { convertFromHTML } from 'draft-js'

export default function convertFromHTMLFunc(html) {

  const blocksFromHTML = convertFromHTML(html)
  return blocksFromHTML[0]
}
