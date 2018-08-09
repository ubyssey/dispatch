import React, { Component } from 'react'
import { Link } from 'react-router'
import MobileHeaderButtons from './MobileHeaderButtons'

require('../../../styles/components/header.scss')

class MobileHeader extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false
    }
  }

  render () {
    const open = this.state.isOpen ? 'open' : 'closed'
    return (
      <header className='c-header'>
        <span 
          onClick={() => this.setState(prevstate => ({isOpen: !prevstate.isOpen}))}
          className='nav-padded pt-icon-standard pt-icon-menu '>
          <div className={'nav-dropdown-content ' + open} >
            <div style={{display:'flex', flexDirection:'row', justifyContent:'space-around'}}>
              <div className='nav-padded'>
                <Link to='/profile/' className="pt-button pt-minimal pt-icon-large pt-icon-user" />
                <h3>Profile</h3>
              </div>
              <div className='nav-padded'>
                <Link to='/logout/' className="pt-button pt-minimal pt-icon-large pt-icon-log-out" />
                <h3>Logout</h3>
              </div>
            </div>
            <MobileHeaderButtons />
          </div>
        </span>
        <Link to='/' className='pt-button pt-minimal pt-icon-selection nav-logo'>dispatch</Link>
        <span className='nav-padded pt-icon-standard pt-icon-blank ' />
      </header>
    )
  }
}

export default MobileHeader