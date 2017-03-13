import React from 'react';
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'

import * as filesActions from '../actions/FilesActions'

import ItemList from '../components/ItemList'

const DEFAULT_LIMIT = 15

class FilesPageComponent extends React.Component {

  componentWillMount() {
    this.props.fetchFiles(this.props.token)
  }
/*
<ItemList
  location={this.props.location}

  currentPage={"currentPage"}
  totalPages={4}

  items={this.props.files}
  entities={this.props.entities.files}

  createMessage='Upload File'
  emptyMessage={'You haven\'t uploaded any files yet.'}
  createRoute='files/new'

  />
*/
  render() {
    const title = 'Files'

    return (
      <DocumentTitle title={title}>
      <h1>hihihihihihi</h1>
      </DocumentTitle>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    files: state.app.files.files,
    entities: {
      files: state.app.entities.files
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchFiles: (token, query) => {
      dispatch(filesActions.fetchFiles(token,query))
    }
  }
}

const FilesPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilesPageComponent)

export default FilesPage
