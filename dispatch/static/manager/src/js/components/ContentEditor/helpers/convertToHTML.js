import Immutable from 'immutable'

import { Entity } from 'draft-js'

const TAG_MAP = {
  'LINK': {
    open: (data) => {
      return `<a href="${data.url}">`
    },
    close: () => '</a>'
  },
  'BOLD': {
    open: '<b>',
    close: '</b>'
  },
  'ITALIC': {
    open: '<em>',
    close: '</em>'
  },
  UNDERLINE: {
    open: '<u>',
    close: '</u>'
  }
}

function generateTag(tag, tagType) {
  if (parseInt(tag, 10)) {
    let entity = Entity.get(tag)
    let entityType = entity.getType()

    let generator = TAG_MAP[entityType][tagType]

    return generator(entity.get('data'))

  } else {
    return TAG_MAP[tag][tagType]
  }
}

function addTag(str, tag) {
  return str + generateTag(tag, 'open')
}

function removeTag(str, tag) {
  return str + generateTag(tag, 'close')
}

function getTagSetAt(contentBlock, i) {
  let styleSet = contentBlock.getInlineStyleAt(i)
  let entitySet = Immutable.OrderedSet(contentBlock.getEntityAt(i))

  return entitySet.concat(styleSet)
}

export default function convertToHTML(contentBlock) {
  let str = ''
  let characters = contentBlock.getText()

  let activeTags = Immutable.Stack()

  let lastCharacterTags = Immutable.OrderedSet()

  for(var i = 0; i < contentBlock.getLength(); i++) {
    // Get tags for this character
    let characterTags = getTagSetAt(contentBlock, i)

    // Determine tags to be added and removed
    let toAdd = characterTags.subtract(lastCharacterTags)
    let toRemove = lastCharacterTags.subtract(characterTags)

    // Keep track of temporarily removed tags
    let toAddBack = Immutable.OrderedSet()

    toRemove.map( tag => {

      // Skip this tag if we've already removed it, and take it out of
      // the toAddBack set
      if (toAddBack.includes(tag)) {
        toAddBack = toAddBack.remove(tag)
        return
      }

      // Remove parent tags before removing this one,
      // saving them to toAddBack for later
      while (activeTags.peek() !== tag) {
        let currentTag = activeTags.peek()

        str = removeTag(str, currentTag)
        activeTags = activeTags.pop()

        toAddBack = toAddBack.add(currentTag)
      }

      // Remove this tag
      str = removeTag(str, tag)
      activeTags = activeTags.pop()

    })

    // Add back temporarily-removed tags as well as any new tags
    toAdd = toAddBack.concat(toAdd)

    toAdd.map( tag => {
      str = addTag(str, tag)
      activeTags = activeTags.push(tag)
    })

    lastCharacterTags = characterTags

    // Add current character to string
    str += characters[i]
  }

  // Close remaining tags
  while (!activeTags.isEmpty()) {
    str = removeTag(str, activeTags.peek())
    activeTags = activeTags.pop()
  }

  return str

}
