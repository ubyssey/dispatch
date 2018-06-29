import React from 'react'
import { connect } from 'react-redux'

import ItemIndexPage from '../ItemIndexPage'
import SectionFilterInput  from '../../components/inputs/filters/SectionFilterInput'
import columnsActions from '../../actions/ColumnsActions'

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    listItems: state.app.columns.list,
    entities: {
      listItems: state.app.entities.columns,
      sections: state.app.entities.sections
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listListItems: (token, query) => {
      dispatch(columnsActions.list(token, query))
    },
    toggleListItem: (columnId) => {
      dispatch(columnsActions.toggle(columnId))
    },
    toggleAllListItems: (columnIds) => {
      dispatch(columnsActions.toggleAll(columnIds))
    },
    clearSelectedListItems: () => {
      dispatch(columnsActions.clearSelected())
    },
    clearListItems: () => {
      dispatch(columnsActions.clearAll())
    },
    deleteListItems: (token, columnIds) => {
      dispatch(columnsActions.deleteMany(token, columnIds))
    },
    searchColumns: (section, query) => {
      dispatch(columnsActions.search(section, query))
    }
  }
}

function ColumnPageComponent(props) {

  const filters = [
    <SectionFilterInput
      key={'SectionFilter'}
      selected={props.location.query.section}
      update={(section) => props.searchColumns(section, props.location.query.q)} />
  ]

  return (
    <ItemIndexPage
      pageTitle='Columns'
      typePlural='columns'
      typeSingular='column'
      displayColumn='name'
      filters={filters}
      headers={[ 'Name', 'Section', 'Articles']}
      extraColumns={[
        item => item.section.name,
        item => item.articles.length
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
      searchListItems={(query) => props.searchColumns(props.location.query.section, query)}
      {...props} />
  )
}


const ColumnsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ColumnPageComponent)

export default ColumnsPage
