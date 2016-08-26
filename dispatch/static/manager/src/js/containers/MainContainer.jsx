import React from 'react'
import { connect } from 'react-redux'

import Header from '../components/Header.jsx'

class Main extends React.Component {

  render() {
    return (
      <div>
        <Header sections={this.props.sections} user={this.props.user} />
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    sections: state.app.sections,
    user: state.app.user
  }
}

const MainContainer = connect(mapStateToProps)(Main)

export default MainContainer
