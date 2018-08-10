import React from 'react'
import { connect } from 'react-redux'
import { Position, Toaster } from '@blueprintjs/core'

import * as modalActions from '../actions/ModalActions'
import * as toasterActions from '../actions/ToasterActions'
import eventsActions from '../actions/EventsActions'

import Header from '../components/Header/Header'
import ModalContainer from '../components/ModalContainer'

require('../../styles/components/toaster.scss')

class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = { viewWidth: 0 }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  componentDidMount() {
    this.props.setupToaster(this.refs.toaster)
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  updateWindowDimensions() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    this.setState({ viewWidth: width })
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
        <Toaster
          className='c-toaster'
          position={Position.TOP}
          ref='toaster' />
        <Header viewWidth={this.state.viewWidth} />
        {this.props.children}
        {this.props.modal.component ? this.renderModal() : null}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    modal: state.modal,
    token: state.app.auth.token,
    pending: state.app.events.pending
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: () => {
      dispatch(modalActions.clospropseModal())
    },
    setupToaster: (toaster) => {
      dispatch(toasterActions.setupToaster(toaster))
    },
    countPending: (token) => {
      dispatch(eventsActions.countPending(token))
    }
  }
}

const MainContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)

export default MainContainer
