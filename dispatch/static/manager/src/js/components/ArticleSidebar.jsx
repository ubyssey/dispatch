import React from 'react'

import { Tabs, TabList, Tab, TabPanel } from '@blueprintjs/core'

import ArticleBasicFields from './ArticleBasicFields.jsx'

export default function ArticleSidebar(props) {
  
  console.log('article authors', props.article.authors)

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
            authors={props.article.authors}
            slug={props.article.slug}
            snippet={props.article.snippet} />
        </TabPanel>

        <TabPanel className='c-article-sidebar__panel'>
          Second panel
        </TabPanel>

        <TabPanel className='c-article-sidebar__panel'>
          Third panel
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
