import React from 'react'
import { Text } from '@blueprintjs/core'

import { LinkButton } from '../inputs'

import { getPath }  from '../../util/helpers'

export default function ItemListPagination(props) {

  const prevButton = (
    <LinkButton icon='chevron-left' to={getPath(props.location, props.currentPage - 1)} />
  )

  const nextButton = (
    <LinkButton icon='chevron-right' to={getPath(props.location, props.currentPage + 1)} />
  )

  return (
    <div className='c-item-list__pagination'>
      <div className='bp3-control-group'>
        {props.currentPage > 1 ? prevButton : null}
        {props.currentPage < props.totalPages ? nextButton : null}
      </div>
      <Text className='c-item-list__pagination__text'>
        {`Page ${props.currentPage} of ${props.totalPages}`}
      </Text>
    </div>
  )
}
