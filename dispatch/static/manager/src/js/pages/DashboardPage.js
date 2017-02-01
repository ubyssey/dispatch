import React from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router'
import { connect } from 'react-redux'
import * as dashboardActions from '../actions/DashboardActions'

class DashboardPageComponent extends React.Component {

  componentWillMount() {

  }

  render() {
    // let listItems = dummy_list_data.map(elem => {return (
    //   <li key=""></li>
    // )})
    //
    // let recentArticles = dummy_articles.map(elem => {return(
    //   <li key=""></li>
    // )})

    return (
      <DocumentTitle title='Dashboard'>
        <div>
          <div className="dashboard_left_side">
            <h2>Latest Activity</h2>
            <ul>
              {listItems}
            </ul>
          </div>
          <div className="dashboard_right_side">
            <h2>Quick Actions</h2>
            <div className="dashboard_quick_actions">
              <ul>
                <li><Link to={`/`}>New Article</Link></li>
                <li><Link to={`/`}>New Page</Link></li>
              </ul>
            </div>
            <div className="dashboard_recent_articles">
              <ul>
                {recentArticles}
              </ul>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    actions: state.app.user.actions,
    recent: state.app.user.recent
  }
}

const mapDispatchToProps = (dispatch) => {
  // return {
  //   fetchArticles: (token, query) => {
  //     dispatch(articlesActions.fetchArticles(token, query))
  //   },
  //   toggleArticle: (articleId) => {
  //     dispatch(articlesActions.toggleArticle(articleId))
  //   },
  //   toggleAllArticles: (articleIds) => {
  //     dispatch(articlesActions.toggleAllArticles(articleIds))
  //   },
  //   clearSelectedArticles: () => {
  //     dispatch(articlesActions.clearSelectedArticles())
  //   },
  //   deleteArticles: (token, articleIds) => {
  //     dispatch(articlesActions.deleteArticles(token, articleIds))
  //   },
  //   clearArticles: () => {
  //     dispatch(articlesActions.clearArticles())
  //   },
  //   searchArticles: (token, section, query) => {
  //     dispatch(articlesActions.searchArticles(section, query))
  //   }
  // }
}

const DashboardPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardPageComponent)

export default DashboardPage
