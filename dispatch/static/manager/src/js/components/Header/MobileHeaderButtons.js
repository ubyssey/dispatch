import React from 'react'
import { Link } from 'react-router'
import {links} from './links'

require('../../../styles/components/header.scss')
require('../../../styles/utilities/_pseudo_bootstrap.scss')

const MobileHeaderButtons = () => {
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

export default MobileHeaderButtons