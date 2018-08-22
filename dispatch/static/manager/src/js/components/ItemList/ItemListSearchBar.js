import React from 'react'
import { SearchInput } from '../inputs'

export default class ItemListSearchBar extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      query: this.props.query || ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ query: nextProps.query || '' })
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.searchItems(this.state.query)
  }

  render() {
    return (
      <div className='c-item-list__searchbar'>
        <form onSubmit={e => this.handleSubmit(e)}>
          <SearchInput
            value={this.state.query}
            placeholder='Search'
            onChange={e => this.setState({ query: e.target.value })} />
        </form>
      </div>
    )
  }
}
