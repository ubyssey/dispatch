import React, { Component } from 'react'

import { Tabs, TabList, TabPanel } from '@blueprintjs/core'

import BasicFieldsTab from './tabs/BasicFieldsTab'
import FeaturedImageTab from '../Editor/tabs/FeaturedImageTab'
// import FeaturedVideoTab from '../Editor/tabs/FeaturedVideoTab'
import DeliveryTab from '../Editor/tabs/DeliveryTab'
import TemplateTab from '../Editor/tabs/TemplateTab'
import SEOTab from '../Editor/tabs/SEOTab'

class MobileArticleSidebar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false
    }
  }

  renderSideBar(open) {
    return (
      <div className={'c-article-sidebar' + open}>
        <Tabs>
          <TabList className='c-article-sidebar__tablist'>
            {this.props.tabData.map((data, index) => (this.props.renderTab(data, index, Object.keys(this.props.errors))))}
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
    return (
        <span 
          onClick={() => this.setState(prevstate => ({isOpen: !prevstate.isOpen}))}
          className='nav-padded pt-icon-standard pt-icon-menu '>
        { this.state.isOpen ? this.renderSideBar('open'): this.renderSideBar('closed') }
        </span>
    )
  }
}

export default MobileArticleSidebar