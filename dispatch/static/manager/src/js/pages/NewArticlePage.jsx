import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'

import * as articlesActions from '../actions/ArticlesActions'

import ArticleToolbar from '../components/ArticleToolbar.jsx'
import ArticleEditor from '../components/ArticleEditor.jsx'
import ArticleSidebar from '../components/ArticleSidebar.jsx'

const NEW_ARTICLE_ID = 'new'

export default class NewArticlePageComponent extends React.Component {

  constructor(props) {
    super(props)

    this.handleUpdate = this.handleUpdate.bind(this)
  }

  componentWillMount() {
    // Fetch article
    this.props.setArticle({
      id: NEW_ARTICLE_ID
    })
  }

  componentDidUpdate(prevProps) {
    // this.props.setArticle({
    //   id: NEW_ARTICLE_ID
    // })
  }

  getArticle() {
    return this.props.entities.article[NEW_ARTICLE_ID]
  }

  handleUpdate(field, value) {
    this.props.setArticle(R.assoc(field, value, this.getArticle()))
  }

  render() {
    const article = this.getArticle()

    if (article) {
      return (
        <DocumentTitle title='New Article'>
          <div className='u-container-main'>
            <ArticleToolbar article={article} />
            <div className='u-container-editor'>
              <ArticleEditor article={article} update={this.handleUpdate} />
              <ArticleSidebar article={article} update={this.handleUpdate} />
            </div>
          </div>
        </DocumentTitle>
      )
    } else {
      return null
    }
  }

}

const mapStateToProps = (state) => {
  console.log(state.app);
  return {
    article: state.app.articles.article,
    entities: {
      article: state.app.entities.article
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setArticle: (article) => {
      dispatch(articlesActions.setArticle(article))
    }
  }
}

const NewArticlePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewArticlePageComponent)

export default NewArticlePage
