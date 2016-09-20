import React from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'

import * as articlesActions from '../actions/ArticlesActions'

import Toolbar from '../components/Toolbar.jsx'
import ArticleList from '../components/ArticleList.jsx'
import ArticleListHeader from '../components/ArticleListHeader.jsx'

export default class ArticlesPageComponent extends React.Component {

  constructor(props) {
    super(props)

    this.handleDeleteArticles = this.handleDeleteArticles.bind(this)
  }

  getQuery() {
    return {
      section: this.props.location.query.section,
      limit: 15
    }
  }

  componentWillMount() {
    // Fetch articles
    this.props.fetchArticles(this.getQuery())
    this.props.clearSelectedArticles()
  }

  componentDidUpdate(prevProps) {
    // Fetch articles
    if (prevProps.location.query.section !== this.props.location.query.section) {
      this.props.fetchArticles(this.getQuery())
      this.props.clearSelectedArticles()
    }
  }

  handleDeleteArticles(articleIds) {
    this.props.deleteArticles(this.props.token, articleIds)
    this.props.clearSelectedArticles()
  }

  render() {
    const articles = this.props.articles.data.map( id => this.props.entities.articles[id] )
    const section = this.props.entities.sections[this.props.location.query.section]
    const title = section ? `${section.name} - Articles` : 'Articles'

    return (
      <DocumentTitle title={title}>
        <div className='u-flex u-flex--col'>
          <ArticleListHeader
            articles={this.props.articles}
            toggleAllArticles={this.props.toggleAllArticles}
            deleteArticles={this.handleDeleteArticles} />
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
    token: state.app.auth.token,
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
    },
    deleteArticles: (token, articleIds) => {
      dispatch(articlesActions.deleteArticles(token, articleIds))
    }
  }
}

const ArticlesPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticlesPageComponent)

export default ArticlesPage
