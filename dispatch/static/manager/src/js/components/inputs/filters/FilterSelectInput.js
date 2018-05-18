import React from 'react'
import ItemSelectInput from '../selects/ItemSelectInput'

class FilterSelectInput extends React.Component {

  getEditMessage() {
    if (this.props.entities[this.props.selected]) {
      return this.props.entities[this.props.selected][this.props.attribute]
    }
    return this.props.editMessage
  }

  render() {
    return (
      <ItemSelectInput
        many={this.props.many}
        selected={this.props.selected}
        inline={false}
        showSortableList={false}
        results={this.props.results.ids}
        entities={this.props.entities}
        onChange={(selected) => this.props.update(selected)}
        fetchResults={this.props.fetchResults}
        attribute={this.props.attribute}
        editMessage={this.getEditMessage()}
        filterButton={true}
        filterLabel={this.props.label}
        filterIcon={this.props.icon} />
    )
  }
}

export default FilterSelectInput
