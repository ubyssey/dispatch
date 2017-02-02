import React from 'react'
import { connect } from 'react-redux'

import MultiSelectInput from './MultiSelectInput'

import * as topicsActions from '../../actions/TopicsActions'

class TopicSelectInputComponent extends React.Component {

  constructor(props) {
    super(props)

    this.addTopic = this.addTopic.bind(this)
    this.removeTopic = this.removeTopic.bind(this)
    this.createTopic = this.createTopic.bind(this)
    this.fetchTopics = this.fetchTopics.bind(this)
  }

  addTopic(topicId) {
    this.props.update(topicId)
  }

  removeTopic() {
    this.props.update(null)
  }

  createTopic(name) {

  }

  fetchTopics(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.fetchTopics(this.props.token, queryObj)
  }

  render() {
    return (
      <MultiSelectInput
        selected={this.props.selected ? [this.props.selected] : []}
        results={this.props.topics.data}
        entities={this.props.entities.topics}
        addValue={this.addTopic}
        removeValue={this.removeTopic}
        createValue={this.createTopic}
        fetchResults={this.fetchTopics}
        attribute='name'
        editMessage={this.props.selected ? 'Edit topic' : 'Add topic'} />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    topics: state.app.topics,
    entities: {
      topics: state.app.entities.topics
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTopics: (token, query) => {
      dispatch(topicsActions.fetchTopics(token, query))
    }
  }
}

const TopicSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicSelectInputComponent)

export default TopicSelectInput
