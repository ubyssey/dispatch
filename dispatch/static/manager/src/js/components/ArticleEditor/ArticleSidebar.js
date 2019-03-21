import React from 'react'

import { Tabs, Tab } from '@blueprintjs/core'

import BasicFieldsTab from './tabs/BasicFieldsTab'
import FeaturedMediaTab from '../Editor/tabs/FeaturedMediaTab'
import DeliveryTab from '../Editor/tabs/DeliveryTab'
import TemplateTab from '../Editor/tabs/TemplateTab'
import SEOTab from '../Editor/tabs/SEOTab'
import { desktopSize } from '../../util/helpers'

require('../../../styles/components/article_sidebar.scss')

const BASIC_ERRORS =  ['slug', 'section_id', 'author_ids', 'tag_ids', 'topic_ids' ,'snippet']
const TEMPLATE_ERRORS = ['instructions', 'header_layout', 'description', 'timeline_date']

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

  renderSideBar() {
    const errors = Object.keys(this.props.errors)
    return (
      <div style={{height: '100%'}}>
        <Tabs>
          <Tab
            id='basic'
            className={'c-article-sidebar__tab ' + this.tabHighlight(BASIC_ERRORS, errors)}
            title='Basic fields'
            panel={
              <BasicFieldsTab
                update={this.props.update}
                section={this.props.article.section}
                authors={this.props.article.authors || []}
                tags={this.props.article.tags || []}
                topic={this.props.article.topic}
                subsection={this.props.article.subsection}
                slug={this.props.article.slug}
                snippet={this.props.article.snippet}
                errors={this.props.errors} />
            } />

          <Tab
            id='featured-media'
            className='c-article-sidebar__tab'
            title='Featured Media'
            panel={
              <FeaturedMediaTab
                update={this.props.update}
                article={this.props.article}
                entities={this.props.entities} />
            } />

          <Tab
            id='delivery'
            className='c-article-sidebar__tab'
            title='Delivery'
            panel={
              <DeliveryTab
                update={this.props.update}
                importance={this.props.article.importance}
                reading_time={this.props.article.reading_time}
                integrations={this.props.article.integrations}
                is_breaking={this.props.article.is_breaking}
                breaking_timeout={this.props.article.breaking_timeout}
                availableIntegrations={this.props.integrations} />
            } />

          <Tab
            id='template'
            className={'c-article-sidebar__tab ' + this.tabHighlight(TEMPLATE_ERRORS, errors)}
            title='Template'
            panel={
              <TemplateTab
                update={this.props.update}
                template={this.props.article.template || 'default'}
                data={this.props.article.template_data || {}}
                errors={this.props.errors} />
            } />

          <Tab
            id='seo'
            className='c-article-sidebar__tab'
            title='SEO'
            panel={
              <SEOTab
                update={this.props.update}
                headline={this.props.article.headline}
                slug={this.props.article.slug}
                seo_keyword={this.props.article.seo_keyword || ''}
                seo_description={this.props.article.seo_description || ''} />
            } />
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
            className='nav-padded bp3-icon-standard bp3-icon-sidebar bp3-icon-menu' /> }
        </div>
    )
  }
}

export default ArticleSidebar
