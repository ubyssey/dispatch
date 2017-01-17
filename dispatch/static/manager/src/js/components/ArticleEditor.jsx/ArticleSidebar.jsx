import React from 'react'

import { Tabs, TabList, Tab, TabPanel } from '@blueprintjs/core'

import ArticleBasicFields from './ArticleBasicFields.jsx'
import ArticleFeaturedImage from './ArticleFeaturedImage.jsx'
import ArticleDelivery from './ArticleDelivery.jsx'

export default function ArticleSidebar(props) {

  return (
    <div className='c-article-sidebar'>
      <Tabs>
        <TabList className='c-article-sidebar__tablist'>
          <Tab className='c-article-sidebar__tab'>Basic fields</Tab>
          <Tab className='c-article-sidebar__tab'>Featured image</Tab>
          <Tab className='c-article-sidebar__tab'>Delivery</Tab>
          <Tab className='c-article-sidebar__tab'>Template</Tab>
          <Tab className='c-article-sidebar__tab'>SEO</Tab>
        </TabList>

        <TabPanel className='c-article-sidebar__panel'>
          <ArticleBasicFields
            update={props.update}
            section={props.article.section}
            authors={props.article.authors || []}
            tags={props.article.tags || []}
            topic={props.article.topic}
            slug={props.article.slug}
            snippet={props.article.snippet} />
        </TabPanel>

        <TabPanel className='c-article-sidebar__panel'>
          <ArticleFeaturedImage
            update={props.update}
            featured_image={props.article.featured_image}
            entities={props.entities} />
        </TabPanel>

        <TabPanel className='c-article-sidebar__panel'>
          <ArticleDelivery
            update={props.update}
            importance={props.article.importance}
            reading_time={props.article.reading_time} />
        </TabPanel>

        <TabPanel className='c-article-sidebar__panel'>
          Fourth panel
        </TabPanel>

        <TabPanel className='c-article-sidebar__panel'>
          SEO panel
        </TabPanel>
      </Tabs>
    </div>
  )
}
