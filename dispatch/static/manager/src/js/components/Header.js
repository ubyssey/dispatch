import React from 'react'
import { Link } from 'react-router'
import LoadingBar from 'react-redux-loading-bar'

require('../../styles/components/header.scss')
require('../../styles/components/loading_bar.scss')

export default function Header(props) {

  const sections = props.sections.map(section => {
    return (
      <li className='c-header__link' key={section.id}>
        <Link to={{ pathname: '/articles/', query: { section: section.id }}}>{section.name}</Link>
      </li>
    )
  })

  return (
    <header className='c-header'>
      <div className='c-header__inner u-container'>
        <Link to='/' className='c-header__logo'>dispatch</Link>
        <nav className='c-header__sections'>
          <ul>{sections}</ul>
        </nav>
        <nav className='c-header__right'>
          <ul>
            <li className='c-header__dropdown'>
              <a>Manage <i className='fa fa-caret-down left'></i></a>
              <ul>
                <li className='c-header__dropdown__link'>
                  <Link to='/widgets/'><span className='pt-icon-standard pt-icon-widget' /> widgets</Link>
                </li>
                <li className='c-header__dropdown__link'>
                  <Link to='/files/'><span className='pt-icon-standard pt-icon-document' /> files</Link>
                </li>
                <li className='c-header__dropdown__link'>
                  <Link to='/pages/'><span className='pt-icon-standard pt-icon-book' /> pages</Link>
                </li>
                <li className='c-header__dropdown__link'>
                  <Link to='/sections/'><span className='pt-icon-standard pt-icon-properties' /> sections</Link>
                </li>
                <li className='c-header__dropdown__link'>
                  <Link to='/persons/'><span className='pt-icon-standard pt-icon-person' /> persons</Link>
                </li>
                <li className='c-header__dropdown__link'>
                  <Link to='/integrations/'><span className='pt-icon-standard pt-icon-box' /> integrations</Link>
                </li>
                <li className='c-header__dropdown__link'>
                  <Link to='/tags/'><span className='pt-icon-standard pt-icon-tag' /> tags</Link>
                </li>
                <li className='c-header__dropdown__link'>
                  <Link to='/topics/'><span className='pt-icon-standard pt-icon-ninja' /> topics</Link>
                </li>
                <li className='c-header__dropdown__link'>
                  <Link to='/galleries/'><span className='pt-icon-standard pt-icon-media' /> galleries</Link>
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
      <LoadingBar className='c-loading-bar' />
    </header>
  )
}
