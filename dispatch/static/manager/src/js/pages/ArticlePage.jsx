import React from 'react';
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title';

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
    const article = this.props.entities.article[this.props.params.articleId] ||
      this.props.entities.articles[this.props.params.articleId] || false

    if (!article) {
      return (<div>loading</div>)
    }

    return (
      <DocumentTitle title={`Edit - ${article.headline}`}>
        <div className='u-container-main'>
          <ArticleToolbar article={article} />
          <div className='u-container-editor'>
            <ArticleEditor article={article} />
            <ArticleSidebar article={article} />
          </div>
        </div>
      </DocumentTitle>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    article: state.app.articles.article,
    entities: {
      articles: state.app.entities.articles,
      article: state.app.entities.article
    }
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
