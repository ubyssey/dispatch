import React from 'react'

import { Tabs, Tab } from '@blueprintjs/core'

import BasicFieldsTab from './tabs/BasicFieldsTab'
import FeaturedImageTab from '../Editor/tabs/FeaturedImageTab'
import SEOTab from '../Editor/tabs/SEOTab'

require('../../../styles/components/article_sidebar.scss')

export default function PageSidebar(props) {
  return (
    <div className='c-article-sidebar'>
      <Tabs>
        <Tab
          id='basic'
          className='c-article-sidebar__tab'
          title='Basic fields'
          panel={
            <BasicFieldsTab
              update={props.update}
              section={props.page.section}
              authors={props.page.authors || []}
              tags={props.page.tags || []}
              topic={props.page.topic}
              slug={props.page.slug}
              snippet={props.page.snippet}
              errors={props.errors} />
          } />

        <Tab
          id='featured-image'
          className='c-article-sidebar__tab'
          title='Featured image'
          panel={
            <FeaturedImageTab
              update={props.update}
              featured_image={props.page.featured_image}
              entities={props.entities} />
          } />

        <Tab
          id='seo'
          className='c-article-sidebar__tab'
          title='SEO'
          panel={
            <SEOTab
              update={props.update}
              headline={props.page.headline}
              slug={props.page.slug}
              seo_keyword={props.page.seo_keyword || ''}
              seo_description={props.page.seo_description || ''} />
          } />
      </Tabs>
    </div>
  )
}
