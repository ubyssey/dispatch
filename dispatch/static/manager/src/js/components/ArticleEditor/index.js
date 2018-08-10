import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import DocumentTitle from 'react-document-title'
import { withRouter } from 'react-router'

import articlesActions from '../../actions/ArticlesActions'
import * as modalActions from '../../actions/ModalActions'
import * as integrationActions from '../../actions/IntegrationActions'

import { confirmNavigation } from '../../util/helpers'

import ArticleToolbar from './ArticleToolbar'
import ArticleContentEditor from './ArticleContentEditor'
import ArticleSidebar from './ArticleSidebar'

require('../../../styles/components/article_editor.scss')

const NEW_ARTICLE_ID = 'new'

class ArticleEditorComponent extends React.Component {

  componentDidMount() {
    if (this.props.isNew) {
      this.props.setArticle({ id: NEW_ARTICLE_ID })
    } else {
      this.loadArticle()
    }

    this.props.fetchIntegration(this.props.token, 'fb-instant-articles')

    confirmNavigation(
      this.props.router,
      this.props.route,
      () => !this.props.article.isSaved
    )
  }

  componentDidUpdate(prevProps) {
    if (!this.props.isNew) {
      if (prevProps.articleId !== this.props.articleId
        || this.getVersion() != this.getVersion(prevProps)) {
        this.loadArticle()
        this.props.fetchIntegration(this.props.token, 'fb-instant-articles')
      } else if (this.versionComparison(prevProps)) {
        // article was updated, set the version query
        this.setVersion(this.getLatestVersionFromArticle())
      }
    }
  }

  getLatestVersionFromArticle(props) {
    props = props || this.props
    const a = R.prop(props.articleId, props.entities.local || {}) ||
      R.prop(props.articleId, props.entities.remote || {})
    return a ? a.latest_version : null
  }

  versionComparison(prevProps) {
    const prev = this.getLatestVersionFromArticle(prevProps)
    const now = this.getLatestVersionFromArticle(this.props)
    if (prev && now && prev !== now) {
      return now
    }
    return false
  }

  loadArticle() {
    const version = this.getVersion()
    let query = null
    if (version) {
      query = { version }
    }
    this.props.getArticle(this.props.token, this.props.articleId, query)
  }

  getArticle() {
    var article
    if (this.props.isNew) {
      article = this.props.entities.local[NEW_ARTICLE_ID]
    } else {
      article = this.props.entities.local[this.props.articleId] ||
        R.path(['entities','remote',this.props.articleId], this.props) || false
    }

    if (!article) {
      return false
    }

    return article
  }

  saveArticle() {
    if (this.props.isNew) {
      this.props.createArticle(this.props.token, this.getArticle())
    } else {
      this.props.saveArticle(
        this.props.token,
        this.props.articleId,
        this.getArticle()
      )
    }
  }

  publishArticle() {
    this.props.publishArticle(
      this.props.token,
      this.props.articleId,
      this.getArticle()
    )
  }

  unpublishArticle() {
    this.props.unpublishArticle(
      this.props.token,
      this.props.articleId
    )
  }

  previewArticle() {
    this.props.previewArticle(
      this.props.token,
      this.props.articleId,
      this.getArticle()
    )
  }

  handleUpdate(field, value) {
    this.props.setArticle(R.assoc(field, value, this.getArticle()))
  }

  toggleBreakingNews() {
    this.handleUpdate('is_breaking', !this.getArticle().is_breaking)
  }

  setVersion(version) {
    this.props.push({
      pathname: this.props.location.pathname,
      query: { v: version }
    })
  }

  getVersion(props) {
    props = props || this.props

    return props.location.query.v
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
            toggleBreakingNews={() => this.toggleBreakingNews()}
            getVersion={(version) => this.setVersion(version)}
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
    fetchIntegration: (token, integrationId) => {
      dispatch(integrationActions.fetchIntegration(token, integrationId))
    },
    push: (loc) => {
      dispatch(push(loc))
    }
  }
}

const ArticleEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleEditorComponent)

export default withRouter(ArticleEditor)
