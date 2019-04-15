import React from 'react'
import { connect } from 'react-redux'

import ItemSelectInput from './ItemSelectInput'

import pollsActions from '../../../actions/PollsActions'

class PollSelectInputComponent extends React.Component {

  listPolls(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listPolls(this.props.token, queryObj)
  }

  render() {
    const label = this.props.many ? 'polls' : 'poll'

    return (
      <ItemSelectInput
        many={false}
        value={this.props.value}
        results={this.props.polls.ids}
        entities={this.props.entities.polls}
        onChange={(value) => this.props.onChange(value)}
        fetchResults={(query) => this.listPolls(query)}
        attribute='name'
        editMessage={this.props.value ? `Edit ${label}` : `Add ${label}`} />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    polls: state.app.polls.list,
    entities: {
      polls: state.app.entities.polls
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listPolls: (token, query) => {
      dispatch(pollsActions.list(token, query))
    }
  }
}

const PollSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(PollSelectInputComponent)

export default PollSelectInput
