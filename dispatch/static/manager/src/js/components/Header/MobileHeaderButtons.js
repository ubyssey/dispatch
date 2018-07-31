import React from 'react'
import { Link } from 'react-router'
import {links} from './links'

require('../../../styles/components/header.scss')
require('../../../styles/utilities/_pseudo_bootstrap.scss')

const MobileHeaderButtons = (props) => {
  return (
    <div className='nav-link-group'>
    {      
      Object.keys(links).map( (key, index) => {
        const item = links[key]
        return (
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
        )
      })
    }
    </div>
  )
}

export default MobileHeaderButtons