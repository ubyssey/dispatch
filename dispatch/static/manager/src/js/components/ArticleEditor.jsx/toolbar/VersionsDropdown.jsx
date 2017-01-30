import React from 'react';

import { Popover, Position, AnchorButton } from '@blueprintjs/core'

export default class VersionsDropdown extends React.Component {

  getVersions() {
    let versions = [];

    for (var i = this.props.revision_id; i > 0; i--) {
      versions.push(i);
    }

    return versions;
  }

  renderDropdown() {

    let versions = this.getVersions().map(
      (version) => {

        let selectedClassName = version === this.props.revision_id ? ' o-dropdown-list__item--selected' : ''
        let selectedIcon = version === this.props.revision_id ? ' pt-icon-standard pt-icon-small-tick' : ''
        let published = version === this.props.published_version ? ' (Published)' : ''

        return (
          <li
            className={`o-dropdown-list__item${selectedClassName}`}
            key={version}>
            <span className={`o-dropdown-list__item__icon${selectedIcon}`}></span>
            <span className='o-dropdown-list__item__text'>{`Version ${version}${published}`}</span>
          </li>
        )
      }
    )

    return (
      <div className='c-versions-dropdown'>
        <strong>Change version</strong>
        <ul className='o-dropdown-list'>{versions}</ul>
      </div>
    )
  }

  render() {
    return (
      <Popover
        content={this.renderDropdown()}
        position={Position.BOTTOM_LEFT}>
        <AnchorButton>{`Version ${this.props.revision_id}`}</AnchorButton>
      </Popover>
    )
  }

}
