import React from 'react'
import { connect } from 'react-redux'

import ItemSelectInput from './ItemSelectInput'

import topicsActions from '../../actions/TopicsActions'

class TopicSelectInputComponent extends React.Component {

  listTopics(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listTopics(this.props.token, queryObj)
  }

  render() {
    return (
      <ItemSelectInput
        many={false}
        selected={this.props.selected}
        results={this.props.topics.ids}
        entities={this.props.entities.topics}
        onChange={(selected) => this.props.update(selected)}
        fetchResults={(query) => this.listTopics(query)}
        create={(name, cb) => this.props.createAndAddTopic(this.props.token, { name }, cb)}
        attribute='name'
        editMessage={this.props.selected ? 'Edit topic' : 'Add topic'} />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    topics: state.app.topics.list,
    entities: {
      topics: state.app.entities.topics
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listTopics: (token, query) => {
      dispatch(topicsActions.list(token, query))
    },
    createAndAddTopic: (token, data, callback) => {
      dispatch(topicsActions.createAndAdd(token, data, callback))
    }
  }
}

const TopicSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicSelectInputComponent)

export default TopicSelectInput
