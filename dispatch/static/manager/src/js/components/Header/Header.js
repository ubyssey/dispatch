import React from 'react'
import { Link } from 'react-router'
import LoadingBar from 'react-redux-loading-bar'
import HeaderButtons from './HeaderButtons'
import MobileHeader from './MobileHeader'

require('../../../styles/components/header.scss')
require('../../../styles/utilities/_pseudo_bootstrap.scss')
require('../../../styles/components/loading_bar.scss')

const desktopSize = 960

const DesktopHeader = () => {
  return (
    <header className='c-header'>
      <div className={'row no-gutters'}>
        <div className='col-8 flex-start'>
          <Link to='/' className='pt-button pt-minimal pt-icon-selection nav-logo'>dispatch</Link>
          <span className="pt-navbar-divider" />
          <HeaderButtons />
        </div>
        <div className={'col-4 flex-end'}>
          <div className='nav-dropdown-container nav-padded'>
            <div className='nav-dropdown-button pt-minimal'>
              <span className="pt-icon-standard pt-icon-double-chevron-down" />
            </div>
            <div className='nav-dropdown-content'>
              <Link to='/tags/' className="pt-button pt-minimal">Tags</Link>
              <Link to='/topics/' className="pt-button pt-minimal">Topics</Link>
              <Link to='/sections/' className="pt-button pt-minimal">Sections</Link>
              <Link to='/integrations/' className="pt-button pt-minimal">Integrations</Link>
            </div>
          </div>

          <span className="pt-navbar-divider" />
          <div className='nav-padded'>
            <Link to='/profile/' className="pt-button pt-minimal pt-icon-standard pt-icon-user" />
          </div>
          <div className='nav-padded'>
            <Link to='/logout/' className="pt-button pt-minimal pt-icon-standard pt-icon-log-out" />
          </div>
        </div>
      </div>
      <LoadingBar className='c-loading-bar' />
    </header>
  )
}

export default function Header(props) {
  const windowWidth = window.document.body.clientWidth || window.innerWidth 
  console.log(windowWidth)
  return windowWidth > desktopSize ? DesktopHeader() : <MobileHeader />
}
