import React from 'react'
import { connect } from 'react-redux'

import topicsActions from '../../actions/TopicsActions'
import TopicForm from './TopicForm'

import ItemEditor from '../ItemEditor'

const TYPE = 'Topic'
const TYPE_PLURAL = 'Topics'
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

function TopicEditorComponent(props) {
  return (
    <ItemEditor
      type={TYPE}
      typePlural={TYPE_PLURAL}
      afterDelete={AFTER_DELETE}
      form={TopicForm}
      {... props} />
  )
}

const TopicEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicEditorComponent)

export default TopicEditor
