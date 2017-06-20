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
        newId={this.props.newId}
        entities={this.props.entities.topics}
        onChange={(selected) => this.props.update(selected)}
        fetchResults={(query) => this.listTopics(query)}
        create={(name) => this.props.createTopic(this.props.token, { name })}
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
    newId: state.app.topics.newId,
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listTopics: (token, query) => {
      dispatch(topicsActions.list(token, query))
    },
    createTopic: (token, data) => {
      dispatch(topicsActions.create(token, data))
    }
  }
}

const TopicSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicSelectInputComponent)

export default TopicSelectInput
