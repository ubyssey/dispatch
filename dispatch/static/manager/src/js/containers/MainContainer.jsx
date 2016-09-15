import React from 'react'
import { connect } from 'react-redux'

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
    const sections = this.props.sections.data.map( id => this.props.entities.sections[id] )

    return (
      <div>
        <Header sections={sections} email={this.props.email} />
        {this.props.children}
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
    }
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
