import React from 'react'
import { connect } from 'react-redux'

import ItemSelectInput from './ItemSelectInput'

import topicsActions from '../../../actions/TopicsActions'

class TopicSelectInputComponent extends React.Component {

  listTopics(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listTopics(this.props.token, queryObj)
  }

  render() {
    console.log(this.props.selected)
    return (
      <ItemSelectInput
        many={this.props.many}
        selected={this.props.selected}
        results={this.props.topics.ids}
        entities={this.props.entities.topics}
        onChange={(selected) => this.props.update(selected)}
        fetchResults={(query) => this.listTopics(query)}
        create={(name, cb) => this.props.createTopic(this.props.token, { name }, cb)}
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
    createTopic: (token, data, callback) => {
      dispatch(topicsActions.create(token, data, null, callback))
    }
  }
}

const TopicSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicSelectInputComponent)

export default TopicSelectInput
