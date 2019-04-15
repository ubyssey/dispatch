import React from 'react'
import DocumentTitle from 'react-document-title'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'
import { Intent } from '@blueprintjs/core'

import { LinkButton } from '../components/inputs'
import Panel from '../components/Panel'

import * as dashboardActions from '../actions/DashboardActions'

require('../../styles/components/dashboard.scss')

class DashboardPageComponent extends React.Component {

  componentWillMount() {
    this.props.fetchActions(this.props.token)
    this.props.fetchRecent(this.props.token)
  }

  renderActivity() {
    return this.props.actions.data.map(
      (elem, i) => (
        <li key={i} className='c-dashboard__activity__item'>
          <div className='c-dashboard__activity__item__icon'>
            <span className={`bp3-icon-standard bp3-icon-${elem.icon}`} aria-hidden='true' />
          </div>
          <div className='c-dashboard__activity__item__text'>
            <span className='c-dashboard__activity__item__text__person'>{elem.meta.author}</span>
            {elem.meta.count == 1 ? ` ${elem.meta.action} ` : ` made ${elem.meta.count} ${elem.meta.action} to ` }
            <Link to={`articles/${elem.meta.id}`} dangerouslySetInnerHTML={{__html: elem.meta.headline}} />
            <span className='c-dashboard__leftlistspan'>{` ${moment(elem.timestamp).from(moment())}`}</span>
          </div>
        </li>
      )
    )
  }

  renderRecent() {
    return this.props.recent.ids.map((id) => this.props.entities.articles[id])
      .map((article, i) => (
        <li key={i} className='c-dashboard_recent-articles__item'>
          <Link to={`/articles/${article.id}`} dangerouslySetInnerHTML={{__html: article.headline}} />
        </li>
      )
      )
  }

  render() {

    return (
      <DocumentTitle title='Dispatch'>
        <div className='c-dashboard'>
          <div className='c-dashboard__activity'>
            <h2 className='c-dashboard__header'>Latest Activity</h2>
            <ul>{this.props.actions.isLoaded ? this.renderActivity() : null}</ul>
          </div>
          <div className='c-dashboard__sidebar'>
            <h2 className='c-dashboard__header'>Quick Actions</h2>
            <ul className='c-dashboard_quick-actions'>
              <li className='c-dashboard_quick-actions__item'>
                <LinkButton
                  to='/articles/new/'
                  icon='add'
                  intent={Intent.SUCCESS}>New Article</LinkButton>
              </li>
              <li className='c-dashboard_quick-actions__item'>
                <LinkButton
                  to='/pages/new/'
                  icon='add'
                  intent={Intent.SUCCESS}>New Page</LinkButton>
              </li>
            </ul>
            <Panel title='Recent Articles'>
              <ul>{this.props.recent.isLoaded ? this.renderRecent() : null}</ul>
            </Panel>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

const mapStateToProps = (state) => ({
  token: state.app.auth.token,
  actions: state.app.dashboard.actions,
  recent: state.app.dashboard.recent,
  entities: {
    articles: state.app.entities.articles
  }
})

const mapDispatchToProps = (dispatch) => ({
  fetchActions: (token) => dispatch(dashboardActions.getUserActions(token)),
  fetchRecent: (token) => dispatch(dashboardActions.getRecentArticles(token))
})

const DashboardPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPageComponent)

export default DashboardPage
