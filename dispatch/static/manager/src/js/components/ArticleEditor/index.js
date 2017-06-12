import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { withRouter } from 'react-router'

import articlesActions from '../../actions/ArticlesActions'
import * as editorActions from '../../actions/EditorActions'
import * as modalActions from '../../actions/ModalActions'
import * as integrationActions from '../../actions/IntegrationActions'

import ArticleToolbar from './ArticleToolbar'
import ArticleContentEditor from './ArticleContentEditor'
import ArticleSidebar from './ArticleSidebar'

require('../../../styles/components/article_editor.scss')

const NEW_ARTICLE_ID = 'new'

class ArticleEditorComponent extends React.Component {

  constructor(props) {
    super(props)

    this.toggleStyle = this.toggleStyle.bind(this)

    this.state = { isSaved: true }
  }

  componentWillMount() {
    if (this.props.isNew) {
      this.props.setArticle({ id: NEW_ARTICLE_ID })
    } else {
      this.props.getArticle(this.props.token, this.props.articleId)
    }

    this.props.fetchIntegration(this.props.token, 'fb-instant-articles')
  }

  componentDidMount() {
    this.props.router.setRouteLeaveHook(
      this.props.route,
      () => !this.state.isSaved ?
        'Unsaved changes. Are you sure you want to leave?' : null)
  }

  componentDidUpdate(prevProps) {
    if (!this.props.isNew) {
      if (prevProps.articleId !== this.props.articleId) {
        this.props.getArticle(this.props.token, this.props.articleId)

        this.props.fetchIntegration(this.props.token, 'fb-instant-articles')
      }
    }
  }

  getArticle() {
    var article
    if (this.props.isNew) {
      article = this.props.entities.local[NEW_ARTICLE_ID]
    } else {
      article = this.props.entities.local[this.props.articleId] ||
        this.props.entities.remote[this.props.articleId] || false
    }

    if (!article) {
      return false
    }

    return R.merge({ _content: this.props.editorState.getCurrentContent() }, article)
  }

  saveArticle() {
    this.setState({ isSaved: true }, () => {
      if (this.props.isNew) {
        this.props.createArticle(this.props.token, this.getArticle())
      } else {
        this.props.saveArticle(
          this.props.token,
          this.props.articleId,
          this.getArticle()
        )
      }
    })
  }

  publishArticle() {
    this.setState({ isSaved: true }, () => {
      this.props.publishArticle(
        this.props.token,
        this.props.articleId,
        this.getArticle()
      )
    })
  }

  unpublishArticle() {
    this.props.unpublishArticle(
      this.props.token,
      this.props.articleId
    )
  }

  previewArticle() {
    this.setState({ isSaved: true }, () => {
      this.props.previewArticle(
        this.props.token,
        this.props.articleId,
        this.getArticle()
      )
    })
  }

  toggleStyle(style) {
    this.props.toggleEditorStyle(style)
  }

  handleUpdate(field, value) {
    this.setState({ isSaved: false }, () => {
      this.props.setArticle(R.assoc(field, value, this.getArticle()))
    })
  }

  getArticleVersion(version) {
    return this.props.getArticle(
      this.props.token,
      this.props.articleId,
      { version: version }
    )
  }

  render() {

    const article = this.getArticle()

    if (!article) {
      return (<div>Loading</div>)
    }

    const title = this.props.isNew ? 'New article' : `Edit - ${article.headline}`

    return (
      <DocumentTitle title={title}>
        <div className='u-container-main'>
          <ArticleToolbar
            saveArticle={() => this.saveArticle()}
            publishArticle={() => this.publishArticle()}
            unpublishArticle={() => this.unpublishArticle()}
            previewArticle={() => this.previewArticle()}
            getVersion={(version) => this.getArticleVersion(version)}
            article={article}
            isNew={this.props.isNew} />
          <div className='u-container-editor'>
            <ArticleContentEditor
              article={article}
              errors={this.props.article.errors}
              isNew={this.props.isNew}
              onUpdate={(field, value) => this.handleUpdate(field, value)}
              openModal={this.props.openModal}
              closeModal={this.props.closeModal} />
            <ArticleSidebar
              article={article}
              entities={this.props.entities}
              errors={this.props.article.errors}
              integrations={this.props.integrations}
              update={(field, value) => this.handleUpdate(field, value)} />
          </div>
        </div>
      </DocumentTitle>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    article: state.app.articles.single,
    editorState: state.app.editor,
    entities: {
      remote: state.app.entities.articles,
      local: state.app.entities.local.articles,
      images: state.app.entities.images
    },
    integrations: state.app.integrations.integrations,
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getArticle: (token, articleId, params) => {
      dispatch(articlesActions.get(token, articleId, params))
    },
    setArticle: (article) => {
      dispatch(articlesActions.set(article))
    },
    saveArticle: (token, articleId, data) => {
      dispatch(articlesActions.save(token, articleId, data))
    },
    createArticle: (token, data) => {
      dispatch(articlesActions.create(token, data, 'articles'))
    },
    publishArticle: (token, articleId, data) => {
      dispatch(articlesActions.publish(token, articleId, data))
    },
    unpublishArticle: (token, articleId) => {
      dispatch(articlesActions.unpublish(token, articleId))
    },
    previewArticle: (token, articleId, data) => {
      dispatch(articlesActions.preview(token, articleId, data))
    },
    openModal: (component, props) => {
      dispatch(modalActions.openModal(component, props))
    },
    closeModal: () => {
      dispatch(modalActions.closeModal())
    },
    toggleEditorStyle: (style) => {
      dispatch(editorActions.toggleEditorStyle(style))
    },
    fetchIntegration: (token, integrationId) => {
      dispatch(integrationActions.fetchIntegration(token, integrationId))
    }
  }
}

const ArticleEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ArticleEditorComponent))

export default ArticleEditor
