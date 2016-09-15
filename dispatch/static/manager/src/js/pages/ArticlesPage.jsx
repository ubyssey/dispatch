import React from 'react';
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title';

import * as articlesActions from '../actions/ArticlesActions'

import Toolbar from '../components/Toolbar.jsx';
import ArticleList from '../components/ArticleList.jsx';

export default class ArticlesPageComponent extends React.Component {

  componentWillMount() {
    // Fetch articles
    this.props.fetchArticles({section: this.props.location.query.section})
  }

  componentDidUpdate(prevProps) {
    // Fetch articles
    if (prevProps.location.query.section !== this.props.location.query.section) {
      this.props.fetchArticles({section: this.props.location.query.section})
    }
  }

  render() {
    return this.props.articles.isLoaded ? this.renderArticles() : this.renderLoading()
  }

  renderLoading() {
    return (
      <div>loading!</div>
    )
  }

  renderArticles() {
    const articles = this.props.articles.data.map( id => this.props.entities.articles[id] )
    const section = this.props.entities.sections[this.props.location.query.section]

    return (
      <DocumentTitle title={`${section.name} - Articles`}>
        <div>
          <Toolbar>
            test
          </Toolbar>
          <ArticleList articles={articles} />
        </div>
      </DocumentTitle>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    articles: state.app.articles.articles,
    entities: {
      articles: state.app.entities.articles,
      sections: state.app.entities.sections
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchArticles: (query) => {
      dispatch(articlesActions.fetchArticles(query))
    }
  }
}

const ArticlesPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticlesPageComponent)

export default ArticlesPage
