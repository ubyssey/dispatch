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
      <nav className="pt-navbar pt-dark">
        <div className="pt-navbar-group pt-align-left">
          <Link to='/' className='pt-button pt-minimal pt-icon-selection'>dispatch</Link>
          <span className="pt-navbar-divider"></span>
          <Link to='/articles/' className="pt-button pt-minimal pt-icon-document">Articles</Link>
          <Link to='/pages/' className="pt-button pt-minimal pt-icon-book">Pages</Link>
          <Link to='/widgets/' className="pt-button pt-minimal pt-icon-widget">Widgets</Link>
          <Link to='/galleries/' className="pt-button pt-minimal pt-icon-media">Galleries</Link>
          <Link to='/files/' className="pt-button pt-minimal pt-icon-folder-close">Files</Link>
          <Link to='/persons/' className="pt-button pt-minimal pt-icon-person">People</Link>
          <Link to='/events/'className="pt-button pt-minimal pt-icon-timeline-events">Events</Link>
        </div>
        <div className="pt-navbar-group pt-align-right">
          <Link to='/tags/' className="pt-button pt-minimal">Tags</Link>
          <Link to='/topics/' className="pt-button pt-minimal">Topics</Link>
          <Link to='/sections/' className="pt-button pt-minimal">Sections</Link>
          <Link to='/integrations/' className="pt-button pt-minimal">Integrations</Link>
          <span className="pt-navbar-divider"></span>
          <Link to='/profile/' className="pt-button pt-minimal pt-icon-user"></Link>
          <Link to='/logout/' className="pt-button pt-minimal pt-icon-log-out"></Link>
        </div>
      </nav>
      <LoadingBar className='c-loading-bar' />
    </header>
  )
}

// <Link to='/' className='c-header__logo'>dispatch</Link>
// <nav className='c-header__sections'>
//   <ul>{sections}</ul>
// </nav>
// <nav className='c-header__right'>
//   <ul>
//     <li className='c-header__dropdown'>
//       <a>Manage <i className='fa fa-caret-down left'></i></a>
//       <ul>
//         <li className='c-header__dropdown__link'>
//           <Link to='/widgets/'><span className='pt-icon-standard pt-icon-widget' /> widgets</Link>
//         </li>
//         <li className='c-header__dropdown__link'>
//           <Link to='/files/'><span className='pt-icon-standard pt-icon-document' /> files</Link>
//         </li>
//         <li className='c-header__dropdown__link'>
//           <Link to='/pages/'><span className='pt-icon-standard pt-icon-book' /> pages</Link>
//         </li>
//         <li className='c-header__dropdown__link'>
//           <Link to='/sections/'><span className='pt-icon-standard pt-icon-properties' /> sections</Link>
//         </li>
//         <li className='c-header__dropdown__link'>
//           <Link to='/persons/'><span className='pt-icon-standard pt-icon-person' /> persons</Link>
//         </li>
//         <li className='c-header__dropdown__link'>
//           <Link to='/integrations/'><span className='pt-icon-standard pt-icon-box' /> integrations</Link>
//         </li>
//         <li className='c-header__dropdown__link'>
//           <Link to='/tags/'><span className='pt-icon-standard pt-icon-tag' /> tags</Link>
//         </li>
//         <li className='c-header__dropdown__link'>
//           <Link to='/topics/'><span className='pt-icon-standard pt-icon-ninja' /> topics</Link>
//         </li>
//         <li className='c-header__dropdown__link'>
//           <Link to='/galleries/'><span className='pt-icon-standard pt-icon-media' /> galleries</Link>
//         </li>
//         <li className='c-header__dropdown__link'>
//           <Link to='/events/'><span className='pt-icon-standard pt-icon-timeline-events' /> events</Link>
//         </li>
//       </ul>
//     </li>
//     <li className='c-header__dropdown'>
//       <a><i className='fa fa-user right'></i> {props.email}</a>
//       <ul>
//         <li className='c-header__dropdown__link'>
//           <Link to='/profile'>manage profile</Link>
//         </li>
//         <li className='c-header__dropdown__link'>
//           <Link to='/logout'>Logout</Link>
//         </li>
//       </ul>
//     </li>
//   </ul>
// </nav>
