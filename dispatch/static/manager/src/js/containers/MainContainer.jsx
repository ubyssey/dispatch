import React from 'react'
import { connect } from 'react-redux'
import LoadingBar from 'react-redux-loading-bar'

import * as sectionActions from '../actions/SectionActions'

import Header from '../components/Header.jsx'

class Main extends React.Component {

  constructor(props) {
    super(props)

    if ( !props.sections.isLoaded ) {
      props.fetchSections()
    }
  }

  render() {
    return (
      <div>
        <Header sections={this.props.sections.data} email={this.props.email} />
        <LoadingBar />
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    sections: state.app.sections,
    email: state.app.auth.email
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSections: () => {
      dispatch(sectionActions.fetchSections())
    }
  }
}

const MainContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)

export default MainContainer
