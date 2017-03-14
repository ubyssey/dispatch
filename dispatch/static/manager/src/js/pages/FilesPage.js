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

  render() {
    const title = 'Files'

    return (
      <DocumentTitle title={title}>
        <h1>This is the files page</h1>
        <ItemList
          location={this.props.location}

          currentPage={1}
          totalPages={1}

          items={this.props.articles}
          entities={this.props.entities.articles}

          createMessage='Upload file'
          emptyMessage={'You haven\'t uploaded any files yet.'}
          createRoute='files'

          />
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
