import React from 'react'
import { connect } from 'react-redux'

import ItemSelectInput from './ItemSelectInput'

import galleriesActions from '../../actions/GalleriesActions'

class GallerySelectInputComponent extends React.Component {

  listGalleries(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listGalleries(this.props.token, queryObj)
  }

  componentWillMount() {
    this.props.listGalleries(this.props.token, { q: '' })
  }

  render() {
    if (!Object.keys(this.props.entities.galleries).length) {
      return null
    }

    return (
      <ItemSelectInput
        many={false}
        selected={this.props.selected}
        results={this.props.galleries.ids}
        entities={this.props.entities.galleries}
        onChange={(selected) => this.props.update(selected)}
        fetchResults={(query) => this.listGalleries(query)}
        attribute='title'
        editMessage='Select Gallery' />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    galleries: state.app.galleries.list,
    entities: {
      galleries: state.app.entities.galleries
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listGalleries: (token, query) => {
      dispatch(galleriesActions.list(token, query))
    }
  }
}

const GallerySelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(GallerySelectInputComponent)

export default GallerySelectInput
