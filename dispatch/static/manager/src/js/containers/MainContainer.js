import React from 'react'
import { connect } from 'react-redux'
import { Position, Toaster } from '@blueprintjs/core'

import * as modalActions from '../actions/ModalActions'
import * as toasterActions from '../actions/ToasterActions'

import Header from '../components/Header'
import ModalContainer from '../components/ModalContainer'

require('../../styles/components/toaster.scss')

class Main extends React.Component {

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
    return (
      <div>
        <Toaster className='c-toaster' position={Position.TOP} ref='toaster' />
        <Header />
        {this.props.children}
        {this.props.modal.component ? this.renderModal() : null}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    modal: state.modal,
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
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
