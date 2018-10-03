import React from 'react'
import ItemSelectInput from '../selects/ItemSelectInput'

class FilterSelectInput extends React.Component {

  getEditMessage() {
    if (this.props.entities[this.props.value]) {
      return this.props.entities[this.props.value][this.props.attribute]
    }
    return this.props.editMessage
  }

  render() {
    return (
      <ItemSelectInput
        className='c-input--filter'
        many={false}
        value={this.props.value}
        inline={true}
        showSortableList={false}
        results={this.props.results.ids}
        entities={this.props.entities}
        onChange={(value) => this.props.update(value)}
        fetchResults={this.props.fetchResults}
        attribute={this.props.attribute}
        editMessage={this.getEditMessage()}
        tag={true}
        filterLabel={this.props.label}
        icon={this.props.icon} />
    )
  }
}

export default FilterSelectInput
