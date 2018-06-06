import React, { Component } from 'react'
import { Link } from 'react-router'

require('../../../styles/components/header.scss')
require('../../../styles/utilities/_pseudo_bootstrap.scss')

const links = {
  Content: ['Articles', 'Pages'],
  Widgets: ['Polls', 'Zones', 'Events'],
  Media: ['Galleris', 'Files', 'Images', 'Videos'],
  Misc: ['Issues', 'People']
}

const renderLinks = (type, key, items) => {
  console.log(key)
  console.log(items)
  console.log('render links')
  return(
    <div className='nav-dropdown-container nav-padded'>
      <div className='nav-dropdown-button pt-minimal'>
        <span className='pt-icon-standard pt-icon-edit' />
        {String(key)}
      </div>
      <div className={'nav-dropdown-container nav-padded'}>
        {
          items.map((item, index) => {
            <Link to={'/' + item.toLowerCase() + '/'} className="pt-button pt-minimal pt-icon-document">{item}</Link>
          })
        }
      </div>
    </div>
  )
}
const HeaderButtons = (props) => {
  const dropdownType = props.isDesktop ? 'nav-dropdown-container' : 'nav-dropdown-container-mobile'
  return (
    <div className="navbar-group nav-align-left">
      <div className="row no-gutters nav-button-group">
        {
          Object.keys(links).map((key, index)=> {
            return( renderLinks(dropdownType, key, links[key]))
          })
        }
      </div>
    </div>
  )
}

export default HeaderButtons