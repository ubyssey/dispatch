import React from 'react';
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'

import * as filesActions from '../actions/FilesActions'

import ItemList from '../components/ItemList'

class FilesPageComponent extends React.Component {

  componentWillMount() {
    this.props.clearFiles()
    this.props.clearSelectedFiles()
    this.props.fetchFiles(this.props.token)
  }


  handleDeleteFiles(fileIds) {
    this.props.deleteFiels(this.props.token, fileIds)
    this.props.clearSelectedFiles()
  }

  handleSearchFiles(query) {
    this.props.searchFiles(this.props.token, query)
  }

  render() {
    const title = 'Files'
    const type = 'Files'
    //console.log("Items: ", this.props.files)
    console.log("Entities: ", this.props.entities.files)
    return (
      <DocumentTitle title={title}>
        <ItemList
          location={this.props.location}

          type={type}

          currentPage={1}
          totalPages={1}

          items={this.props.files}
          entities={this.props.entities.files}

          createMessage='Upload file'
          emptyMessage={'You haven\'t uploaded any files yet.'}
          createRoute='files/new'

          actions={{
            toggleItem: this.props.toggleFile,
            toggleAllItems: this.props.toggleAllFiles,
            deleteItems: (fileIds) => this.handleDeleteFiles(fileIds),
            searchItems: (query) => this.handleSearchFiles(query)
          }}

          />

      </DocumentTitle>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    files: state.app.files,
    entities: {
      files: state.app.entities.files
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchFiles: (token, query) => {
      dispatch(filesActions.fetchFiles(token,query))
    },
    toggleFile: (fileId) => {
      dispatch(filesActions.toggleFile(fileId))
    },
    toggleAllFiles: (fileIds) => {
      dispatch(filesActions.toggleAllFiles(fileIds))
    },
    clearSelectedFiles: () => {
      dispatch(filesActions.clearSelectedFiles())
    },
    clearFiles: () => {
      dispatch(filesActions.clearFiles())
    },
    deleteFiles: (token, fileIds) => {
      dispatch(filesActions.deleteFiles(token, fileIds))
    },
    clearFiles: () => {
      dispatch(filesActions.clearFiles())
    },
    searchFiles: (token, section, query) => {
      dispatch(filesActions.searchFiles(section, query))
    }
  }
}

const FilesPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilesPageComponent)

export default FilesPage
