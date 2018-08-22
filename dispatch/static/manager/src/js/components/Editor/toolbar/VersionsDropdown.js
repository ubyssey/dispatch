import React from 'react'

import { Button } from '@blueprintjs/core'

import Dropdown from '../../Dropdown'

require('../../../../styles/components/versions_dropdown.scss')

export default class VersionsDropdown extends React.Component {

  getVersions() {
    let versions = []

    for (var i = this.props.latest_version; i > 0; i--) {
      versions.push(i)
    }

    return versions
  }

  selectVersion(version) {
    this.props.getVersion(version)
    this.refs.dropdown.close()
  }

  renderDropdown() {
    let versions = this.getVersions().map(
      (version) => {

        let selectedClassName = version === this.props.current_version ? ' o-dropdown-list__item--selected' : ''
        let selectedIcon = version === this.props.current_version ? ' bp3-icon-standard bp3-icon-small-tick' : ''
        let published = version === this.props.published_version ? ' (Published)' : ''

        return (
          <li
            className={`o-dropdown-list__item${selectedClassName}`}
            key={version}
            onClick={() => this.selectVersion(version)}>
            <span className={`o-dropdown-list__item__icon${selectedIcon}`} />
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
          <Button
            rightIcon='caret-down'
            onClick={() => this.refs.dropdown.open()}>{`Version ${this.props.current_version}`}</Button>
        </Dropdown>
      )
    } else {
      return (
        <Button disabled={true}>Version 1</Button>
      )
    }

  }

}
