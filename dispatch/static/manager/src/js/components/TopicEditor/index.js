import { connect } from 'react-redux'

import topicsActions from '../../actions/TopicsActions'
import TopicForm from './TopicForm'

import ListItemEditorComponentFactory from '../ListItemEditorComponentFactory'

const AFTER_DELETE = 'topics'

const mapStateToProps = (state) => {
  return {
    listItem: state.app.topics.single,
    entities: {
      remote: state.app.entities.topics,
      local: state.app.entities.local.topics,
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListItem: (token, topicId) => {
      dispatch(topicsActions.get(token, topicId))
    },
    setListItem: (topic) => {
      dispatch(topicsActions.set(topic))
    },
    saveListItem: (token, topicId, data) => {
      dispatch(topicsActions.save(token, topicId, data))
    },
    createListItem: (token, data) => {
      dispatch(topicsActions.create(token, data, AFTER_DELETE))
    },
    deleteListItem: (token, topicId, next) => {
      dispatch(topicsActions.delete(token, topicId, next))
    }
  }
}

const TopicEditorComponent = ListItemEditorComponentFactory(
  TopicForm,
  'topic',
  AFTER_DELETE
)

const TopicEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicEditorComponent)

export default TopicEditor
