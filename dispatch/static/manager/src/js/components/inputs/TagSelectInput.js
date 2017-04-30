import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'

import MultiSelectInput from './MultiSelectInput'

import tagsActions from '../../actions/TagsActions'

class TagSelectInputComponent extends React.Component {

  addTag(tagId) {
    let newTags = R.append(tagId, this.props.selected)
    this.props.update(newTags)
  }

  removeTag(tagId) {
    let newTags = R.remove(
      R.findIndex(R.equals(tagId), this.props.selected),
      1,
      this.props.selected
    )
    this.props.update(newTags)
  }

  listTags(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listTags(this.props.token, queryObj)
  }

  render() {
    return (
      <MultiSelectInput
        selected={this.props.selected}
        results={this.props.tags.ids}
        entities={this.props.entities.tags}
        addValue={(id) => this.addTag(id)}
        removeValue={(id) => this.removeTag(id)}
        fetchResults={(query) => this.listTags(query)}
        attribute='name'
        editMessage={this.props.selected.length ? 'Edit tags' : 'Add tags'} />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    tags: state.app.tags,
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

const TagSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(TagSelectInputComponent)

export default TagSelectInput
