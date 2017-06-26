import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
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

  componentWillMount() {
    if (this.props.isNew) {
      this.props.setPage({ id: NEW_PAGE_ID })
    } else {
      this.props.getPage(this.props.token, this.props.pageId)
    }
  }

  componentDidMount() {
    confirmNavigation(
      this.props.router,
      this.props.route,
      () => !this.props.page.isCreatingNew && !this.page.article.isSaved
    )
  }

  componentDidUpdate(prevProps) {
    if (!this.props.isNew) {
      if (prevProps.pageId !== this.props.pageId) {
        this.props.getPage(this.props.token, this.props.pageId)

        this.props.fetchIntegration(this.props.token, 'fb-instant-pages')
      }
    }
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
        this.props.entities.remote[this.props.pageId] || false
    }

    if (!page) {
      return false
    }

    return R.merge({ _content: this.props.editorState.getCurrentContent() }, page)
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

  getPageVersion(version) {
    return this.props.getPage(
      this.props.token,
      this.props.pageId,
      { version: version }
    )
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
            getVersion={(version) => this.getPageVersion(version)}
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
    }
  }
}

const PageEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageEditorComponent)

export default withRouter(PageEditor)
