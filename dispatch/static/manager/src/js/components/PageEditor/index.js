import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { withRouter } from 'react-router'
import DocumentTitle from 'react-document-title'

import pagesActions from '../../actions/PagesActions'
import * as modalActions from '../../actions/ModalActions'

import { confirmNavigation } from '../../util/helpers'

import PageToolbar from './PageToolbar'
import PageContentEditor from './PageContentEditor'
import PageSidebar from './PageSidebar'

require('../../../styles/components/article_editor.scss')

const NEW_PAGE_ID = 'new'

class PageEditorComponent extends React.Component {

  componentDidMount() {
    if (this.props.isNew) {
      this.props.setPage({ id: NEW_PAGE_ID })
    } else {
      this.loadPage()
    }
    
    confirmNavigation(
      this.props.router,
      this.props.route,
      () => !this.props.page.isSaved
    )
  }

  componentDidUpdate(prevProps) {
    if (!this.props.isNew) {
      if (prevProps.pageId !== this.props.pageId
        || this.getVersion() != this.getVersion(prevProps)) {
        this.loadPage()
      } else if (this.versionComparison(prevProps)) {
        this.setVersion(this.getLatestVersionFromPage())
      }
    }
  }

  getLatestVersionFromPage(props) {
    props = props || this.props
    const a = R.prop(props.pageId, props.entities.local || {}) ||
      R.prop(props.pageId, props.entities.remote || {})
    return a ? a.latest_version : null
  }

  versionComparison(prevProps) {
    const prev = this.getLatestVersionFromPage(prevProps)
    const now = this.getLatestVersionFromPage(this.props)
    if (prev && now && prev !== now) {
      return now
    }
    return false
  }

  loadPage() {
    const version = this.getVersion()
    let query = null
    if (version) {
      query = { version }
    }
    this.props.getPage(this.props.token, this.props.pageId, query)
  }


  getPage() {
    if (!this.props.entities.local) {
      return false
    }

    var page
    if (this.props.isNew) {
      page = this.props.entities.local[NEW_PAGE_ID]
    } else {
      page = this.props.entities.local[this.props.pageId] ||
        R.path(['entities','remote',this.props.pageId], this.props) || false
    }

    return page
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

  savePage() {
    if (this.props.isNew) {
      this.props.createPage(this.props.token, this.getPage())
    } else {
      this.props.savePage(
        this.props.token,
        this.props.pageId,
        this.getPage()
      )
    }
  }

  publishPage() {
    this.props.publishPage(
      this.props.token,
      this.props.pageId,
      this.getPage()
    )
  }

  unpublishPage() {
    this.props.unpublishPage(
      this.props.token,
      this.props.pageId
    )
  }

  previewPage() {
    this.props.previewPage(
      this.props.token,
      this.props.pageId,
      this.getPage()
    )
  }

  handleUpdate(field, value) {
    this.props.setPage(R.assoc(field, value, this.getPage()))
  }

  render() {

    const page = this.getPage()

    if (!page) {
      return (<div>Loading</div>)
    }
    const title = this.props.isNew ? 'New page' : `Edit - ${page.title}`

    return (
      <DocumentTitle title={title}>
        <div className='u-container-main'>
          <PageToolbar
            savePage={() => this.savePage()}
            publishPage={() => this.publishPage()}
            unpublishPage={() => this.unpublishPage()}
            previewPage={() => this.previewPage()}
            getVersion={(version) => this.setVersion(version)}
            page={page}
            isNew={this.props.isNew} />
          <div className='u-container-editor'>
            <PageContentEditor
              page={page}
              errors={this.props.page.errors}
              isNew={this.props.isNew}
              onUpdate={(field, value) => this.handleUpdate(field, value)}
              openModal={this.props.openModal}
              closeModal={this.props.closeModal} />
            <PageSidebar
              page={page}
              entities={this.props.entities}
              errors={this.props.page.errors}
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
    page: state.app.pages.single,
    editorState: state.app.editor,
    entities: {
      remote: state.app.entities.pages,
      local: state.app.entities.local.pages,
      images: state.app.entities.images
    },
    integrations: state.app.integrations.integrations,
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPage: (token, pageId, params) => {
      dispatch(pagesActions.get(token, pageId, params))
    },
    setPage: (page) => {
      dispatch(pagesActions.set(page))
    },
    savePage: (token, pageId, data) => {
      dispatch(pagesActions.save(token, pageId, data))
    },
    createPage: (token, data) => {
      dispatch(pagesActions.create(token, data, 'pages'))
    },
    publishPage: (token, pageId, data) => {
      dispatch(pagesActions.publish(token, pageId, data))
    },
    unpublishPage: (token, pageId) => {
      dispatch(pagesActions.unpublish(token, pageId))
    },
    previewPage: (token, pageId, data) => {
      dispatch(pagesActions.preview(token, pageId, data))
    },
    openModal: (component, props) => {
      dispatch(modalActions.openModal(component, props))
    },
    closeModal: () => {
      dispatch(modalActions.closeModal())
    },
    push: (loc) => {
      dispatch(push(loc))
    }
  }
}

const PageEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageEditorComponent)

export default withRouter(PageEditor)
