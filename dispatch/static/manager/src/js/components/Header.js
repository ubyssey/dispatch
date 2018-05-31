import React from 'react'
import { Link } from 'react-router'
import LoadingBar from 'react-redux-loading-bar'

require('../../styles/components/header.scss')
require('../../styles/components/loading_bar.scss')

export default function Header(props) {
  return (
    <header className='c-header'>
      <nav className="pt-navbar pt-dark">
        <div className={'row'}>
          <div className={'col-sm-9'}>
            <div className="pt-navbar-group pt-align-left">
              <Link to='/' className='pt-button pt-minimal pt-icon-selection'>dispatch</Link>
              <span className="pt-navbar-divider"></span>
              <div className={['row', 'nav-align-left', 'no-gutters'].join(' ')}>
                    <div className='nav-dropdown-container'>
                      <div className='nav-dropdown-button pt-minimal'>
                        <span className="pt-icon-standard pt-icon-edit" />
                        Publishables
                      </div>
                      <div className='nav-dropdown-content'>
                        <Link to='/articles/' className="pt-button pt-minimal pt-icon-document">Articles</Link>
                        <Link to='/pages/' className="pt-button pt-minimal pt-icon-book">Pages</Link>
                      </div>
                    </div>
                    <div className='nav-dropdown-container'>
                      <div className='nav-dropdown-button pt-minimal'>
                      <span className="pt-icon-standard pt-icon-helper-management" />
                        Widgets
                      </div>
                      <div className='nav-dropdown-content'>
                        <Link to='/polls/' className="pt-button pt-minimal pt-icon-vertical-bar-chart-desc">Polls</Link>
                        <Link to='/widgets/' className="pt-button pt-minimal pt-icon-widget">Widgets</Link>
                        <Link
                          to='/events/'
                          className="pt-button pt-minimal pt-icon-timeline-events c-banner__badge"
                          data-badge={props.pendingCount}>Events</Link>
                      </div>
                    </div>
                    <div className='nav-dropdown-container'>
                      <div className='nav-dropdown-button pt-minimal'>
                        <span className="pt-icon-standard pt-icon-media" />
                        Media
                      </div>
                      <div className='nav-dropdown-content'>
                        <Link to='/galleries/' className="pt-button pt-minimal pt-icon-image-rotate-right">Galleries</Link>
                        <Link to='/files/' className="pt-button pt-minimal pt-icon-folder-close">Files</Link>
                        <Link to='/images/' className="pt-button pt-minimal pt-icon-camera">Images</Link>
                        <Link to='/videos/' className="pt-button pt-minimal pt-icon-video">Videos</Link>
                        </div>
                    </div>
                    <div className='nav-dropdown-container'>
                      <div className='nav-dropdown-button pt-minimal'>
                        <span className="pt-icon-standard pt-icon-layout-grid" />
                        Misc
                      </div>
                      <div className='nav-dropdown-content'>
                        <Link to='/issues' className="pt-button pt-minimal pt-icon-book">Issues</Link>
                        <Link to='/persons/' className="pt-button pt-minimal pt-icon-person">People</Link>
                      </div>
                    </div>
                </div>
            </div>
          </div>
          <div className={'col-sm-3'}>
            <div className="pt-navbar-group pt-align-right">
              <div className='nav-dropdown-container'>
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
              <span className="pt-navbar-divider"></span>
              <Link to='/profile/' className="pt-button pt-minimal pt-icon-user"></Link>
              <Link to='/logout/' className="pt-button pt-minimal pt-icon-log-out"></Link>
            </div>
          </div>
        </div>
      </nav>
      <LoadingBar className='c-loading-bar' />
    </header>
  )
}
