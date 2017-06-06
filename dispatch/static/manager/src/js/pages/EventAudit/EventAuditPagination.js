import React from 'react'
import R from 'ramda'

import LinkButton from '../../components/inputs/LinkButton'

function getPath(location, page) {
  let query = R.clone(location.query)

  query.page = page

  return {
    pathname: location.pathname,
    query: query
  }
}

export default function EventAuditPagination(props) {
  const { page, pages } = props

  return (
    <div className='c-event-audit-pagination'>
      <LinkButton
        to={getPath(props.location, page - 1)}
        disabled={page <= 1}>Prev</LinkButton>
      {' '}
      <LinkButton
        to={getPath(props.location, page + 1)}
        disabled={page >= pages}>Next</LinkButton>
      <div className='c-event-audit-pagination-label'>
        Page {page} of {pages}
      </div>
    </div>
  )

}
