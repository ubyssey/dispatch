import React from 'react'
import { Link } from 'react-router'
import { links } from './links'

require('../../../styles/components/header.scss')

const HeaderButtons = () => {
  return (
    <div className='nav-link-group'>
      {
        Object.keys(links).map( key => {
          const item = links[key]
          return (
            <div
              key={key}
              className='nav-dropdown-container nav-padded'>
              <div className='nav-dropdown-button pt-minimal'>
                <span style={{marginRight:'5px'}} className={'pt-icon-standard ' + item['icon']} />
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
                        className={'pt-button pt-minimal ' + icon}>
                        {link}
                      </Link>
                    )
                  })
                }
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default HeaderButtons
