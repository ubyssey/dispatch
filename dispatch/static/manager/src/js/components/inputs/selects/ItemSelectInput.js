import React from 'react'
import R from 'ramda'
import { Tag, Icon } from '@blueprintjs/core'

import Dropdown from '../../Dropdown'
import TextInput from '../TextInput'
import SortableList from '../SortableList'

function Item(props) {
  if (props.isSelected) {
    return (
      <li
        className='o-dropdown-list__item o-dropdown-list__item--selected'
        onClick={props.onClick}>
        <Icon className='o-dropdown-list__item__icon' icon='small-tick' />
        <span className='o-dropdown-list__item__text'>{props.text}</span>
        <Icon className='o-dropdown-list__item__icon' icon='cross' />
      </li>
    )
  } else {
    return (
      <li
        className='o-dropdown-list__item'
        onClick={props.onClick}>
        <span className='o-dropdown-list__item__icon' />
        <span className='o-dropdown-list__item__text'>{props.text}</span>
        <span className='o-dropdown-list__item__icon' />
      </li>
    )
  }
}

class ItemSelectInput extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      query: ''
    }
  }

  componentDidMount() {
    this.fetchResults()
  }

  handleInputChange(e) {
    e.preventDefault()
    this.setState(
      { query: e.target.value },
      this.fetchResults
    )
  }

  fetchResults() {
    setTimeout(() => this.props.fetchResults(this.state.query), 1)
  }

  addValue(id) {
    if (this.props.many) {
      this.props.onChange(
        R.append(id, this.getSelected()),
        this.props.extraFields
      )
    } else {
      this.props.onChange(id, this.props.extraFields)
    }

    this.closeDropdown()
  }

  removeValue(id) {
    const selected = this.getSelected()
    if (this.props.many) {
      this.props.onChange(
        R.remove(
          R.findIndex(R.equals(id), selected),
          1,
          selected
        ),
        this.props.extraFields
      )
    } else {
      this.props.onChange(null, {})
    }
  }

  clearValues() {
    if (this.props.many) {
      this.props.onChange([], {})
    } else {
      this.props.onChange(null, {})
    }
  }

  openDropdown() {
    this.refs.dropdown.open()
    if (this.state.query === '' || !this.state.query) 
      this.fetchResults()
  }

  closeDropdown() {
    this.refs.dropdown.close()
    this.setState({ query: '' })
  }

  getSelected() {
    if (this.props.many){
      if (this.props.value){
        return typeof this.props.value !== 'object' ? [this.props.value] : this.props.value
      } else {
        return []
      }
    } else {
      return this.props.value ? [this.props.value] : []
    }
  }

  hasSelected() {
    return this.getSelected().length !== 0
  }

  isNotSelected(id) {
    return !R.contains(id, this.getSelected())
  }

  renderNoResults() {
    return (
      <li className='o-dropdown-list__no-results'>No results</li>
    )
  }

  renderDropdown() {
    const selected = this.getSelected()
      .filter(id => this.props.entities[id])
      .map(id => this.props.entities[id])
      .filter(item => item)
      .map(item => (
        <Item
          key={item.id}
          isSelected={true}
          text={item[this.props.attribute]}
          onClick={() => this.removeValue(item.id)} />
      ))

    const results = this.props.results
      .filter(id => this.isNotSelected(id))
      .map(id => this.props.entities[id])
      .map(item => (
        <Item
          key={item.id}
          isSelected={false}
          text={item[this.props.attribute]}
          onClick={() => this.addValue(item.id)} />
      ))
    const createButton = this.props.create ? (
      <button
        className='bp3-button c-input--item-select__search__button'
        onClick={() => this.props.create(this.state.query, data => this.addValue(data.id))}>
        Add
      </button>
    ) : null

    return (
      <div className='c-input--item-select__dropdown'>
        <div className='c-input--item-select__search'>
          <div className='bp3-control-group'>
            <TextInput
              onChange={e => this.handleInputChange(e)}
              value={this.state.query}
              fill={true}
              placeholder='Search' />
            {createButton}
          </div>
        </div>
        <ul className='o-dropdown-list'>
          {selected.length ? selected : null}
          {results.length ? results : this.renderNoResults()}
        </ul>
      </div>
    )
  }

  updateExtraField(id, option) {
    const extraFields = R.assoc(id, option, this.props.extraFields)
    this.props.onChange(this.getSelected(), extraFields)
  }

  renderSortableList() {
    const extraFields = this.props.extraFieldOptions.map(field => (
      <option
        key={field[1]}
        value={field[1]}>{field[0]}</option>
    ))

    const extraFieldsSelect = (item) => (
      <div className='c-input--item-select__item'>
        <div className='c-panel__select'>{item[this.props.attribute]}</div>
        <select
          className='bp3-button c-panel__select__right'
          value={this.props.extraFields[item.id]}
          onChange={e => this.updateExtraField(item.id, e.target.value)}>{extraFields}</select>
      </div>
    )

    const standardSelect = (item) => (
      <div className='c-input--item-select__item'>{item[this.props.attribute]}</div>
    )

    return (
      <SortableList
        items={this.getSelected()}
        entities={this.props.entities}
        onChange={selected => this.props.onChange(selected, this.props.extraFields)}
        renderItem={item =>
          this.props.extraFieldOptions.length ? extraFieldsSelect(item) : standardSelect(item)
        } />
    )
  }

  render() {
    const selected = this.getSelected()

    const Button = (
      <a onClick={() => this.openDropdown()}>
        {this.props.editMessage}
      </a>
    )

    const tagButton = selected.length ? (
      <Tag
        large={true}
        round={true}
        icon={this.props.icon}
        interactive={true}
        onRemove={(e) => {
          this.clearValues()
          e.stopPropagation()
        }}
        onClick={() => this.openDropdown()}>
          {this.props.editMessage}
      </Tag>
    ) : (
      <Tag
        large={true}
        round={true}
        icon={this.props.icon}
        interactive={true}
        onClick={() => this.openDropdown()}>
          {this.props.editMessage}
      </Tag>
    )

    const error = (
      <span className='c-form__input__error bp3-tag bp3-intent-danger'>
        {Array.isArray(this.props.error) ? this.props.error.join(' ') : this.props.error}
      </span>
    )  

    return (
      <div
        className={`c-input c-input--item-select ${this.props.className}`}>
        {this.props.showSortableList ? this.renderSortableList() : null }
        <Dropdown
          ref='dropdown'
          content={this.renderDropdown()}
          inline={this.props.inline}>
          {this.props.tag ? tagButton : Button}
        </Dropdown>
        {this.props.error ? error : null}
      </div>
    )
  }
}

ItemSelectInput.defaultProps = {
  many: true,
  results: [],
  entities: {},
  extraFields: {},
  extraFieldOptions: [],
  showSortableList: true,
  inline: true
}

export default ItemSelectInput
