import React from 'react';
import { connect } from 'react-redux'

import * as articlesActions from '../actions/ArticlesActions'

import ArticleToolbar from '../components/ArticleToolbar.jsx';
import ArticleEditor from '../components/ArticleEditor.jsx'
import ArticleSidebar from '../components/ArticleSidebar.jsx'

export default class ArticlePageComponent extends React.Component {

  componentWillMount() {
    // Fetch article
    this.props.fetchArticle(this.props.params.articleId)
  }

  componentDidUpdate(prevProps) {

    // Fetch article
    if (prevProps.params.articleId !== this.props.params.articleId) {
      this.props.fetchArticle(this.props.params.articleId)
    }
  }

  render() {
    return (
      <div className='u-container-main'>
        <ArticleToolbar article={this.props.article.data} />
        <ArticleEditor article={this.props.article.data} />
        <ArticleSidebar article={this.props.article.data} />
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    article: state.app.articles.article
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchArticle: (articleId) => {
      dispatch(articlesActions.fetchArticle(articleId))
    }
  }
}

const ArticlePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticlePageComponent)

export default ArticlePage
