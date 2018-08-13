import React from 'react'
import { Link } from 'react-router'
import LoadingBar from 'react-redux-loading-bar'
import HeaderButtons from './HeaderButtons'
import MobileHeaderButtons from './MobileHeaderButtons'
import { desktopSize } from '../../util/helpers'

require('../../../styles/components/header.scss')
require('../../../styles/components/loading_bar.scss')

class Header extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false
    }
  }

  renderLink(url, classes, value) {
    return (
      <div className='nav-padded'>
        <Link to={url} className={'pt-button pt-minimal ' + classes}>{value}</Link>
      </div>
    )
  }

  renderDesktopHeader() {
    return (
      <header className='c-header'>
        <div className={'row no-gutters'}>
          <div className='col-10 flex-start'>
            {this.renderLink('/', 'nav-logo pt-icon-selection', 'dispatch')}
            <span className="pt-navbar-divider" />
            <HeaderButtons />
          </div>
          <div className={'col-2 flex-end'}>
            {this.renderLink('/profile/', 'pt-icon-user', '')}
            {this.renderLink('/logout/', 'pt-icon-log-out', '')}
          </div>
        </div>
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
  
  render() {
    return (
      <div>
        { this.props.viewWidth > desktopSize ? this.renderDesktopHeader() : this.renderMobileHeader() }
      </div>
    )
  }
}

export default Header