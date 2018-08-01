import React from 'react'
import { Link } from 'react-router'
import LoadingBar from 'react-redux-loading-bar'
import HeaderButtons from './HeaderButtons'
import MobileHeader from './MobileHeader'

require('../../../styles/components/header.scss')
require('../../../styles/components/loading_bar.scss')

const desktopSize = 960

const renderLink = (url, classes, value) => {
  return (
    <div className='nav-padded'>
      <Link to={url} className={'pt-button pt-minimal ' + classes}>{value}</Link>
    </div>
  )
}

const DesktopHeader = () => {
  return (
    <header className='c-header'>
      <div className={'row no-gutters'}>
        <div className='col-8 flex-start'>
          {renderLink('/', 'nav-logo pt-icon-selection', 'dispatch')}
          <span className="pt-navbar-divider" />
          <HeaderButtons />
        </div>
        <div className={'col-4 flex-end'}>
          {renderLink('/profile/', 'pt-icon-user', '')}
          {renderLink('/logout/', 'pt-icon-log-out', '')}
        </div>
      </div>
      <LoadingBar className='c-loading-bar' />
    </header>
  )
}

export default function Header() {
  const windowWidth = window.document.body.clientWidth || window.innerWidth 
  return windowWidth > desktopSize ? DesktopHeader() : <MobileHeader />
}
