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

const DRAFT_TYPES = {
  PARAGRAPH: 'unstyled',
  EMBED: 'atomic',
  HEADER: 'header-two',
  LIST: 'unordered-list-item'
}

const DISPATCH_TYPES = {
  PARAGRAPH: 'paragraph',
  HEADER: 'header',
  LIST: 'list'
}

function embedToJSON(jsonBlocks, block) {
  const entity = Entity.get(block.getEntityAt(0))
  const jsonBlock = {
    type: entity.getType().toLowerCase(),
    data: entity.getData()
  }
  return jsonBlocks.push(jsonBlock)
}

function paragraphToJSON(jsonBlocks, block) {
  const jsonBlock = {
    type: 'paragraph',
    data: convertToHTML(block)
  }
  return jsonBlocks.push(jsonBlock)
}

function headerToJSON(jsonBlocks, block) {
  const jsonBlock = {
    type: 'header',
    data: {
      'content': convertToHTML(block),
      'size': 'h2'
    }
  }
  return jsonBlocks.push(jsonBlock)
}

function listToJSON(jsonBlocks, block, lastType) {
  const data = convertToHTML(block)

  if (lastType == DISPATCH_TYPES.LIST) {
    const jsonBlock = {
      type: DISPATCH_TYPES.LIST,
      data: jsonBlocks.last().data.push(data)
    }
    return jsonBlocks.set(jsonBlock.size - 1, jsonBlock)
  } else {
    const jsonBlock = {
      type: DISPATCH_TYPES.LIST,
      data: [data]
    }
    return jsonBlocks.push(jsonBlock)
  }
}

function blockToJSON(jsonBlocks, block) {
  const type = block.getType()
  const lastType = jsonBlocks.last() ? jsonBlocks.last().type : null

  switch (type) {
  case DRAFT_TYPES.EMBED:
    return embedToJSON(jsonBlocks, block, lastType)
  case DRAFT_TYPES.PARAGRAPH:
    return paragraphToJSON(jsonBlocks, block, lastType)
  case DRAFT_TYPES.HEADER:
    return headerToJSON(jsonBlocks, block, lastType)
  case DRAFT_TYPES.LIST:
    return listToJSON(jsonBlocks, block, lastType)
  default:
    return jsonBlocks
  }
}

function embedToBlock(block) {
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

function paragraphToBlock(block) {
  return convertFromHTML(block.data)
}

function headerToBlock(block) {
  const contentBlocks = convertFromHTML(block.data.content).contentBlocks
    .map(contentBlock => contentBlock.set('type', DRAFT_TYPES.HEADER))

  return {
    contentBlocks: contentBlocks,
    entityMap: {}
  }
}

function listToBlock(block) {
  const contentBlocks = block.data
    .map(text => convertFromHTML(text).contentBlocks[0])
    .map(contentBlock => contentBlock.set('type', DRAFT_TYPES.LIST))

  return {
    contentBlocks: contentBlocks,
    entityMap: {}
  }
}

function JSONToBlock(acc, block) {
  let blocksFromJSON

  switch (block.type) {
  case DISPATCH_TYPES.PARAGRAPH:
    blocksFromJSON = paragraphToBlock(block)
    break
  case DISPATCH_TYPES.LIST:
    blocksFromJSON = listToBlock(block)
    break
  case DISPATCH_TYPES.HEADER:
    blocksFromJSON = headerToBlock(block)
    break
  default:
    blocksFromJSON = embedToBlock(block)
  }

  if (blocksFromJSON && blocksFromJSON.contentBlocks) {
    acc.contentBlocks = acc.contentBlocks.concat(blocksFromJSON.contentBlocks)
    acc.entityMap = acc.entityMap.merge(blocksFromJSON.entityMap)
  }

  return acc
}

function fromJSON(jsonBlocks) {
  if (!jsonBlocks.length) {
    return ContentState.createFromText('')
  }

  const blocksFromHTML =
    jsonBlocks.reduce(
      JSONToBlock,
      { contentBlocks: new Array(), entityMap: new OrderedMap() }
    )

  // Create new ContentState from contentBlocks and entityMap
  return ContentState.createFromBlockArray(
    blocksFromHTML.contentBlocks,
    blocksFromHTML.entityMap
  )
}

function toJSON(contentState) {
  if (!contentState) {
    contentState = ContentState.createFromText('')
  }

  // Converts from ContentState to JSON
  return contentState.getBlockMap().reduce(blockToJSON, List()).toJSON()
}

export {
  toJSON,
  fromJSON
}
