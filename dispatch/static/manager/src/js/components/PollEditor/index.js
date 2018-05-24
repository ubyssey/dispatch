import React from 'react'
import { connect } from 'react-redux'

import pollsActions from '../../actions/PollsActions'
import PollForm from './PollForm'

import ItemEditor from '../ItemEditor'

const TYPE = 'Poll'
const AFTER_DELETE = 'polls'

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

function prepareData(data) {

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
      dispatch(pollsActions.save(token, pollId, prepareData(data)))
    },
    createListItem: (token, data) => {
      dispatch(pollsActions.create(token, prepareData(data), AFTER_DELETE))
    },
    deleteListItem: (token, pollId, next) => {
      dispatch(pollsActions.delete(token, pollId, next))
    }
  }
}

function PollEditorComponent(props) {
  return (
    <ItemEditor
      type={TYPE}
      afterDelete={AFTER_DELETE}
      form={PollForm}
      displayField='question'
      {... props} />
  )
}

const PollEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(PollEditorComponent)

export default PollEditor
