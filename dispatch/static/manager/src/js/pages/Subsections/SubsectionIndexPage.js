import React from 'react'
import { connect } from 'react-redux'

import ItemIndexPage from '../ItemIndexPage'
import SectionFilterInput  from '../../components/inputs/filters/SectionFilterInput'
import subsectionsActions from '../../actions/SubsectionsActions'

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    listItems: state.app.subsections.list,
    entities: {
      listItems: state.app.entities.subsections,
      sections: state.app.entities.sections
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listListItems: (token, query) => {
      dispatch(subsectionsActions.list(token, query))
    },
    toggleListItem: (subsectionId) => {
      dispatch(subsectionsActions.toggle(subsectionId))
    },
    toggleAllListItems: (subsectionIds) => {
      dispatch(subsectionsActions.toggleAll(subsectionIds))
    },
    clearSelectedListItems: () => {
      dispatch(subsectionsActions.clearSelected())
    },
    clearListItems: () => {
      dispatch(subsectionsActions.clearAll())
    },
    deleteListItems: (token, subsectionIds) => {
      dispatch(subsectionsActions.deleteMany(token, subsectionIds))
    },
    searchSubsections: (section, query) => {
      dispatch(subsectionsActions.search(section, query))
    }
  }
}

function SubsectionPageComponent(props) {

  const filters = [
    <SectionFilterInput
      key={'SectionFilter'}
      selected={props.location.query.section}
      update={(section) => props.searchSubsections(section, props.location.query.q)} />
  ]

  return (
    <ItemIndexPage
      pageTitle='Subsections'
      typePlural='subsections'
      typeSingular='subsection'
      displayColumn='name'
      filters={filters}
      headers={[ 'Name', 'Section', 'Articles', 'Active']}
      extraColumns={[
        item => item.section.name,
        item => item.articles.length,
        item => item.is_active ? 'Active' : 'Inactive'
      ]}
      shouldReload={(prevProps, props) => {
        return (prevProps.location.query.section !== props.location.query.section)
      }}
      queryHandler={(query, props) => {
        if (props.location.query.section) {
          query.section = props.location.query.section
        }
        return query
      }}
      searchListItems={(query) => props.searchSubsections(props.location.query.section, query)}
      {...props} />
  )
}


const SubsectionsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(SubsectionPageComponent)

export default SubsectionsPage
