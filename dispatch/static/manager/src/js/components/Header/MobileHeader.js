import React, { Component } from 'react'
import { Link } from 'react-router'
import LoadingBar from 'react-redux-loading-bar'
import MobileHeaderButtons from './MobileHeaderButtons'
import HeaderButtons from './HeaderButtons'

require('../../../styles/components/header.scss')
require('../../../styles/utilities/_pseudo_bootstrap.scss')
require('../../../styles/components/loading_bar.scss')

const desktopSize = 960

class MobileHeader extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: null,
      slideOpen: false
    }
  }

  handleSelect(index)  {
    this.setState({
      selected: index
    })
  }

  render () {
    const open = this.state.slideOpen ? 'open' : 'closed'
    return (
      <header className='c-header'>
        <span 
          onClick={() => this.setState(prevstate => ({slideOpen: !prevstate.slideOpen}))}
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
            <MobileHeaderButtons selected={this.state.selected} update={() => this.handleSelect()} />
            <Link to='/tags/' className="pt-button pt-minimal">Tags</Link>
            <Link to='/topics/' className="pt-button pt-minimal">Topics</Link>
            <Link to='/sections/' className="pt-button pt-minimal">Sections</Link>
            <Link to='/integrations/' className="pt-button pt-minimal">Integrations</Link>

          </div>
        </span>
        <Link to='/' className='pt-button pt-minimal pt-icon-selection nav-logo'>dispatch</Link>
        <span className='nav-padded pt-icon-standard pt-icon-menu ' style={{visibility: 'hidden'}} />
      </header>
    )
  }
}

export default MobileHeader