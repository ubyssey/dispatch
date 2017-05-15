import { connect } from 'react-redux'
import { replace } from 'react-router-redux'

import { Index as ListItemIndex } from '../ListItem'
import sectionsActions from '../../actions/SectionsActions'

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    listItems: state.app.sections.list,
    entities: {
      listItems: state.app.entities.sections
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listListItems: (token, query) => {
      dispatch(sectionsActions.list(token, query))
    },
    toggleListItem: (sectionId) => {
      dispatch(sectionsActions.toggle(sectionId))
    },
    toggleAllListItems: (sectionIds) => {
      dispatch(sectionsActions.toggleAll(sectionIds))
    },
    clearSelectedListItems: () => {
      dispatch(sectionsActions.clearSelected())
    },
    clearListItems: () => {
      dispatch(sectionsActions.clearAll())
    },
    deleteListItems: (token, sectionIds, goDownPage) => {
      dispatch(sectionsActions.deleteMany(token, sectionIds))
      if (goDownPage) {
        dispatch(replace({
          pathname: '/sections/',
          query: {
            page: goDownPage
          }
        }))
      }
    },
    searchListItems: (query) => {
      dispatch(sectionsActions.search(query))
    }
  }
}

class SectionsPageComponent extends ListItemIndex {

  constructor(props) {
    super(props)

    this.typeString = 'sections'

  }
}

const SectionsIndexPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(SectionsPageComponent)

export default SectionsIndexPage
