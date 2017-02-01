import React from 'react';
import DocumentTitle from 'react-document-title';

let dummy_list_data = []
let dummy_articles = []

export default class DashboardPage extends React.Component {

  render() {
    let listItems = dummy_list_data.map(elem => {return (
      <li key=""></li>
    )})

    let recentArticles = dummy_articles.map(elem => {return(
      <li key=""></li>
    )})
    
    return (
      <DocumentTitle title='Dashboard'>
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
      </DocumentTitle>
    )
  }

}
