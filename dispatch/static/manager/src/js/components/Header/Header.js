import React from 'react'
import { Link } from 'react-router'
import LoadingBar from 'react-redux-loading-bar'
import { Button } from '@blueprintjs/core'

import HeaderButtons from './HeaderButtons'
import MobileHeaderButtons from './MobileHeaderButtons'
// import { desktopSize } from '../../util/helpers'

require('../../../styles/components/header.scss')
require('../../../styles/components/loading_bar.scss')

class Header extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false
    }
  }

  renderLink(url, classes, icon, value) {
    return (
      <Button
        minimal={true}
        onClick={() => this.props.goTo(url)}
        icon={icon}>
        {value}
      </Button>
    )
  }

  renderDesktopHeader() {
    return (
      <header className='c-header'>
        <nav className='bp3-navbar bp3-dark'>
          <div className='bp3-navbar-group bp3-align-left'>
            {this.renderLink('/', 'nav-logo', 'selection', 'dispatch')}
            <span className='bp3-navbar-divider' />
            <HeaderButtons goTo={this.props.goTo} />
          </div>
          <div className='bp3-navbar-group bp3-align-right'>
            {this.renderLink('/profile/', null, 'user', '')}
            {this.renderLink('/logout/', null, 'log-out', '')}
          </div>
        </nav>
        <LoadingBar className='c-loading-bar' />
      </header>
    )
  }

  renderMobileHeader() {
    const open = this.state.isOpen ? 'open' : 'closed'
    return (
      <header className='c-header'>
        <span
          onClick={() => this.setState(prevstate => ({isOpen: !prevstate.isOpen}))}
          className='nav-padded bp3-icon-standard bp3-icon-menu '>
          <div className={'nav-dropdown-content ' + open} >
            <div style={{display:'flex', flexDirection:'row', justifyContent:'space-around'}}>
              <div className='nav-padded'>
                <Link to='/profile/' icon='user' className='bp3-button bp3-minimal bp3-icon-large bp3-icon-user' />
                <h3>Profile</h3>
              </div>
              <div className='nav-padded'>
                <Link to='/logout/' className='bp3-button bp3-minimal bp3-icon-large bp3-icon-log-out' />
                <h3>Logout</h3>
              </div>
            </div>
            <MobileHeaderButtons />
          </div>
        </span>
        <Link to='/' className='bp3-button bp3-minimal bp3-icon-selection nav-logo'>dispatch</Link>
        <span className='nav-padded bp3-icon-standard bp3-icon-blank ' />
      </header>
    )
  }

  render() {
    return (
      <div>
        {this.renderDesktopHeader()}
      </div>
    )
  }
}

export default Header
