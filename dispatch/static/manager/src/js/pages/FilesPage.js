import React from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import Dropzone from 'react-dropzone'
import { Button } from '@blueprintjs/core'

import filesActions from '../actions/FilesActions'
import ItemList from '../components/ItemList'
import { humanizeDatetime } from  '../util/helpers'

require('../../styles/components/files.scss')

const DEFAULT_LIMIT = 15

class FilesPageComponent extends React.Component {

  componentWillMount() {
    this.props.clearAllFiles()
    this.props.clearSelectedFiles()
    this.props.listFiles(this.props.token, this.getQuery())
  }

  componentDidUpdate(prevProps) {
    if (this.isNewQuery(prevProps, this.props)) {
      this.props.clearAllFiles()
      this.props.clearSelectedFiles()
      this.props.listFiles(this.props.token, this.getQuery())
    }
    else if (this.isNewPage(prevProps, this.props)) {
      this.props.listFiles(this.props.token, this.getQuery())
      this.props.clearSelectedFiles()
    }
  }

  getQuery() {

    var query = {
      limit: DEFAULT_LIMIT,
      offset: (this.getCurrentPage() - 1) * DEFAULT_LIMIT
    }

    if (this.props.location.query.q) {
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
    // Returns true if the page number has changed
    return prevProps.location.query.page !== props.location.query.page
  }

  handleDeleteFiles(fileIds) {
    this.props.deleteFiles(this.props.token, fileIds)
    this.props.clearSelectedFiles()
  }

  handleSearchFiles(query) {
    this.props.searchFiles(this.props.token, query)
  }

  onDrop(files) {
    files.forEach(file => {
      this.props.createFile(this.props.token, {file: file, name: file.name})
    })
  }

  onDropzoneClick() {
    this.dropzone.open()
  }

  render() {
    return (
      <DocumentTitle title='Files'>
        <Dropzone
          ref={(node) => { this.dropzone = node }}
          className='c-files-dropzone'
          onDrop={(files) => this.onDrop(files)}
          disableClick={true}
          activeClassName='c-files-dropzone--active'>

          <div className='c-files-dropzone__list'>
            <ItemList
              location={this.props.location}

              typeSingular='file'
              typePlural='files'

              currentPage={this.getCurrentPage()}
              totalPages={this.getTotalPages()}

              items={this.props.files}
              entities={this.props.entities.files}

              headers={['Filename', 'Created', 'Updated']}
              columns={[
                item => (<a
                  href={item.url}
                  target='_blank'
                  rel='noopener noreferrer'>{item.name}</a>),
                item => humanizeDatetime(item.created_at),
                item => humanizeDatetime(item.updated_at),
              ]}

              emptyMessage={'You haven\'t uploaded any files yet.'}
              createHandler={() => (<Button onClick={() => this.onDropzoneClick()}>Upload</Button>)}

              actions={{
                toggleItem: this.props.toggleFile,
                toggleAllItems: this.props.toggleAllFiles,
                deleteItems: (fileIds) => this.handleDeleteFiles(fileIds),
                searchItems: (query) => this.handleSearchFiles(query)
              }} />
          </div>
          <div className='c-files-dropzone__text' onClick={() => this.onDropzoneClick()}>
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
    listFiles: (token, query) => {
      dispatch(filesActions.list(token,query))
    },
    toggleFile: (fileId) => {
      dispatch(filesActions.toggle(fileId))
    },
    createFile: (token, file) => {
      dispatch(filesActions.create(token, file))
    },
    toggleAllFiles: (fileIds) => {
      dispatch(filesActions.toggleAll(fileIds))
    },
    clearSelectedFiles: () => {
      dispatch(filesActions.clearSelected())
    },
    clearAllFiles: () => {
      dispatch(filesActions.clearAll())
    },
    deleteFiles: (token, fileIds) => {
      dispatch(filesActions.deleteMany(token, fileIds))
    },
    searchFiles: (token, query) => {
      dispatch(filesActions.search(query))
    }
  }
}

const FilesPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilesPageComponent)

export default FilesPage
