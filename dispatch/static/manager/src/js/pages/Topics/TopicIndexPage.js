import { connect } from 'react-redux'
import { replace } from 'react-router-redux'

import { Index as ListItemIndex } from '../ListItem'
import topicsActions from '../../actions/TopicsActions'

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    listItems: state.app.topics.list,
    entities: {
      listItems: state.app.entities.topics
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listListItems: (token, query) => {
      dispatch(topicsActions.list(token, query))
    },
    toggleListItem: (topicId) => {
      dispatch(topicsActions.toggle(topicId))
    },
    toggleAllListItems: (topicIds) => {
      dispatch(topicsActions.toggleAll(topicIds))
    },
    clearSelectedListItems: () => {
      dispatch(topicsActions.clearSelected())
    },
    clearListItems: () => {
      dispatch(topicsActions.clearAll())
    },
    deleteListItems: (token, topicIds, goDownPage) => {
      dispatch(topicsActions.deleteMany(token, topicIds))
      if (goDownPage) {
        dispatch(replace({
          pathname: '/topics/',
          query: {
            page: goDownPage
          }
        }))
      }
    },
    searchListItems: (query) => {
      dispatch(topicsActions.search(query))
    }
  }
}

class TopicsPageComponent extends ListItemIndex {

  constructor(props) {
    super(props)

    this.typeString = 'topics'
  }
}

const TopicsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicsPageComponent)

export default TopicsPage
