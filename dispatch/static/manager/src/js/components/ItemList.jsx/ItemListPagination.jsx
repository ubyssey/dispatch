import React from 'react'
import { LinkButton, InputGroup } from '../inputs'

function getPageQuery(page, section) {
  let query = {
    page: page
  }

  if (section) {
    query.section = section
  }

  return query
}

function prevButton(props) {
  return (
    <LinkButton to={{ pathname: '/articles/', query: getPageQuery(props.currentPage - 1, props.section) }}>
      Prev
    </LinkButton>
  )
}

function nextButton(props) {
  return (
    <LinkButton to={{ pathname: '/articles/', query: getPageQuery(props.currentPage + 1, props.section) }}>
      Next
    </LinkButton>
  )
}

export default function ItemListPagination(props) {
  return (
    <div className='c-item-list__pagination'>
      <InputGroup>
        {props.currentPage > 1 ? prevButton(props) : null}
        {props.currentPage < props.totalPages ? nextButton(props) : null}
      </InputGroup>
      <div className='c-item-list__pagination__text'>
        {`Page ${props.currentPage} of ${props.totalPages}`}
      </div>
    </div>
  )
}
