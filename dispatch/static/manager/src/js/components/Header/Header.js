import React from 'react'
import { Link } from 'react-router'
import LoadingBar from 'react-redux-loading-bar'
import HeaderButtons from './HeaderButtons'

require('../../../styles/components/header.scss')
require('../../../styles/utilities/_pseudo_bootstrap.scss')
require('../../../styles/components/loading_bar.scss')

const DesktopSize = 992

export default function Header(props) {
  let windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  console.log(windowWidth)
  return (
    <header className='c-header'>
      <nav className="nav-navbar nav-dark">
        <div className={'row no-gutters'}>
          <div className='nav-padded'>
            <Link to='/' className='pt-button pt-minimal pt-icon-selection nav-logo'>dispatch</Link>
          </div>
          <span className="pt-navbar-divider hidden-lg"></span>
          <div className='col-lg-8 hidden-lg'>
            <HeaderButtons isDesktop={props.isDesktop} props={props} />
          </div>
          <div className={'col-lg-2 col-6 float-right'}>
            <div className="navbar-group nav-align-right">
              <div className='nav-button-group'>
                <div className='nav-dropdown-container nav-padded'>
                  <div className='nav-dropdown-button pt-minimal'>
                    <span className="pt-icon-standard pt-icon-double-chevron-down" />
                  </div>
                  <div className='nav-dropdown-content'>
                    {(windowWidth < DesktopSize) && <HeaderButtons isDesktop={props.isDesktop} props={props} />}
                    <Link to='/tags/' className="pt-button pt-minimal">Tags</Link>
                    <Link to='/topics/' className="pt-button pt-minimal">Topics</Link>
                    <Link to='/sections/' className="pt-button pt-minimal">Sections</Link>
                    <Link to='/integrations/' className="pt-button pt-minimal">Integrations</Link>
                  </div>
                </div>
              </div>
              <span className="pt-navbar-divider"></span>
              <div className={'nav-padded'} >
                <Link to='/profile/' className="pt-button pt-minimal pt-icon-standard pt-icon-user"></Link>
              </div>
              <div className={'nav-padded'} >
                <Link to='/logout/' className="pt-button pt-minimal pt-icon-standard pt-icon-log-out"></Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <LoadingBar className='c-loading-bar' />
    </header>
  )
}
