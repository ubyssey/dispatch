import React from 'react'
import R from 'ramda'
import { LinkButton, InputGroup } from '../inputs'

function getPath(location, page) {
  let query = R.clone(location.query)

  query.page = page

  return {
    pathname: location.pathname,
    query: query
  }
}

export default function ItemListPagination(props) {

  const prevButton = (
    <LinkButton to={getPath(props.location, props.currentPage - 1)}>Prev</LinkButton>
  )

  const nextButton = (
    <LinkButton to={getPath(props.location, props.currentPage + 1)}>Next</LinkButton>
  )

  return (
    <div className='c-item-list__pagination'>
      <InputGroup>
        {props.currentPage > 1 ? prevButton : null}
        {props.currentPage < props.totalPages ? nextButton : null}
      </InputGroup>
      <div className='c-item-list__pagination__text'>
        {`Page ${props.currentPage} of ${props.totalPages}`}
      </div>
    </div>
  )
}
