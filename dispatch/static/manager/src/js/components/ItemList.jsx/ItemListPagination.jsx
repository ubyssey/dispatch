import React from 'react'
import { LinkButton } from '../inputs'

function getPageQuery(page, section) {
  let query = {
    page: page
  }

  if (section) {
    query.section = section
  }

  return query
}

export default function ItemListPagination(props) {
  return (
    <div className='c-item-list__pagination'>
      <LinkButton to={{ pathname: '/articles/', query: getPageQuery(props.currentPage - 1, props.section) }}>
        Prev
      </LinkButton>
      <LinkButton to={{ pathname: '/articles/', query: getPageQuery(props.currentPage + 1, props.section) }}>
        Next
      </LinkButton>
      {`Page ${props.currentPage} of ${props.totalPages}`}
    </div>
  )
}
