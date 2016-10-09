import React from 'react'

export default function ModalContainer(props) {
  return (
    <div className='c-modal-container'>
      <div className='c-modal-container__backdrop' onClick={props.closeModal}></div>
      <div className='c-modal-container__body'>{props.children}</div>
    </div>
  )
}
