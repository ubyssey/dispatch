import React from 'react'
import R from 'ramda'
import { MdClose } from 'react-icons/lib/md'

import TextInput from './TextInput.jsx'

export default class MultiSelectInput extends React.Component {

  constructor(props) {
    super(props)
    this.removeValue = this.removeValue.bind(this)
    this.pageClick = this.pageClick.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)

    this.mouseIsDownOnField = false;

    this.state = {
      isActive: false,
      query: ''
    }
  }
  componentDidMount() {
    window.addEventListener('mousedown', this.pageClick, false)
    this.fetchResults()
  }

  pageClick(e) {
    if (this.mouseIsDownOnField) {
      this.setState({ isActive: true })
    } else {
      this.setState({ isActive: false })
    }
  }

  handleMouseDown() {
    this.mouseIsDownOnField = true
  }

  handleMouseUp() {
    this.mouseIsDownOnField = false
  }

  handleInputChange(e) {
    e.preventDefault();
    this.setState({ query: e.target.value }, this.fetchResults)
  }

  fetchResults() {
    this.props.fetchResults(this.state.query)
  }

  removeValue(id) {
    let newValues = R.remove(
      R.findIndex(R.equals(id), this.props.selected),
      1,
      this.props.selected
    )

    this.props.onUpdate(newValues)
  }

  addValue(id) {
    let newValues = R.append(id, this.props.selected)

    this.props.onUpdate(newValues)
  }

  render() {
    const selected = this.props.selected.map( id => {
      const value = this.props.entities[id];
      return (
        <li
          className='c-input--multi-select__value'
          key={value.id}>
          {value[this.props.attribute]}
            <div
              className='c-input--multi-select__value__icon'
              onClick={() => this.removeValue(value.id)}>
              <MdClose size={18} />
            </div>
          </li>
      )
    })

    const results = this.props.results.map( id => {
      const value = this.props.entities[id];
      return (
        <li
          key={value.id}
          className='c-input--multi-select__result'
          onClick={() => this.addValue(value.id)}>{value[this.props.attribute]}</li>
      )
    })

    const dropdownBaseClassName = 'c-input--multi-select__dropdown'
    const dropdownClassName = dropdownBaseClassName + (this.state.isActive ? ` ${dropdownBaseClassName}--active` : '')

    return (
      <div
        className='c-input c-input--multi-select'
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}>
        <ul className='c-input--multi-select__values'>
          {selected}
        </ul>
        <div className={dropdownClassName}>
          <TextInput
            onChange={this.handleInputChange}
            placeholder='Add new' />
          <ul className='c-input--multi-select__results'>
            {results}
          </ul>
        </div>
      </div>
    )
  }
}
