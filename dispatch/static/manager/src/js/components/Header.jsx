import React from 'react'
import { Link } from 'react-router'
import LoadingBar from 'react-redux-loading-bar'

export default function Header(props) {

  const sections = props.sections.map( section => {
    return (
      <li className='c-header__link' key={section.id}>
        <Link to={{ pathname: '/articles/', query: { section: section.id }}}>{section.name}</Link>
      </li>
    )
  })

  return (
    <header className='c-header'>
      <div className='c-header__inner'>
        <Link to='/' className='c-header__logo'>
          <i className='c-header__logo-icon fa fa-circle'></i>dispatch
        </Link>
        <nav className='c-header__sections'>
          <ul>{sections}</ul>
        </nav>
        <nav className='c-header__right'>
          <ul>
            <li className='c-header__dropdown'>
              <a>Manage<i className='fa fa-caret-down left'></i></a>
              <ul>
                <li className='c-header__dropdown__link'>
                  <Link to='/components'><i className='fa fa-wrench right'></i>components</Link>
                </li>
                <li className='c-header__dropdown__link'>
                  <Link to='/files'><i className='fa fa-file-o right'></i>files</Link>
                </li>
                <li className='c-header__dropdown__link'>
                  <Link to='/pages'><i className='fa fa-file-text-o right'></i>pages</Link>
                </li>
                <li className='c-header__dropdown__link'>
                  <Link to='/sections'><i className='fa fa-list right'></i>sections</Link>
                </li>
                <li className='c-header__dropdown__link'>
                  <Link to='/people'><i className='fa fa-users right'></i>people</Link>
                </li>
              </ul>
            </li>
            <li className='c-header__dropdown'>
              <a><i className='fa fa-user right'></i> {props.email}</a>
              <ul>
                <li className='c-header__dropdown__link'>
                  <Link to='/profile'>manage profile</Link>
                </li>
                <li className='c-header__dropdown__link'>
                  <Link to='/logout'>logout</Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
      <LoadingBar />
    </header>
  )
}
