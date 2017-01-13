import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'

import MultiSelectInput from './MultiSelectInput.jsx'

import * as tagsActions from '../../actions/TagsActions'

class TagSelectInputComponent extends React.Component {

  constructor(props) {
    super(props)

    this.addTag = this.addTag.bind(this)
    this.removeTag = this.removeTag.bind(this)
    this.createTag = this.createTag.bind(this)
    this.fetchTags = this.fetchTags.bind(this)
  }

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

  createTag(name) {

  }

  fetchTags(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.fetchTags(this.props.token, queryObj)
  }

  render() {
    return (
      <MultiSelectInput
        selected={this.props.selected}
        results={this.props.tags.data}
        entities={this.props.entities.tags}
        addValue={this.addTag}
        removeValue={this.removeTag}
        createValue={this.createTag}
        fetchResults={this.fetchTags}
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
    fetchTags: (token, query) => {
      dispatch(tagsActions.fetchTags(token, query))
    }
  }
}

const TagSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(TagSelectInputComponent)

export default TagSelectInput
