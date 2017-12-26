import React from 'react'
import R from 'ramda'

import Dropdown from '../../Dropdown'

import TextInput from '../TextInput'

import SortableList from '../SortableList'

function Item(props) {
  if (props.isSelected) {
    return (
      <li
        className='o-dropdown-list__item o-dropdown-list__item--selected'
        onClick={props.onClick}>
        <span className='o-dropdown-list__item__icon pt-icon-standard pt-icon-small-tick'></span>
        <span className='o-dropdown-list__item__text'>{props.text}</span>
        <span className='o-dropdown-list__item__icon pt-icon-standard pt-icon-cross'></span>
      </li>
    )
  } else {
    return (
      <li
        className='o-dropdown-list__item'
        onClick={props.onClick}>
        <span className='o-dropdown-list__item__icon'></span>
        <span className='o-dropdown-list__item__text'>{props.text}</span>
        <span className='o-dropdown-list__item__icon'></span>
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

  closeDropdown() {
    this.refs.dropdown.close()
    this.setState({ query: '' })
  }

  getSelected() {
    return this.props.many ? (this.props.selected || []) : (this.props.selected ? [this.props.selected] : [])
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
        className='pt-button c-input--item-select__search__button'
        onClick={() => this.props.create(this.state.query, data => this.addValue(data.id))}>
        Add
      </button>
    ) : null

    return (
      <div className='c-input--item-select__dropdown'>
        <div className='c-input--item-select__search'>
          <div className='pt-control-group'>
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
      <option key={field[1]}>{field[0]}</option>
    ))

    const extraFieldsSelect = (item) => (
      <div className='c-input--item-select__item'>
        <div className='c-panel__select'>{item[this.props.attribute]}</div>
        <select
          className='pt-button c-panel__select__right'
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
    const anchorButton = (
      <a onClick={() => this.refs.dropdown.open()}>
        {this.props.editMessage}
      </a>
    )

    const filterButton = (
      <div>
        <div className='pt-control-group'>
          <button className={`pt-button pt-icon-${this.props.filterIcon}`}>
            {this.props.filterLabel}
          </button>
          <button
            className='pt-button c-item-list__header__filters__filter'
            onClick={() => this.refs.dropdown.open()}>
            {this.props.editMessage}
            <span className='pt-icon-standard pt-icon-caret-down pt-align-right'></span>
          </button>
        </div>
      </div>
    )

    return (
      <div
        className='c-input c-input--item-select'>
        {this.props.showSortableList ? this.renderSortableList() : null }
        <Dropdown
          ref='dropdown'
          content={this.renderDropdown()}
          inline={this.props.inline}>
          {this.props.filterButton ? filterButton : anchorButton}
        </Dropdown>
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
