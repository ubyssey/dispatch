import React from 'react'
import { Entity } from 'draft-js'

function Link(props) {
  const { url } = Entity.get(props.entityKey).getData()
  return (
    <a href={url} className='c-content-editor__entity c-content-editor__entity--link'>
      {props.children}
    </a>
  )
}

function findLinkEntities(contentBlock, callback) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity()
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'LINK'
      )
    },
    callback
  )
}

const LinkEntity = {
  strategy: findLinkEntities,
  component: Link,
}

export default LinkEntity
