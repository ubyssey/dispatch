import React from 'react'
import { TextInput } from '../inputs'

export default class ItemListSearchBar extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      query: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.searchItems(this.state.query)
  }

  handleChange(e) {
    this.setState({ query: e.target.value })
  }

  render() {
    return (
      <div className='c-item-list__searchbar'>
        <form onSubmit={this.handleSubmit}>
          <TextInput
            value={this.state.query}
            placeholder='Search'
            onChange={this.handleChange} />
        </form>
      </div>
    )
  }
}
