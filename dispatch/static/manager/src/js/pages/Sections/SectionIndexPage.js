import React from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'

import { Link } from 'react-router'

import { Intent } from '@blueprintjs/core'

import * as sectionsActions from '../../actions/SectionsActions'

import { LinkButton } from '../../components/inputs'
import ItemList from '../../components/ItemList'

const DEFAULT_LIMIT = 15

class SectionsPageComponent extends React.Component {

  getQuery() {
    var query = {
      limit: DEFAULT_LIMIT,
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

  getTotalSections() {
    return Math.ceil(
      parseInt(this.props.sections.count, 10) / DEFAULT_LIMIT
    )
  }

  componentWillMount() {
    // Fetch sections
    this.props.clearSections()
    this.props.clearSelectedSections()
    this.props.fetchSections(this.props.token, this.getQuery())
  }

  componentDidUpdate(prevProps) {

    if (this.isNewQuery(prevProps, this.props)) {
      this.props.clearSections()
      this.props.clearSelectedSections()
      this.props.fetchSections(this.props.token, this.getQuery())
    } else if (this.isNewPage(prevProps, this.props)) {
      // Fetch sections
      this.props.fetchSections(this.props.token, this.getQuery())
      this.props.clearSelectedSections()
    }
  }

  isNewQuery(prevProps, props) {
    return prevProps.location.query.q !== props.location.query.q
  }

  isNewPage(prevProps, props) {
    // Returns true if page number has changed
    return prevProps.location.query.page !== props.location.query.page
  }

  deleteSections(sectionIds) {
    this.props.deleteSections(this.props.token, sectionIds)
    this.props.clearSelectedSections()
  }

  render() {

    return (
      <DocumentTitle title='Sections'>
        <ItemList
          location={this.props.location}

          type='sections'

          currentPage={this.getCurrentPage()}
          totalPages={this.getTotalSections()}

          items={this.props.sections}
          entities={this.props.entities.sections}

          columns={[
            item => (<strong><Link to={`/sections/${item.id}`} dangerouslySetInnerHTML={{__html: item.name}} /></strong>),
            item => item.slug
          ]}

          emptyMessage={'You haven\'t created any sections yet.'}
          createHandler={() => (
            <LinkButton intent={Intent.SUCCESS} to={'sections/new'}>
              <span className='pt-icon-standard pt-icon-add'></span>Create section
            </LinkButton>)
          }

          actions={{
            toggleItem: this.props.toggleSection,
            toggleAllItems: this.props.toggleAllSections,
            deleteItems: (sectionIds) => this.deleteSections(sectionIds),
            searchItems: (query) => this.props.searchSections(query)
          }}

          />
      </DocumentTitle>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    sections: state.app.sections.list,
    entities: {
      sections: state.app.entities.sections
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSections: (token, query) => {
      dispatch(sectionsActions.fetchSections(token, query))
    },
    toggleSection: (sectionId) => {
      dispatch(sectionsActions.toggleSection(sectionId))
    },
    toggleAllSections: (sectionIds) => {
      dispatch(sectionsActions.toggleAllSections(sectionIds))
    },
    clearSelectedSections: () => {
      dispatch(sectionsActions.clearSelectedSections())
    },
    deleteSections: (token, sectionIds) => {
      dispatch(sectionsActions.deleteSections(token, sectionIds))
    },
    clearSections: () => {
      dispatch(sectionsActions.clearSections())
    },
    searchSections: (query) => {
      dispatch(sectionsActions.searchSections(query))
    }
  }
}

const SectionsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(SectionsPageComponent)

export default SectionsPage
