import React from 'react'

import { getPath }  from '../../../util/helpers'

import LinkButton from '../../../components/inputs/LinkButton'

export default function EventAuditPagination(props) {
  const { page, pages } = props

  return (
    <div className='c-event-audit-pagination'>
      <LinkButton
        to={getPath(props.location, page - 1)}
        disabled={page <= 1}>Prev</LinkButton>
        
      <LinkButton
        to={getPath(props.location, page + 1)}
        disabled={page >= pages}>Next</LinkButton>
      <div className='c-event-audit-pagination-label'>
        Page {page} of {pages}
      </div>
    </div>
  )

}
