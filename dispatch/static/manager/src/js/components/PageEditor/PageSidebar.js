import React from 'react'

import { Tabs, TabList, Tab, TabPanel } from '@blueprintjs/core'

import BasicFieldsTab from './tabs/BasicFieldsTab'
import FeaturedImageTab from '../Editor/tabs/FeaturedImageTab'
import TemplateTab from '../Editor/tabs/TemplateTab'
import SEOTab from '../Editor/tabs/SEOTab'

require('../../../styles/components/article_sidebar.scss')

export default function PageSidebar(props) {
  return (
    <div className='c-article-sidebar'>
      <Tabs>
        <TabList className='c-article-sidebar__tablist'>
          <Tab className='c-article-sidebar__tab'><span className='pt-icon-standard pt-icon-application' />Basic fields</Tab>
          <Tab className='c-article-sidebar__tab'><span className='pt-icon-standard pt-icon-media' />Featured image</Tab>
          <Tab className='c-article-sidebar__tab'><span className='pt-icon-standard pt-icon-widget' />Template</Tab>
          <Tab className='c-article-sidebar__tab'><span className='pt-icon-standard pt-icon-social-media' />SEO</Tab>
        </TabList>

        <TabPanel className='c-article-sidebar__panel'>
          <BasicFieldsTab
            update={props.update}
            section={props.page.section}
            authors={props.page.authors || []}
            tags={props.page.tags || []}
            topic={props.page.topic}
            slug={props.page.slug}
            snippet={props.page.snippet}
            errors={props.errors} />
        </TabPanel>

        <TabPanel className='c-article-sidebar__panel'>
          <FeaturedImageTab
            update={props.update}
            featured_image={props.page.featured_image}
            entities={props.entities} />
        </TabPanel>

        <TabPanel className='c-article-sidebar__panel'>
          <TemplateTab
            update={props.update}
            template={props.page.template || 'default'}
            data={props.page.template_data || {}} />
        </TabPanel>

        <TabPanel className='c-article-sidebar__panel'>
          <SEOTab
            update={props.update}
            headline={props.page.headline}
            slug={props.page.slug}
            seo_keyword={props.page.seo_keyword || ''}
            seo_description={props.page.seo_description || ''} />
        </TabPanel>
      </Tabs>
    </div>
  )
}
