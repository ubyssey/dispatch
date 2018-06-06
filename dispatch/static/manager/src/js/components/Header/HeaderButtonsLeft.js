import React, { Component } from 'react'
import { Link } from 'react-router'

require('../../../styles/components/header.scss')
require('../../../styles/utilities/_pseudo_bootstrap.scss')

const links = {
  Content: {
    icon: 'pt-icon-edit',
    link: [
      {
        link: 'Articles',
        icon: 'pt-icon-paper'
      },
      {
        link: 'Pages',
        icon: 'pt-icon-page'
      }
    ]
  },
  Widgets: {
    icon: 'pt-icon-widget',
    link: [
      {
        link: 'Polls',
        icon: 'pt-icon-lines'
      },
      {
        link: 'Zones',
        icon: 'pt-icon-zone'
      },
      {
        link: 'Events',
        icon: 'pt-icon-event'   
      }
    ]
  },
  Media: {
    icon: 'pt-icon-media',
    link: [ 
      {
        link: 'Galleries',
        icon: 'pt-icon-gallery'
      },
      {
        link: 'Files',
        icon: 'pt-icon-file'
      },
      {
        link: 'Images',
        icon: 'pt-icon-image'
      },
      {
        link: 'Videos',
        icon: 'pt-icon-video'
      } 
    ]
  },
  Misc: {
    icon: 'pt-icon-misc',
    link: [
      {
        link: 'Issues',
        icon: 'pt-icon-issue',
      },
      {
        link: 'People',
        icon: 'pt-icon-person'
      }  
    ]
  }
}

const renderLinks = (type, key, item) => {
  console.log('key', key)
  console.log('item', item)
  return(
    <div className='nav-dropdown-container nav-padded'>
      <div className='nav-dropdown-button pt-minimal'>
        <span className={['pt-icon-standard', item['icon']].join(' ')} />
        {String(key)}
      </div>
      <div className={'nav-dropdown-content nav-padded'}>
        {
          Object.keys(item['link']).map( (subkey, index) => {
            console.log('subkey', subkey)
            console.log(item)
            console.log('subitem', item['link'][index][subkey])
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
}
const HeaderButtonsLeft = (props) => {
  const dropdownType = props.isDesktop ? 'nav-dropdown-container' : 'nav-dropdown-container-mobile'
  return (
    <div className="navbar-group nav-align-left">
      <div className="row no-gutters nav-button-group">
        {
          Object.keys(links).map( key => {
            return( renderLinks(dropdownType, key, links[key]))
          })
        }
      </div>
    </div>
  )
}

export default HeaderButtonsLeft