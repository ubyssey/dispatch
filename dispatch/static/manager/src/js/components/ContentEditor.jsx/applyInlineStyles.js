import R from 'ramda'
import Immutable from 'immutable'

const STYLES = {
  BOLD: 'b',
  ITALIC: 'i'
}

function buildTag(name, closingTag) {
  let slash = closingTag ? '/' : ''

  return `<${slash}${name}>`
}

function addStyle(str, style) {
  return str + buildTag(STYLES[style], false)
}

function removeStyle(str, style) {
  return str + buildTag(STYLES[style], true)
}

export default function applyInlineStyles(contentBlock) {
  let str = ''
  let characters = contentBlock.getText()

  let activeStyles = Immutable.Stack()

  for(var i = 0; i < contentBlock.getLength(); i++) {
    // Get styles for this character
    let characterStylesList = contentBlock.getInlineStyleAt(i).toJS()
    let activeStylesList = activeStyles.toJS()

    // Determine styles to be added and removed
    let toAdd = R.difference(characterStylesList, activeStylesList)
    let toRemove = R.difference(activeStylesList, characterStylesList)

    // Keep track of temporarily removed styles
    let toAddBack = Immutable.Set()

    toRemove.map( style => {

      // Skip this style if we've already removed it, and take it out of
      // the toAddBack set
      if (toAddBack.includes(style)) {
        toAddBack = toAddBack.remove(style)
        return
      }

      // Remove parent styles before removing this one,
      // saving them to toAddBack for later
      while (activeStyles.peek() !== style) {
        let currentStyle = activeStyles.peek()

        str = removeStyle(str, currentStyle)
        activeStyles = activeStyles.pop()

        toAddBack = toAddBack.add(currentStyle)
      }

      // Remove this style
      str = removeStyle(str, style)
      activeStyles = activeStyles.pop()

    })

    // Add back temporarily-removed styles as well as any new styles
    toAdd = toAddBack.toList().concat(toAdd)

    toAdd.map( style => {
      str = addStyle(str, style)
      activeStyles = activeStyles.push(style)
    })

    str += characters[i]
  }

  // Close remaining tags
  while (!activeStyles.isEmpty()) {
    str = removeStyle(str, activeStyles.peek())
    activeStyles = activeStyles.pop()
  }

  return str

}
