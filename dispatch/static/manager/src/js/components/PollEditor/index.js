import React from 'react'
import { connect } from 'react-redux'

import pollsActions from '../../actions/PollsActions'
import PollForm from './PollForm'

import ItemEditor from '../ItemEditor'

const TYPE = 'Poll'
const TYPE_PLURAL = 'Polls'
const AFTER_DELETE = 'polls'

function prepareJSONData(data) {
  data.answers_json = data.answers
  return data
}

function PollEditorComponent(props) {
  return (
    <ItemEditor
      type={TYPE}
      typePlural={TYPE_PLURAL}
      afterDelete={AFTER_DELETE}
      form={PollForm}
      displayField='name'
      {... props} />
  )
}

const mapStateToProps = (state) => {
  return {
    listItem: state.app.polls.single,
    entities: {
      remote: state.app.entities.polls,
      local: state.app.entities.local.polls,
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListItem: (token, pollId) => {
      dispatch(pollsActions.get(token, pollId))
    },
    setListItem: (poll) => {
      dispatch(pollsActions.set(poll))
    },
    saveListItem: (token, pollId, data) => {
      dispatch(pollsActions.save(token, pollId, prepareJSONData(data)))
    },
    createListItem: (token, data) => {
      dispatch(pollsActions.create(token, prepareJSONData(data), AFTER_DELETE))
    },
    deleteListItem: (token, pollId, next) => {
      dispatch(pollsActions.delete(token, pollId, next))
    }
  }
}

const PollEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(PollEditorComponent)

export default PollEditor
