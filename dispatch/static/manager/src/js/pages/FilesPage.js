import React from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import moment from 'moment'
import { Button } from '@blueprintjs/core'

import * as filesActions from '../actions/FilesActions'

import ItemList from '../components/ItemList'

import Dropzone from 'react-dropzone'

require('../../styles/components/files.scss')

const DEFAULT_LIMIT = 15

class FilesPageComponent extends React.Component {

  componentWillMount() {
    this.props.clearFiles()
    this.props.clearSelectedFiles()
    this.props.fetchFiles(this.props.token, this.getQuery())
  }

  componentDidUpdate(prevProps) {
    if (this.isNewQuery(prevProps, this.props)) {
      this.props.clearFiles()
      this.props.clearSelectedFiles()
      this.props.fetchFiles(this.props.token, this.getQuery())
    }
    else if (this.isNewPage(prevProps, this.props)) {
      this.props.fetchFiles(this.props.token, this.getQuery())
      this.props.clearSelectedFiles()
    }
  }

  getQuery() {
    var query = {
      limit: DEFAULT_LIMIT,
      offset: (this.getCurrentPage() - 1) * DEFAULT_LIMIT
    }
    if(this.props.location.query.q) {
      query.q = this.props.location.query.q
    }
    return query
  }

  getCurrentPage() {
    return parseInt(this.props.location.query.page, 10) || 1
  }

  getTotalPages() {
    return Math.ceil(
      parseInt(this.props.files.count, 10) / DEFAULT_LIMIT
    )
  }

  isNewQuery(prevProps, props) {
    return prevProps.location.query.q !== props.location.query.q
  }

  isNewPage(prevProps, props) {
    //Returns true if the page number has changed
    return prevProps.location.query.page !== props.location.query.page
  }

  handleDeleteFiles(fileIds) {
    this.props.deleteFiles(this.props.token, fileIds)
    this.props.clearSelectedFiles()
  }

  handleSearchFiles(query) {
    this.props.searchFiles(this.props.token,query)
  }

  onDrop(files) {
    files.forEach((file)=> {
      let formData = new FormData()
      formData.append('file', file, file.name)
      formData.append('name', file.name)
      this.props.createFile(this.props.token, formData)
    })
  }

  onDropzoneClick() {
    this.dropzone.open()
  }


  render() {
    const title = 'Files'
    const type = 'Files'
    return (
      <DocumentTitle title={title}>
        <Dropzone ref={(node) => { this.dropzone = node }} className='c-files-dropzone' onDrop={(files) => this.onDrop(files)} disableClick={true} activeClassName='c-files-dropzone-active'>
          <ItemList
            location={this.props.location}

            type={type}

            currentPage={this.getCurrentPage()}
            totalPages={this.getTotalPages()}

            items={this.props.files}
            entities={this.props.entities.files}

            columns={[
              item => (<a href={item.file}>{item.name}</a>),
              item => moment(item.created_at).format('MMMM Do YYYY, h:mm:ss a'),
              item => moment(item.updated_at).format('MMMM Do YYYY, h:mm:ss a'),
            ]}

            emptyMessage={'You haven\'t uploaded any files yet.'}
            createHandler={() => (<Button onClick={() => this.onDropzoneClick()}>Upload</Button>)}

            actions={{
              toggleItem: this.props.toggleFile,
              toggleAllItems: this.props.toggleAllFiles,
              deleteItems: (fileIds) => this.handleDeleteFiles(fileIds),
              searchItems: (query) => this.handleSearchFiles(query)
            }}
          />
          <div className='c-files-dropzone-text' onClick={() => this.onDropzoneClick()}>
            <p>Drag files into window or click here to upload</p>
          </div>
      </Dropzone>
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
    createFile: (token, file) => {
      dispatch(filesActions.createFile(token, file))
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
    searchFiles: (token, query) => {
      dispatch(filesActions.searchFiles(query))
    }
  }
}

const FilesPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilesPageComponent)

export default FilesPage
