import React from 'react'
import { Link } from 'react-router'
import { links } from './links'

require('../../../styles/components/header.scss')

const MobileHeaderButtons = () => {
  return (
    <div className='nav-link-group' >
    {
      Object.keys(links).map((key) => {
        const item = links[key]
        return (
          Object.keys(item['children']).map( (index) => {
            const text = item['children'][index]['text']
            const url = item['children'][index]['url']
            const icon = item['children'][index]['icon']
            return (
              <Link
                to={url}
                key={index}
                className={['bp3-button bp3-minimal', 'bp3-icon-' + icon].join(' ')}>
                {text}
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
