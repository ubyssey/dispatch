import React from 'react'
import { Link } from 'react-router'

export default function SidebarNav(props) {

  let items = props.items.map((item, i) => {
    return (
      <li className='c-sidebar-nav__link' key={i}>
        <Link to={item.path}>{item.label}</Link>
      </li>
    )
  })

  return (
    <nav className='c-sidebar-nav'>
      <ul>{items}</ul>
    </nav>
  )

}
