import React from 'react'

import { Button, Menu, Popover, Position } from '@blueprintjs/core'

import { links } from './links'

require('../../../styles/components/header.scss')

const HeaderButtons = (props) => {
  return (
    <div className='nav-link-group'>
      {
        links.map((category, i) => (
          <Popover
            key={i}
            content={
              <Menu>
                {
                  category.children.map((item, i) => (
                    <Menu.Item
                      key={i}
                      icon={item.icon}
                      onClick={() => props.goTo(item.url)}
                      text={item.text} />
                  ))
                }
              </Menu>
            }
            position={Position.BOTTOM_LEFT}>
              <Button
                minimal={true}
                icon={category.icon}>
                {category.text}
              </Button>
          </Popover>))
      }
    </div>
  )
}

export default HeaderButtons
