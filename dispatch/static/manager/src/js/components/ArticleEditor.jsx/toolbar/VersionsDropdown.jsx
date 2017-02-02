import React from 'react';

import { AnchorButton } from '@blueprintjs/core'

import Dropdown from '../../Dropdown.jsx'

export default class VersionsDropdown extends React.Component {

  getVersions() {
    let versions = [];

    for (var i = this.props.latest_version; i > 0; i--) {
      versions.push(i);
    }

    return versions;
  }

  selectVersion(version) {
    this.props.fetchArticleVersion(version)
    this.refs.dropdown.close()
  }

  renderDropdown() {

    let versions = this.getVersions().map(
      (version) => {

        let selectedClassName = version === this.props.current_version ? ' o-dropdown-list__item--selected' : ''
        let selectedIcon = version === this.props.current_version ? ' pt-icon-standard pt-icon-small-tick' : ''
        let published = version === this.props.published_version ? ' (Published)' : ''

        return (
          <li
            className={`o-dropdown-list__item${selectedClassName}`}
            key={version}
            onClick={e => this.selectVersion(version)}>
            <span className={`o-dropdown-list__item__icon${selectedIcon}`}></span>
            <span className='o-dropdown-list__item__text'>{`Version ${version}${published}`}</span>
          </li>
        )
      }
    )

    return (
      <div className='c-versions-dropdown'>
        <ul className='o-dropdown-list'>{versions}</ul>
      </div>
    )
  }

  render() {

    if (this.props.latest_version) {
      return (
        <Dropdown
          ref='dropdown'
          content={this.renderDropdown()}>
          <AnchorButton onClick={e => this.refs.dropdown.open()}>
            {`Version ${this.props.current_version}`}
          </AnchorButton>
        </Dropdown>
      )
    } else {
      return (
        <AnchorButton disabled={true}>Version 1</AnchorButton>
      )
    }

  }

}
