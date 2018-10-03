import React from 'react'
import { connect } from 'react-redux'

import FilterSelectInput from './FilterSelectInput'

import tagsActions from '../../../actions/TagsActions'

class TagsFilterInputComponent extends React.Component {

  convertValue(tags) {
    return typeof tags === 'undefined' ? tags : (typeof tags === 'object' ? tags.map(Number) : Number(tags))
  }

  listTags(query) {
    this.props.listTags(this.props.token, {q: query})
  }

  render() {
    return (
      <FilterSelectInput
        many={true}
        value={this.convertValue(this.props.value)}
        results={this.props.tags}
        entities={this.props.entities.tags}
        update={(value) => this.props.update(value)}
        fetchResults={(query) => this.listTags(query)}
        attribute='name'
        label='Tag'
        icon='tag'
        editMessage='Filter by tag' />
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
