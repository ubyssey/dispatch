import React from 'react'
import { Link } from 'react-router'
import links from './links'

require('../../../styles/components/header.scss')
require('../../../styles/utilities/_pseudo_bootstrap.scss')

const renderLinks = (isDesktop, key, item) => {
  console.log(isDesktop)
  if(isDesktop) {
    return (
      <div className='nav-dropdown-container nav-padded'>
        <div className='nav-dropdown-button pt-minimal'>
          <span className={['pt-icon-standard', item['icon']].join(' ')} />
          {String(key)}
        </div>
        <div className={'nav-dropdown-content nav-padded'}>
          {
            Object.keys(item['link']).map( (subkey, index) => {
              const link = item['link'][index]['link']
              const icon = item['link'][index]['icon']
              return (
                <Link 
                  to={'/' + link.toLowerCase() + '/'} 
                  className={['pt-button pt-minimal', 'pt-icon-document', icon].join(' ')}>
                  {link}
                </Link>
              )
            })
          }
        </div>
      </div>
    )
  } else {
    return (
      <div className='nav-padded'>
        {
          Object.keys(item['link']).map( (subkey, index) => {
            const link = item['link'][index]['link']
            const icon = item['link'][index]['icon']
            return (
              <Link 
                to={'/' + link.toLowerCase() + '/'} 
                className={['pt-button pt-minimal', 'pt-icon-document', icon].join(' ')}>
                {link}
              </Link>
            )
          })
        }
      </div>
    )
  }

}
const HeaderButtons = (props) => {
  console.log(props.isDesktop)
  return (
    <div className="navbar-group nav-align-left">
      <div className="row no-gutters nav-button-group">
        {
          Object.keys(links).map( key => {
            return( renderLinks( props.isDesktop, key, links[key] ) )
          })
        }
      </div>
    </div>
  )
}

export default HeaderButtons