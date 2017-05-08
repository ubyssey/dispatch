import React from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'

import { Link } from 'react-router'

import pagesActions from '../../actions/PagesActions'
import { humanizeDatetime } from '../../util/helpers'

import { LinkButton } from '../../components/inputs'
import ItemList from '../../components/ItemList'

const DEFAULT_LIMIT = 15

class PagesPageComponent extends React.Component {

  getQuery() {
    var query = {
      limit: DEFAULT_LIMIT,
      drafts: true,
      offset: (this.getCurrentPage() - 1) * DEFAULT_LIMIT
    }

    // If section is present, add to query
    if (this.props.location.query.section) {
      query.section = this.props.location.query.section
    }

    // If search query is present, add to query
    if (this.props.location.query.q) {
      query.q = this.props.location.query.q
    }

    return query
  }

  getCurrentPage() {
    return parseInt(this.props.location.query.page, 10) || 1
  }

  getTotalPages() {
    return Math.ceil(
      parseInt(this.props.pages.count, 10) / DEFAULT_LIMIT
    )
  }

  componentWillMount() {
    // Fetch pages
    this.props.clearPages()
    this.props.clearSelectedPages()
    this.props.listPages(this.props.token, this.getQuery())
  }

  componentDidUpdate(prevProps) {

    if (this.isNewQuery(prevProps, this.props)) {
      this.props.clearPages()
      this.props.clearSelectedPages()
      this.props.listPages(this.props.token, this.getQuery())
    }

    else if (this.isNewPage(prevProps, this.props)) {
      // Fetch pages
      this.props.listPages(this.props.token, this.getQuery())
      this.props.clearSelectedPages()
    }
  }

  isNewQuery(prevProps, props) {
    return prevProps.location.query.q !== props.location.query.q
  }

  isNewPage(prevProps, props) {
    // Returns true if page number has changed
    return prevProps.location.query.page !== props.location.query.page
  }

  deletePages(pageIds) {
    this.props.deletePages(this.props.token, pageIds)
    this.props.clearSelectedPages()
  }

  searchPages(query) {
    this.props.searchPages(this.props.token, this.props.location.query.section, query)
  }

  render() {

    return (
      <DocumentTitle title='Pages'>
        <ItemList
          location={this.props.location}

          type='pages'

          currentPage={this.getCurrentPage()}
          totalPages={this.getTotalPages()}

          items={this.props.pages}
          entities={this.props.entities.pages}

          columns={[
            item => (<strong><Link to={`/pages/${item.id}`} dangerouslySetInnerHTML={{__html: item.title}} /></strong>),
            item => humanizeDatetime(item.published_at),
            item => item.latest_version + ' revisions'
          ]}

          emptyMessage={'You haven\'t created any pages yet.'}
          createHandler={() => (<LinkButton to={'pages/new'}>Create page</LinkButton>)}

          actions={{
            toggleItem: this.props.togglePage,
            toggleAllItems: this.props.toggleAllPages,
            deleteItems: (pageIds) => this.deletePages(pageIds),
            searchItems: (query) => this.searchPages(query)
          }}

          />
      </DocumentTitle>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    pages: state.app.pages.list,
    entities: {
      pages: state.app.entities.pages
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listPages: (token, query) => {
      dispatch(pagesActions.list(token, query))
    },
    togglePage: (pageId) => {
      dispatch(pagesActions.toggle(pageId))
    },
    toggleAllPages: (pageIds) => {
      dispatch(pagesActions.toggleAll(pageIds))
    },
    clearSelectedPages: () => {
      dispatch(pagesActions.clearSelected())
    },
    clearPages: () => {
      dispatch(pagesActions.clearAll())
    },
    deletePages: (token, pageIds) => {
      dispatch(pagesActions.deleteMany(token, pageIds))
    },
    searchPages: (token, section, query) => {
      dispatch(pagesActions.search(section, query))
    }
  }
}

const PagesPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(PagesPageComponent)

export default PagesPage
