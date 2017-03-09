import React from 'react'
import { Link } from 'react-router'

require('../../styles/components/sidebar_nav.scss')

export default function SidebarNav(props) {

  let items = props.items.map((item, i) => (
    <li className='c-sidebar-nav__link' key={i}>
      <Link to={item.path}>{item.label}</Link>
    </li>
  ))

  return (
    <nav className='c-sidebar-nav'>
      <h2 className='c-sidebar-nav__title'>{props.title}</h2>
      <ul>{items}</ul>
    </nav>
  )

}
