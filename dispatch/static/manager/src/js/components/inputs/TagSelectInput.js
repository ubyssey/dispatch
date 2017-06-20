import React from 'react'
import { connect } from 'react-redux'

import ItemSelectInput from './ItemSelectInput'

import tagsActions from '../../actions/TagsActions'

class TagSelectInputComponent extends React.Component {

  listTags(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listTags(this.props.token, queryObj)
  }

  render() {
    return (
      <ItemSelectInput
        selected={this.props.selected}
        results={this.props.tags.ids}
        newId={this.props.newId}
        entities={this.props.entities.tags}
        onChange={(selected) => this.props.update(selected)}
        fetchResults={(query) => this.listTags(query)}
        create={(name) => this.props.createTag(this.props.token, { name })}
        attribute='name'
        editMessage={this.props.selected.length ? 'Edit tags' : 'Add tags'} />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    tags: state.app.tags.list,
    entities: {
      tags: state.app.entities.tags
    },
    newId: state.app.tags.newId,
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listTags: (token, query) => {
      dispatch(tagsActions.list(token, query))
    },
    createTag: (token, data) => {
      dispatch(tagsActions.create(token, data))
    }
  }
}

const TagSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(TagSelectInputComponent)

export default TagSelectInput
