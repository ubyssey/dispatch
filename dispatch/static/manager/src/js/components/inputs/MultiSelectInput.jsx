import React from 'react'

export default class MultiSelectInput extends React.Component {

  componentDidMount() {

  }

  render() {
    const values = this.props.values || []

    const selected = this.props.values.map( value => {
      return (
        <li
          className='c-input--multi-select__value'
          key={value.id}>
          {value[this.props.attribute]}</li>
      )
    })

    return (
      <div className='c-input c-input--multi-select'>
        <ul>
          {selected}
          <li className='c-input--multi-select__add'>Add new</li>
        </ul>

      </div>
    )
  }
}
