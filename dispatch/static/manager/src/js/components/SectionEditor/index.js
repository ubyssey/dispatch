import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'

import * as sectionsActions from '../../actions/SectionsActions'

import SectionToolbar from './SectionToolbar'
import SectionForm from './SectionForm'

require('../../../styles/components/section_editor.scss')

const NEW_SECTION_ID = 'new'

class SectionEditorComponent extends React.Component {

  componentWillMount() {
    if (this.props.isNew) {
      // Create empty section
      this.props.setSection({ id: NEW_SECTION_ID })
    } else {
      // Fetch section
      this.props.fetchSection(this.props.token, this.props.sectionId)
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.isNew) {
      // Fetch section
      if (prevProps.sectionId !== this.props.sectionId) {
        this.props.fetchSection(this.props.token, this.props.sectionId)
      }
    }
  }

  getSection() {
    if (this.props.isNew) {
      return this.props.entities.section[NEW_SECTION_ID]
    } else {
      return this.props.entities.section[this.props.sectionId] ||
        this.props.entities.sections[this.props.sectionId] || false
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
            saveSection={() => this.saveSection()}
            isNew={this.props.isNew} />
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
      sections: state.app.entities.sections,
      section: state.app.entities.section,
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSection: (token, sectionId) => {
      dispatch(sectionsActions.fetchSection(token, sectionId))
    },
    setSection: (section) => {
      dispatch(sectionsActions.setSection(section))
    },
    saveSection: (token, sectionId, data) => {
      dispatch(sectionsActions.saveSection(token, sectionId, data))
    },
    createSection: (token, data) => {
      dispatch(sectionsActions.createSection(token, data))
    }
  }
}

const SectionEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(SectionEditorComponent)

export default SectionEditor
