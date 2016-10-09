import React from 'react'
import { connect } from 'react-redux'

import * as sectionActions from '../actions/SectionActions'
import * as modalActions from '../actions/ModalActions'

import Header from '../components/Header.jsx'
import ModalContainer from '../components/ModalContainer.jsx'

class Main extends React.Component {

  constructor(props) {
    super(props)

    if ( !props.sections.isLoaded ) {
      props.fetchSections()
    }
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
    modal: state.modal
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSections: () => {
      dispatch(sectionActions.fetchSections())
    },
    closeModal: () => {
      dispatch(modalActions.closeModal())
    }
  }
}

const MainContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)

export default MainContainer
