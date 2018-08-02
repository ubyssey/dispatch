import React from 'react'

import { Tabs, TabList, Tab, TabPanel } from '@blueprintjs/core'

import BasicFieldsTab from './tabs/BasicFieldsTab'
import FeaturedImageTab from '../Editor/tabs/FeaturedImageTab'
// import FeaturedVideoTab from '../Editor/tabs/FeaturedVideoTab'
import DeliveryTab from '../Editor/tabs/DeliveryTab'
import TemplateTab from '../Editor/tabs/TemplateTab'
import SEOTab from '../Editor/tabs/SEOTab'

require('../../../styles/components/article_sidebar.scss')

const tabData = [
  {
    icon: 'pt-icon-application',
    title: 'Basic fields',
    errors: ['slug', 'section_id', 'author_ids', 'tag_ids', 'topic_ids' ,'snippet']
  },
  {
    icon: 'pt-icon-media',
    title: 'Featured image',
    errors: []
  },
  // {
  //   icon: 'pt-icon-video',
  //   title: 'Featured video',
  //   errors: []
  // },
  {
    icon: 'pt-icon-envelope',
    title: 'Delivery',
    errors: []
  },
  {
    icon: 'pt-icon-widget',
    title: 'Template',
    errors: ['instructions', 'header_layout', 'description', 'timeline_date']
  },
  {
    icon: 'pt-icon-media',
    title: 'SEO',
    errors: []
  }
]

function tabHighlight(localErrors, errors) {
  for (const error of localErrors) {
    if (errors.includes(error)){
      return 'c-article-sidebar__tab-error'
    }
  }
  return ''
}

function renderTab(data, index, errors) {
  return <Tab key={index} className={'c-article-sidebar__tab ' + tabHighlight(data.errors, errors)}><span className={'pt-icon-standard ' + data.icon} />{data.title}</Tab>
}

export default function ArticleSidebar(props) {
  return (
    <div className='c-article-sidebar'>
      <Tabs>
        <TabList className='c-article-sidebar__tablist'>
          {tabData.map((data, index) => (renderTab(data, index, Object.keys(props.errors))))}
        </TabList>

        <TabPanel className='c-article-sidebar__panel'>
          <BasicFieldsTab
            update={props.update}
            section={props.article.section}
            authors={props.article.authors || []}
            tags={props.article.tags || []}
            column={props.article.column}
            topic={props.article.topic}
            slug={props.article.slug}
            snippet={props.article.snippet}
            errors={props.errors} />
        </TabPanel>

        <TabPanel className='c-article-sidebar__panel'>
          <FeaturedImageTab
            update={props.update}
            featured_image={props.article.featured_image}
            entities={props.entities} />
        </TabPanel>

        {/* uncomment when featured videos are ready */}
        {/* <TabPanel className='c-article-sidebar__panel'>
          <FeaturedVideoTab
            update={props.update}
            featured_video={props.article.featured_video}
            entities={props.entities} />
        </TabPanel> */}

        <TabPanel className='c-article-sidebar__panel'>
          <DeliveryTab
            update={props.update}
            importance={props.article.importance}
            reading_time={props.article.reading_time}
            integrations={props.article.integrations}
            is_breaking={props.article.is_breaking}
            breaking_timeout={props.article.breaking_timeout}
            availableIntegrations={props.integrations} />
        </TabPanel>

        <TabPanel className='c-article-sidebar__panel'>
          <TemplateTab
            update={props.update}
            template={props.article.template || 'default'}
            data={props.article.template_data || {}}
            errors={props.errors} />
        </TabPanel>

        <TabPanel className='c-article-sidebar__panel'>
          <SEOTab
            update={props.update}
            headline={props.article.headline}
            slug={props.article.slug}
            seo_keyword={props.article.seo_keyword || ''}
            seo_description={props.article.seo_description || ''} />
        </TabPanel>
      </Tabs>
    </div>
  )
}
