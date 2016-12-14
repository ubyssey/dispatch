import React from 'react'
import R from 'ramda'

import { Popover, Menu, MenuItem, Button, Position } from '@blueprintjs/core'

import TextInput from './TextInput.jsx'

export default class MultiSelectInput extends React.Component {

  constructor(props) {
    super(props)

    this.removeValue = this.removeValue.bind(this)
    this.pageClick = this.pageClick.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)

    this.renderSelected = this.renderSelected.bind(this)
    this.renderResult = this.renderResult.bind(this)
    this.isNotSelected = this.isNotSelected.bind(this)

    this.mouseIsDownOnField = false;

    this.state = {
      isActive: false,
      query: ''
    }
  }

  componentDidMount() {
    // Add page click event listener
    window.addEventListener('mousedown', this.pageClick, false)

    this.fetchResults()
  }

  componentWillUnmount() {
    // Remove page click event listener
    window.removeEventListener('mousedown', this.pageClick)
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
    this.setState(
      {
        query: e.target.value,
        isActive: true
      },
      this.fetchResults
    )
  }

  fetchResults() {
    this.props.fetchResults(this.state.query)
  }

  removeValue(id) {
    this.props.removeValue(id)
  }

  addValue(id) {
    this.props.addValue(id)
    this.closeDropdown()
  }

  createValue(value) {
    // Get entities in search results
    const results = R.map(
      id => this.props.entities[id],
      this.props.results
    )

    // Get currently selected entities
    const selected = R.map(
      id => this.props.entities[id],
      this.props.selected
    )

    // Determine if the value has already been created
    let resultIndex = R.findIndex(
      R.propEq(this.props.attribute, value),
      results
    )

    let isResult = resultIndex !== -1

    // Determine if value has already been added to selection
    let isSelected = R.findIndex(
      R.propEq(this.props.attribute, value),
      selected
    ) !== -1

    if (isResult && !isSelected) {
      // If value is in results and not selected, add to selection
      this.props.addValue(results[resultIndex].id)
      this.closeDropdown()
    } else if (!isResult && !isSelected) {
      // If value is not in results or selected, create and add to selection
      this.props.createValue(value)
      this.closeDropdown()
    }

  }

  closeDropdown() {
    this.setState({
      isActive: false,
      query: ''
    })
  }

  renderSelected(id) {
    const value = this.props.entities[id]
    return (
      <li
        className='c-input--multi-select__value'
        key={value.id}>{value[this.props.attribute]}</li>
    )
  }

  isSelected(id) {
    return R.contains(id, this.props.selected)
  }

  isNotSelected(id) {
    return !this.isSelected(id)
  }

  renderResult(id) {
    const value = this.props.entities[id]
    const isSelected = this.isSelected(id)

    if (isSelected) {
      return (
        <li
          key={value.id}
          className='c-input--multi-select__result c-input--multi-select__result--selected'
          onClick={() => this.removeValue(value.id)}>
            <span className='c-input--multi-select__result__icon pt-icon-standard pt-icon-small-tick'></span>
            <span className='c-input--multi-select__result__text'>{value[this.props.attribute]}</span>
            <span className='c-input--multi-select__result__icon pt-icon-standard pt-icon-cross'></span>
        </li>
      )
    } else {
      return (
        <li
          key={value.id}
          className='c-input--multi-select__result'
          onClick={() => this.addValue(value.id)}>
            <span className='c-input--multi-select__result__icon'></span>
            <span className='c-input--multi-select__result__text'>{value[this.props.attribute]}</span>
            <span className='c-input--multi-select__result__icon'></span>
        </li>
      )
    }

  }

  renderNoResults() {
    if (this.props.createValue) {
      return (
        <li
          className='c-input--multi-select__result'
          onClick={() => this.createValue(this.state.query.trim()) }>
          <span className='c-input--multi-select__result__icon pt-icon-standard pt-icon-add'></span>
          <span className='c-input--multi-select__result__text'>{`Create "${this.state.query.trim()}"`}</span>
          <span className='c-input--multi-select__result__icon'></span>
        </li>
      )
    } else {
      return (
        <li className='c-input--multi-select__result'>No results</li>
      )
    }
  }

  renderMenu() {
    const selected = R.map(this.renderResult, this.props.selected)
    const results = R.map(this.renderResult, R.filter(this.isNotSelected, this.props.results))

    return (
      <div className='c-input--multi-select__dropdown'>
        <div className='c-input--multi-select__search'>
          <TextInput
            onChange={this.handleInputChange}
            value={this.state.query}
            fill={true}
            placeholder='Search' />
        </div>
        <ul className='c-input--multi-select__results'>
          {selected.length ? selected : null}
          {results.length ? results : this.renderNoResults()}
        </ul>
      </div>
    )
  }

  render() {
    const selected = R.map(this.renderSelected, this.props.selected)

    return (
      <div
        className='c-input c-input--multi-select'>
        <ul className='c-input--multi-select__values'>
          {selected}
        </ul>
        <Popover content={this.renderMenu()} position={Position.BOTTOM_LEFT}>
          <a href="#">{this.props.editMessage}</a>
        </Popover>
      </div>
    )
  }
}
