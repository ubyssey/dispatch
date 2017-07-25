import {
  ContentState,
  ContentBlock,
  CharacterMetadata,
  Entity,
  EntityInstance,
  genKey,
  convertFromHTML
} from 'draft-js'
import { List, OrderedMap } from 'immutable'

import convertToHTML from './convertToHTML'

function parseBlock(block) {
  const type = block.getType()

  if (type === 'atomic') {
    const entity = Entity.get(block.getEntityAt(0))
    return {
      type: entity.getType().toLowerCase(),
      data: entity.getData()
    }
  } else {
    return {
      type: 'paragraph',
      data: convertToHTML(block)
    }
  }

}

function createParagraphBlock(block) {
  return convertFromHTML(block.data)
}

function createEntityBlock(block) {

  const entity = new EntityInstance({
    type: block.type,
    mutability: 'IMMUTABLE',
    data: block.data
  })

  const entityKey = Entity.add(entity)
  const charData = CharacterMetadata.create({entity: entityKey})

  let contentBlock = new ContentBlock({
    key: genKey(),
    type: 'atomic',
    text: ' ',
    characterList: List([charData])
  })

  return {
    contentBlocks: [contentBlock],
    entityMap: {entityKey: entity}
  }

}

function createBlock(acc, block) {

  let blocksFromJSON

  if (block.type === 'paragraph') {
    blocksFromJSON = createParagraphBlock(block)
  } else {
    blocksFromJSON = createEntityBlock(block)
  }

  if (blocksFromJSON) {
    acc.contentBlocks = acc.contentBlocks.concat(blocksFromJSON.contentBlocks)
    acc.entityMap = acc.entityMap.merge(blocksFromJSON.entityMap)
  }

  return acc

}

function fromJSON(jsonBlocks) {
  const blocksFromHTML =
    jsonBlocks.reduce(
      createBlock,
      { contentBlocks: new Array(), entityMap: new OrderedMap() }
    )

  // Create new ContentState from contentBlocks and entityMap
  return ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  )
}

function escapeHTML(block) {
  if (block.type == 'paragraph') {
    let data = block.data

    data = data.replace('&', '&amp')
    data = data.replace(/<(?![ab]|em|h[1-6]|lu|ul|\/[ab]|\/em|\/h[1-6]|\/lu|\/ul)/g, '&lt;')

    block.data = data
  }
  return block
}

function toJSON(contentState) {
  if (!contentState) {
    contentState =  ContentState.createFromText('')
  }

  // Converts from ContentState to JSON
  return contentState.getBlockMap()
    .map(parseBlock)
    .toList()
    .toJS()
    .map(escapeHTML)
}

export {
  toJSON,
  fromJSON
}
