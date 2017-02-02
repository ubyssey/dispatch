import React from 'react';

export default class BasicContainer extends React.Component {

  render() {

    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
