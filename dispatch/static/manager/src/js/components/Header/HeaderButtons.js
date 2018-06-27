import React from 'react'
import { Link } from 'react-router'
import links from './links'

require('../../../styles/components/header.scss')
require('../../../styles/utilities/_pseudo_bootstrap.scss')

const renderLinks = (isDesktop) => {

  if (isDesktop) {
    return (
      Object.keys(links).map( key => {
        const item = links[key]
        return (
          <div
            key={key}
            className='nav-dropdown-container nav-padded'>
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
                      key={index}
                      className={['pt-button pt-minimal', 'pt-icon-document', icon].join(' ')}>
                      {link}
                    </Link>
                  )
                })
              }
            </div>
          </div>
        )
      })
    )
  } else {
    return (
      <div>
      {
        Object.keys(links).map( key => {
          const item = links[key]
          return (
            <div key={key}>
              {
                Object.keys(item['link']).map( (subkey, index) => {
                  const link = item['link'][index]['link']
                  const icon = item['link'][index]['icon']
                  return (
                    <Link
                      to={'/' + link.toLowerCase() + '/'}
                      key={index}
                      className={['pt-button pt-minimal', 'pt-icon-document', icon].join(' ')}>
                      {link}
                    </Link>
                  )
                })
              }
            </div>
          )
        })
      }
      </div>
    )
  }
}

const HeaderButtons = (props) => {
  return (
    <div>
    { props.isDesktop && <div className="navbar-group nav-align-left">
        <div className="row no-gutters nav-button-group">
            {renderLinks(props.isDesktop)}
        </div>
      </div>
    }
    { !props.isDesktop &&
      <div>
        {renderLinks(props.isDesktop)}
      </div>
    }
    </div>
  )
}

export default HeaderButtons
