import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'

import sectionsActions from '../../actions/SectionsActions'

import SectionToolbar from './SectionToolbar'
import SectionForm from './SectionForm'

const NEW_SECTION_ID = 'new'
const AFTER_DELETE = '/sections/'

class SectionEditorComponent extends React.Component {

  componentWillMount() {
    if (this.props.isNew) {
      // Create empty section
      this.props.setSection({ id: NEW_SECTION_ID })
    } else {
      // Fetch section
      this.props.getSection(this.props.token, this.props.sectionId)
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.isNew) {
      // Fetch section
      if (prevProps.sectionId !== this.props.sectionId) {
        this.props.getSection(this.props.token, this.props.sectionId)
      }
    }
  }

  getSection() {
    if (this.props.isNew) {
      return this.props.entities.local[NEW_SECTION_ID]
    } else {
      return this.props.entities.local[this.props.sectionId] ||
        this.props.entities.remote[this.props.sectionId] || false
    }
  }

  saveSection() {
    if (this.props.isNew) {
      this.props.createSection(this.props.token, this.getSection())
    } else {
      this.props.saveSection(
        this.props.token,
        this.props.sectionId,
        this.getSection()
      )
    }
  }

  handleUpdate(field, value) {
    this.props.setSection(R.assoc(field, value, this.getSection()))
  }

  render() {

    const section = this.getSection()

    if (!section) {
      return (<div>Loading</div>)
    }

    const title = this.props.isNew ? 'New section' : `Edit - ${section.name}`

    return (
      <DocumentTitle title={title}>
        <div className='u-container-main'>
          <SectionToolbar
            name={section.name}
            isNew={this.props.isNew}
            saveSection={() => this.saveSection()}
            deleteSection={() => this.props.deleteSection(this.props.token, this.props.sectionId, AFTER_DELETE)}
            goBack={this.props.goBack} />
          <div className='u-container u-container--padded'>
            <SectionForm
              section={section}
              errors={this.props.section.errors}
              update={(field, value) => this.handleUpdate(field, value)} />
          </div>
        </div>
      </DocumentTitle>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    section: state.app.sections.single,
    entities: {
      remote: state.app.entities.sections,
      local: state.app.entities.local.sections,
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSection: (token, sectionId) => {
      dispatch(sectionsActions.get(token, sectionId))
    },
    setSection: (section) => {
      dispatch(sectionsActions.set(section))
    },
    saveSection: (token, sectionId, data) => {
      dispatch(sectionsActions.save(token, sectionId, data))
    },
    createSection: (token, data) => {
      dispatch(sectionsActions.create(token, data))
    },
    deleteSection: (token, sectionId, next) => {
      dispatch(sectionsActions.delete(token, sectionId, next))
    }
  }
}

const SectionEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(SectionEditorComponent)

export default SectionEditor
