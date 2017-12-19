import React from 'react'
import { Link } from 'react-router'
import LoadingBar from 'react-redux-loading-bar'

require('../../styles/components/header.scss')
require('../../styles/components/loading_bar.scss')

export default function Header(props) {
  return (
    <header className='c-header'>
      <nav className="pt-navbar pt-dark">
        <div className="pt-navbar-group pt-align-left">
          <Link to='/' className='pt-button pt-minimal pt-icon-selection'>dispatch</Link>
          <span className="pt-navbar-divider"></span>
          <Link to='/articles/' className="pt-button pt-minimal pt-icon-document">Articles</Link>
          <Link to='/pages/' className="pt-button pt-minimal pt-icon-book">Pages</Link>
          <Link to='/widgets/' className="pt-button pt-minimal pt-icon-widget">Widgets</Link>
          <Link to='/galleries/' className="pt-button pt-minimal pt-icon-media">Galleries</Link>
          <Link to='/files/' className="pt-button pt-minimal pt-icon-folder-close">Files</Link>
          <Link to='/videos/' className="pt-button pt-minimal pt-icon-video">Videos</Link>
          <Link to='/persons/' className="pt-button pt-minimal pt-icon-person">People</Link>
          <Link
            to='/events/'
            className="pt-button pt-minimal pt-icon-timeline-events c-banner__badge"
            data-badge={props.pendingCount}>Events</Link>
        </div>
        <div className="pt-navbar-group pt-align-right">
          <Link to='/tags/' className="pt-button pt-minimal">Tags</Link>
          <Link to='/topics/' className="pt-button pt-minimal">Topics</Link>
          <Link to='/sections/' className="pt-button pt-minimal">Sections</Link>
          <Link to='/integrations/' className="pt-button pt-minimal">Integrations</Link>
          <span className="pt-navbar-divider"></span>
          <Link to='/profile/' className="pt-button pt-minimal pt-icon-user"></Link>
          <Link to='/logout/' className="pt-button pt-minimal pt-icon-log-out"></Link>
        </div>
      </nav>
      <LoadingBar className='c-loading-bar' />
    </header>
  )
}
