import React from 'react'
import { connect } from 'react-redux'
import { Position, Toaster } from '@blueprintjs/core'

import * as sectionsActions from '../actions/SectionsActions'
import * as modalActions from '../actions/ModalActions'
import * as toasterActions from '../actions/ToasterActions'

import Header from '../components/Header'
import ModalContainer from '../components/ModalContainer'

require('../../styles/components/toaster.scss')

class Main extends React.Component {

  componentWillMount() {
    // Load sections
    if ( !this.props.sections.isLoaded ) {
      this.props.fetchSectionsNav(this.props.token)
    }
  }

  componentDidMount() {
    // Initialize toaster reducer with toaster ref
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
    const sections = this.props.sections.ids.map( id => this.props.entities.sections[id] )

    return (
      <div>
        <Toaster className='c-toaster' position={Position.TOP} ref='toaster' />
        <Header sections={sections} email={this.props.email} />
        {this.props.children}
        {this.props.modal.component ? this.renderModal() : null}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    sections: state.app.sections.navigation,
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
    fetchSectionsNav: (token) => {
      dispatch(sectionsActions.fetchSectionsNav(token))
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
