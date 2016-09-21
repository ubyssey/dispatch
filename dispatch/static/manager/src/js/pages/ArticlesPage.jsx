import React from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'

import * as articlesActions from '../actions/ArticlesActions'

import ItemList from '../components/ItemList.jsx'

const DEFAULT_LIMIT = 15

export default class ArticlesPageComponent extends React.Component {

  constructor(props) {
    super(props)

    this.handleDeleteArticles = this.handleDeleteArticles.bind(this)
  }

  getQuery() {
    var query = {
      limit: DEFAULT_LIMIT,
      offset: (this.getCurrentPage() - 1) * DEFAULT_LIMIT
    }

    if (this.props.location.query.section) {
      query.section = this.props.location.query.section
    }

    return query
  }

  getCurrentPage() {
    return parseInt(this.props.location.query.page, 10) || 1
  }

  getTotalPages() {
    return Math.ceil(
      parseInt(this.props.articles.count, 10) / DEFAULT_LIMIT
    )
  }

  componentWillMount() {
    // Fetch articles
    this.props.fetchArticles(this.getQuery())
    this.props.clearSelectedArticles()
  }

  componentDidUpdate(prevProps) {
    if (this.isNewPage(prevProps, this.props)) {
      // Fetch articles
      this.props.fetchArticles(this.getQuery())
      this.props.clearSelectedArticles()
    }
  }

  isNewPage(prevProps, props) {
    // If page number or section have changed
    return prevProps.location.query.section !== props.location.query.section ||
      prevProps.location.query.page !== props.location.query.page
  }

  handleDeleteArticles(articleIds) {
    this.props.deleteArticles(this.props.token, articleIds)
    this.props.clearSelectedArticles()
  }

  render() {
    const section = this.props.entities.sections[this.props.location.query.section]
    const title = section ? `${section.name} - Articles` : 'Articles'

    return (
      <DocumentTitle title={title}>
        <ItemList
          data={this.props.articles.data}
          section={this.props.location.query.section}
          currentPage={this.getCurrentPage()}
          totalPages={this.getTotalPages()}
          entities={this.props.entities.articles}
          selected={this.props.articles.selected}
          isLoading={this.props.articles.isLoading}
          isAllSelected={this.props.articles.isAllSelected}
          toggleItem={this.props.toggleArticle}
          toggleAllItems={this.props.toggleAllArticles}
          deleteItems={this.handleDeleteArticles} />
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
