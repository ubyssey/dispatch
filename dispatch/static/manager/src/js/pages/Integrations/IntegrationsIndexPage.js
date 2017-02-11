import React from 'react';
import DocumentTitle from 'react-document-title'

import SidebarNav from '../../components/SidebarNav'

const NAV_ITEMS = [
  { path: '/integrations/fb-instant-articles/', label: 'Facebook Instant Articles' }
]

export default function IntegrationsIndexPage(props) {
  return (
    <DocumentTitle title='Integrations'>
      <div className='u-container-main u-container-main--row'>
        <SidebarNav items={NAV_ITEMS} />
        <div className='u-container-body'>{props.children}</div>
      </div>
    </DocumentTitle>
  )
}
