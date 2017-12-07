import React from 'react'

import ItemSelectInput from '../selects/ItemSelectInput'


class FilterSelectInput extends React.Component {

  render() {

    return (
      <ItemSelectInput
        many={false}
        selected={this.props.selected}
        inline={false}
        showSortableList={false}
        results={this.props.results.ids}
        entities={this.props.entities}
        onChange={(selected) => this.props.update(selected)}
        fetchResults={this.props.fetchResults}
        attribute={this.props.attribute}
        editMessage={this.props.editMessage}
        filterButton={true} />
    )
  }

}




export default FilterSelectInput
