import React from 'react'
import { Link } from 'react-router'
import { links } from './links'

require('../../../styles/components/header.scss')

const MobileHeaderButtons = () => {
  let totalLength = 0
  for (let key of Object.keys(links)) {
    totalLength += links[key].link.length
  }
  return (
    <div className='nav-link-group' style={{height: totalLength*30/2}}>
    {      
      Object.keys(links).map( (key) => {
        const item = links[key]
        return (
          Object.keys(item['link']).map( (index) => {
            const link = item['link'][index]['link']
            const icon = item['link'][index]['icon']
            return (
              <Link 
                to={'/' + link.toLowerCase() + '/'} 
                key={index}
                className={['pt-button pt-minimal', icon].join(' ')}>
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