import React from 'react'
import R from 'ramda'
import { MdClose } from 'react-icons/lib/md'

import TextInput from './TextInput.jsx'

export default class MultiSelectInput extends React.Component {

  constructor(props) {
    super(props)
    this.removeValue = this.removeValue.bind(this)
    this.pageClick = this.pageClick.bind(this)
    this.mouseDownHandler = this.mouseDownHandler.bind(this)
    this.mouseUpHandler = this.mouseUpHandler.bind(this)

    this.mouseIsDownOnField = false;

    this.state = {
      isActive: false
    }
  }
  componentDidMount() {
    window.addEventListener('mousedown', this.pageClick, false)
    this.fetchResults('')
  }

  pageClick(e) {
    if (this.mouseIsDownOnField) {
      this.setState({ isActive: true })
    } else {
      this.setState({ isActive: false })
    }
  }

  mouseDownHandler() {
    this.mouseIsDownOnField = true
  }

  mouseUpHandler() {
    this.mouseIsDownOnField = false
  }

  fetchResults(query) {
    this.props.fetchResults(query)
  }

  removeValue(id) {
    let newValues = R.remove(
      R.findIndex(R.propEq('id', id), this.props.values),
      1,
      this.props.values
    )

    this.props.onUpdate(newValues)
  }

  render() {
    const values = this.props.values || []

    const selected = this.props.values.map( value => {
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

    const results = this.props.results.map( value => {
      return (
        <li
          className='c-input--multi-select__result'
          key={value.id}>{value[this.props.attribute]}</li>
      )
    })

    const dropdownBaseClassName = 'c-input--multi-select__dropdown'
    const dropdownClassName = dropdownBaseClassName + (this.state.isActive ? ` ${dropdownBaseClassName}--active` : '')

    return (
      <div
        className='c-input c-input--multi-select'
        onMouseDown={this.mouseDownHandler}
        onMouseUp={this.mouseUpHandler}>
        <ul className='c-input--multi-select__values'>
          {selected}
        </ul>
        <div className={dropdownClassName}>
          <TextInput placeholder='Add new' />
          <ul className='c-input--multi-select__results'>
            {results}
          </ul>
        </div>
      </div>
    )
  }
}
