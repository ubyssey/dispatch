import React from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'

import * as articlesActions from '../actions/ArticlesActions'

import Toolbar from '../components/Toolbar.jsx'
import ArticleList from '../components/ArticleList.jsx'
import ArticleListHeader from '../components/ArticleListHeader.jsx'

export default class ArticlesPageComponent extends React.Component {

  componentWillMount() {
    // Fetch articles
    this.props.fetchArticles({section: this.props.location.query.section})
    this.props.clearSelectedArticles()
  }

  componentDidUpdate(prevProps) {
    // Fetch articles
    if (prevProps.location.query.section !== this.props.location.query.section) {
      this.props.fetchArticles({section: this.props.location.query.section})
      this.props.clearSelectedArticles()
    }
  }

  render() {
    const articles = this.props.articles.data.map( id => this.props.entities.articles[id] )
    const section = this.props.entities.sections[this.props.location.query.section]

    return (
      <DocumentTitle title={`test - Articles`}>
        <div>
          <ArticleListHeader
            articles={this.props.articles}
            toggleAllArticles={this.props.toggleAllArticles} />
          <ArticleList
            articles={articles}
            isLoading={this.props.articles.isLoading}
            selected={this.props.articles.selected}
            toggleArticle={this.props.toggleArticle} />
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
    },
    toggleArticle: (articleId) => {
      dispatch(articlesActions.toggleArticle(articleId))
    },
    toggleAllArticles: (articleIds) => {
      dispatch(articlesActions.toggleAllArticles(articleIds))
    },
    clearSelectedArticles: () => {
      dispatch(articlesActions.clearSelectedArticles())
    }
  }
}

const ArticlesPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticlesPageComponent)

export default ArticlesPage
