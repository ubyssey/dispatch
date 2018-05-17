import React from 'react'
import { connect } from 'react-redux'

import FilterSelectInput from './FilterSelectInput'

import tagsActions from '../../../actions/TagsActions'

class TagsFilterInputComponent extends React.Component {

  listTags(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listTags(this.props.token, queryObj)
  }

  render() {
    return (
      <FilterSelectInput
        selected={this.props.selected}
        results={this.props.tags}
        entities={this.props.entities.tags}
        update={(selected) => this.props.update(selected)}
        fetchResults={(query) => this.listTags(query)}
        attribute='name'
        label='Tag'
        icon='tag'
        editMessage='Filter by tag'
        />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    tags: state.app.tags.list,
    entities: {
      tags: state.app.entities.tags
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listTags: (token, query) => {
      dispatch(tagsActions.list(token, query))
    }
  }
}

const TagsFilterInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(TagsFilterInputComponent)

export default TagsFilterInput
