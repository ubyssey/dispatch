import React from 'react'
import DocumentTitle from 'react-document-title'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'

import * as dashboardActions from '../actions/DashboardActions'
import { LinkButton } from '../components/inputs'

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
            <span className={`pt-icon-standard pt-icon-${elem.icon}`} aria-hidden='true' />
          </div>
          <div className='c-dashboard__activity__item__text'>
            <span className='c-dashboard__activity__item__text__person'>{elem.meta.author}</span>
            {elem.meta.count == 1 ? ` ${elem.meta.action} ` : ` made ${elem.meta.count} ${elem.meta.action} to ` }
            <Link to={`articles/${elem.meta.id}`} dangerouslySetInnerHTML={{__html: elem.meta.headline}}/>
            <span className='c-dashboard__leftlistspan'>{` ${moment(elem.timestamp).from(moment())}`}</span>
          </div>
        </li>
      )
    )
  }

  renderRecent() {
    return this.props.recent.data.map(
      (elem, i) => (
        <li key={i} className='c-dashboard_recent-articles__item'>
          <Link to={`/articles/${elem.id}`} dangerouslySetInnerHTML={{__html: elem.headline}} />
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
              <li className='c-dashboard_quick-actions__item'><LinkButton to='/articles/new'>New Article</LinkButton></li>
              <li className='c-dashboard_quick-actions__item'><LinkButton to=''>New Page</LinkButton></li>
            </ul>
            <div className='c-dashboard_recent-articles'>
              <h2 className='c-dashboard__header c-dashboard_recent-articles__header'>Recent Articles</h2>
              <ul>{this.props.recent.isLoaded ? this.renderRecent() : null}</ul>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

const mapStateToProps = (state) => ({
  token: state.app.auth.token,
  actions: state.app.dashboard.actions,
  recent: state.app.dashboard.recent
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
