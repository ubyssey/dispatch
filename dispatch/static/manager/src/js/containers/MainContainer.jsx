import React from 'react'
import { connect } from 'react-redux'
import { Position, Toaster } from '@blueprintjs/core';

import * as sectionsActions from '../actions/SectionsActions'
import * as modalActions from '../actions/ModalActions'
import * as toasterActions from '../actions/ToasterActions'

import Header from '../components/Header.jsx'
import ModalContainer from '../components/ModalContainer.jsx'

class Main extends React.Component {

  constructor(props) {
    super(props)

    if ( !props.sections.isLoaded ) {
      props.fetchSections(this.props.token)
    }
  }

  componentDidMount() {
    this.props.setupToaster(this.refs.toaster)
  }

  renderModal() {
    return (
      <ModalContainer closeModal={this.props.closeModal}>
        <this.props.modal.component {...this.props.modal.props} />
      </ModalContainer>
    )
  }

  render() {
    const sections = this.props.sections.data.map( id => this.props.entities.sections[id] )

    return (
      <div>
        <Toaster position={Position.TOP} ref='toaster' />
        <Header sections={sections} email={this.props.email} />
        {this.props.children}
        {this.props.modal.component ? this.renderModal() : null}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    sections: state.app.sections,
    email: state.app.auth.email,
    entities: {
      sections: state.app.entities.sections
    },
    modal: state.modal,
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSections: (token) => {
      dispatch(sectionsActions.fetchSections(token))
    },
    closeModal: () => {
      dispatch(modalActions.closeModal())
    },
    setupToaster: (toaster) => {
      dispatch(toasterActions.setupToaster(toaster))
    }
  }
}

const MainContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)

export default MainContainer
