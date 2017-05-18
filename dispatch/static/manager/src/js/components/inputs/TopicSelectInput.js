import React from 'react'
import { connect } from 'react-redux'

import MultiSelectInput from './MultiSelectInput'

import topicsActions from '../../actions/TopicsActions'

class TopicSelectInputComponent extends React.Component {

  addTopic(topicId) {
    this.props.update(topicId)
  }

  removeTopic() {
    this.props.update(null)
  }

  listTopics(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listTopics(this.props.token, queryObj)
  }

  render() {
    return (
      <MultiSelectInput
        selected={this.props.selected ? [this.props.selected] : []}
        results={this.props.topics.ids}
        entities={this.props.entities.topics}
        addValue={(id) => this.addTopic(id)}
        removeValue={(id) => this.removeTopic(id)}
        fetchResults={(query) => this.listTopics(query)}
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
    }
  }
}

const TopicSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicSelectInputComponent)

export default TopicSelectInput
