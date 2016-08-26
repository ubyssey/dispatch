import React from 'react'
import { Link } from 'react-router'

export default function Header(props) {
  return (
    <header className='c-header'>
      <Link to='/' className='c-header__logo'>
        <i className='c-header__logo-icon fa fa-circle'></i>dispatch
      </Link>
      <ul>
        <li>News</li>
        <li>Sports</li>
        <li>Culture</li>
        <li>Opinion</li>
        <li>Features</li>
        <li>Science</li>
        <li>Blog</li>
      </ul>
      <ul className='right'>
        <li className='dropdown'>
          Manage<i className='fa fa-caret-down left'></i>
          <ul>
            <li><i className='fa fa-wrench right'></i>components</li>
            <li><i className='fa fa-file-o right'></i>files</li>
            <li><i className='fa fa-file-text-o right'></i>pages</li>
            <li><i className='fa fa-list right'></i>sections</li>
            <li><i className='fa fa-users right'></i>people</li>
          </ul>
        </li>
        <li className='dropdown'>
          <i className='fa fa-user right'></i> {props.user.email}
          <ul>
            <li>manage profile</li>
            <li>logout</li>
          </ul>
        </li>
      </ul>
    </header>
  )
}
