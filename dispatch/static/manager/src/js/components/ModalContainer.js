import React from 'react'

require('../../styles/components/modal_container.scss')

export default function ModalContainer(props) {
  return (
    <div className='c-modal-container'>
      <div className='c-modal-container__backdrop' onClick={props.closeModal} />
      <div className='c-modal-container__body'>{props.children}</div>
    </div>
  )
}
