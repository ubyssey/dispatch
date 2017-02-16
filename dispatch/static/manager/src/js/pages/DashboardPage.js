import React from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router'
import { connect } from 'react-redux'
import moment from 'moment'
import * as dashboardActions from '../actions/DashboardActions'
import { LinkButton } from '../components/inputs'

class DashboardPageComponent extends React.Component {

  componentWillMount() {
    this.props.fetchActions(this.props.token)
    this.props.fetchRecent(this.props.token)
  }

  render() {

    //returns the user history if the data is loaded, else returns an empty list element
    const historyList = this.props.actions.isLoaded
    ? this.props.actions.data.map((elem,ind) => (
      <li key={ind} className="c-dashboard_container__leftlistitem">
        <i className={`fa fa-${elem.icon} c-dashboard_container__leftlisticon`} aria-hidden="true"></i>
        {elem.meta.author}
        {elem.meta.count == 1 ? ` ${elem.meta.action} ` : ` made ${elem.meta.count} ${elem.meta.action} to ` }
        <Link to={`articles/${elem.meta.id}`} dangerouslySetInnerHTML={{__html: elem.meta.headline}}/>
        <span className="c-dashboard_container__leftlistspan">{` ${moment(elem.timestamp).from(moment())}`}</span>
      </li>))
    : <li></li>

    //Returns a list of the user's recent articles if the data is loaded, else returns an empty list element
    const recentArticlesList = this.props.recent.isLoaded
    ? this.props.recent.data.map((elem,ind) => (
      <li key={ind} className="c-dashboard_recent_articles__listitem">
        <Link to={`/articles/${elem.id}`} dangerouslySetInnerHTML={{__html: elem.headline}} />
      </li>
    ))
    : <li></li>

    return (
      <DocumentTitle title='Dashboard'>
        <div className="c-dashboard_container">
          <div className="c-dashboard_container__left">
            <h2 className="c-dashboard__header">Latest Activity</h2>
            <ul>
              {historyList}
            </ul>
          </div>
          <div className="c-dashboard_container__right">
            <h2 className="c-dashboard__header">Quick Actions</h2>
            <div className="c-dashboard_quick_actions">
              <ul>
                <li className="c-dashboard_quick_actions__listitem"><LinkButton to={`/articles/new`}>New Article</LinkButton></li>
                <li className="c-dashboard_quick_actions__listitem"><LinkButton to={``}>New Page</LinkButton></li>
              </ul>
            </div>
            <div className="c-dashboard_recent_articles">
              <h2 className="c-dashboard__header c-dashboard_recent_articles__header">Recent Articles</h2>
              <ul>
                {recentArticlesList}
              </ul>
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
