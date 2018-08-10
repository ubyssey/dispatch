import React from 'react'

import { Tabs, TabList, Tab, TabPanel } from '@blueprintjs/core'

import BasicFieldsTab from './tabs/BasicFieldsTab'
import FeaturedImageTab from '../Editor/tabs/FeaturedImageTab'
// import FeaturedVideoTab from '../Editor/tabs/FeaturedVideoTab'
import DeliveryTab from '../Editor/tabs/DeliveryTab'
import TemplateTab from '../Editor/tabs/TemplateTab'
import SEOTab from '../Editor/tabs/SEOTab'
import { desktopSize } from '../../util/helpers'

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

class ArticleSidebar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false
    }
  }

  tabHighlight(localErrors, errors) {
    for (const error of localErrors) {
      if (errors.includes(error)) {
        return 'c-article-sidebar__tab-error'
      }
    }
    return ''
  }

  renderTab(data, index, errors) {
    return <Tab key={index} className={'c-article-sidebar__tab ' + this.tabHighlight(data.errors, errors)}><span className={'pt-icon-standard ' + data.icon} />{data.title}</Tab>
  }

  renderSideBar() {
    return (
      <div style={{height: '100%'}}>
        <Tabs>
          <TabList className='c-article-sidebar__tablist'>
            {tabData.map((data, index) => (this.renderTab(data, index, Object.keys(this.props.errors))))}
          </TabList>
  
          <TabPanel className='c-article-sidebar__panel'>
            <BasicFieldsTab
              update={this.props.update}
              section={this.props.article.section}
              authors={this.props.article.authors || []}
              tags={this.props.article.tags || []}
              topic={this.props.article.topic}
              slug={this.props.article.slug}
              snippet={this.props.article.snippet}
              errors={this.props.errors} />
          </TabPanel>
  
          <TabPanel className='c-article-sidebar__panel'>
            <FeaturedImageTab
              update={this.props.update}
              featured_image={this.props.article.featured_image}
              entities={this.props.entities} />
          </TabPanel>
  
          {/* uncomment when featured videos are ready */}
          {/* <TabPanel className='c-article-sidebar__panel'>
            <FeaturedVideoTab
              update={this.props.update}
              featured_video={this.props.article.featured_video}
              entities={this.props.entities} />
          </TabPanel> */}
  
          <TabPanel className='c-article-sidebar__panel'>
            <DeliveryTab
              update={this.props.update}
              importance={this.props.article.importance}
              reading_time={this.props.article.reading_time}
              integrations={this.props.article.integrations}
              is_breaking={this.props.article.is_breaking}
              breaking_timeout={this.props.article.breaking_timeout}
              availableIntegrations={this.props.integrations} />
          </TabPanel>
  
          <TabPanel className='c-article-sidebar__panel'>
            <TemplateTab
              update={this.props.update}
              template={this.props.article.template || 'default'}
              data={this.props.article.template_data || {}}
              errors={this.props.errors} />
          </TabPanel>
  
          <TabPanel className='c-article-sidebar__panel'>
            <SEOTab
              update={this.props.update}
              headline={this.props.article.headline}
              slug={this.props.article.slug}
              seo_keyword={this.props.article.seo_keyword || ''}
              seo_description={this.props.article.seo_description || ''} />
          </TabPanel>
        </Tabs>
      </div>
    )
  }
  
  render () {
    const isDesktop = window.document.body.clientWidth > desktopSize 
    const open = isDesktop ? '' : (this.state.isOpen ? 'open': 'closed')
    const sliderStyle = {
      position: 'absolute', 
      top: 0,
      left: '-42px', 
      padding: '13px', 
      backgroundColor: '#394b59', 
      borderRadius: '0 0 0 10px',
      color: 'white',
      cursor: 'pointer' }
    return (
        <div className={'c-article-sidebar ' + open}>
          { this.renderSideBar() }
          { !isDesktop && <span 
            onClick={() => this.setState(prevstate => ({isOpen: !prevstate.isOpen}))}
            style={sliderStyle}
            className='nav-padded pt-icon-standard pt-icon-sidebar pt-icon-menu' /> }
        </div>
    )
  }
}

export default ArticleSidebar