import React from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router'
import { connect } from 'react-redux'
import * as dashboardActions from '../actions/DashboardActions'
import moment from 'moment'

class DashboardPageComponent extends React.Component {

  componentWillMount() {
    this.props.fetchActions(this.props.token)
  }

  render() {

    //returns the user history if the data is loaded, else returns an empty list element
    let historyList = this.props.actions.isLoaded
    ? this.props.actions.data.map((elem,ind) => (
      <li key={ind}>
        {elem.meta.author}
        {elem.meta.count == 1 ? ` ${elem.meta.action} ` : ` made ${elem.meta.count} ${elem.meta.action} to ` }
        <a href={elem.meta.article_url}>{elem.meta.headline}</a>
        {` ${moment(elem.timestamp).from(moment())}`}
      </li>))
    : <li></li>

    return (
      <DocumentTitle title='Dashboard'>
        <div>
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
                <li><Link to={`/`}>New Article</Link></li>
                <li><Link to={`/`}>New Page</Link></li>
              </ul>
            </div>
            <div className="dashboard_recent_articles">
              <ul>
              <li>a</li>
              <li>b</li>
              </ul>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }

}

const mapStateToProps = (state) => ({
  actions: state.app.dashboard
  // recent: state.app.user.recent
})

const mapDispatchToProps = (dispatch) => {
  //TODO: get actions action
  //TODO: get recent articles
    return {
      fetchActions: (token) => {
        console.log(`token`);
        console.log(token);
        dispatch(dashboardActions.getUserActions(token))
      }
    }
}

const DashboardPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPageComponent)

export default DashboardPage
