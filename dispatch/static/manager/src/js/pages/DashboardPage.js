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
      <li key={ind}>
        <i className={`fa fa-${elem.icon}`} aria-hidden="true"></i>
        {elem.meta.author}
        {elem.meta.count == 1 ? ` ${elem.meta.action} ` : ` made ${elem.meta.count} ${elem.meta.action} to ` }
        <a href={elem.meta.article_url}>{elem.meta.headline}</a>
        <span>{` ${moment(elem.timestamp).from(moment())}`}</span>
      </li>))
    : <li></li>

    //Returns a list of the user's recent articles if the data is loaded, else returns an empty list element
    const recentArticlesList = this.props.recent.isLoaded
    ? this.props.recent.data.map((elem,ind) => (
      <li key={ind}>
        <Link to={`/articles/${elem.id}`} dangerouslySetInnerHTML={{__html: elem.headline}} />
      </li>
    ))
    : <li></li>

    return (
      <DocumentTitle title='Dashboard'>
        <div className="dashboard_container">
          <div className="dashboard_left">
            <h2>Latest Activity</h2>
            <ul className="dashboard_user_history">
              {historyList}
            </ul>
          </div>
          <div className="dashboard_right">
            <h2>Quick Actions</h2>
            <div className="dashboard_quick_actions">
              <ul>
                <li><LinkButton to={`/articles/new`}>New Article</LinkButton></li>
                <li><LinkButton to={``}>New Page</LinkButton></li>
              </ul>
            </div>
            <div className="dashboard_recent_articles">
              <h2>Recent Articles</h2>
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
