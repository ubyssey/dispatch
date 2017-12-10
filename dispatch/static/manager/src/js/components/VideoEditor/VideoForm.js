import React from 'react'

import { FormInput, TextInput } from '../inputs'

export default function VideoForm(props) {

	return (
		<form>

		<FormInput
		  label='Title'
		  padded={false}
		  error={props.errors.title}>
		  <TextInput
		    placeholder='Title'
		    value={props.listItem.title || ''}
		    fill={true}
		    onChange={ e => props.update('title', e.target.value) } />
		</FormInput>
		
		<FormInput
		  label='URL'
		  padded={false}
		  error={props.errors.url}>
		  <TextInput
		    placeholder='URL'
		    value={props.listItem.url || ''}
		    fill={true}
		    onChange={ e => props.update('url', e.target.value) } />
		</FormInput>

		</form>
	)
}