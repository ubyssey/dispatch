import React from 'react'

import { AnchorButton, Intent } from '@blueprintjs/core'

import { FormInput, TextInput, SelectInput } from '../inputs'

function fbLoginURI(clientId, redirectURI) {
  return `https://www.facebook.com/v2.8/dialog/oauth?client_id=${clientId}&redirect_uri=${window.location.origin}/admin${redirectURI}?callback=1&scope=pages_manage_instant_articles,pages_show_list`
}

export function InstantArticlesClientEditor(props) {
  /* Renders a panel with fields to edit the Facebook client information */

  const cancelButton = (
    <AnchorButton
      onClick={props.exitEditMode}>
      Cancel
    </AnchorButton>
  )

  return (
    <div>
      <FormInput label='Facebook App ID'>
        <TextInput
          placeholder='App ID'
          value={props.clientId || ''}
          fill={true}
          onChange={e => props.onChange({ client_id: e.target.value }) } />
      </FormInput>

      <FormInput label='Facebook App Secret'>
        <TextInput
          placeholder='App Secret'
          value={props.clientSecret || ''}
          fill={true}
          type='password'
          onChange={e => props.onChange({ client_secret: e.target.value }) } />
      </FormInput>

      <FormInput>
        <AnchorButton
          intent={Intent.SUCCESS}
          onClick={props.onSave}>
          Save settings
        </AnchorButton>
        {props.editMode ? cancelButton : null}
      </FormInput>
    </div>
  )
}

export function InstantArticlesPageEditor(props) {
  /* Renders a panel that either shows a Facebook login button or a dropdown list of pages */

  const pages = <InstantArticlesPageDropdown
    pages={props.pages || []}
    onChange={props.onChange}
    onSave={props.onSave} />

  const login = <InstanceArticlesLogin
    clientId={props.clientId}
    pathname={props.pathname} />

  return (
    <div>
      <FormInput label='Facebook App ID'>
        <TextInput
          disabled={true}
          value={props.clientId}
          fill={true} />

        <AnchorButton onClick={props.enterEditMode}>
          Change app information
        </AnchorButton>
      </FormInput>

      {props.pages ? pages : login}

    </div>
  )
}

export function InstantArticlesEnabledEditor(props) {
  /* Renders a panel that shows the currently enabled Facebook Page, with option to remove */

  return (
    <FormInput label={`Instant Articles is enabled for ${props.pageName}`}>
      <br />
      <AnchorButton
        onClick={props.onDelete}
        intent={Intent.DANGER}>
        Remove integration
      </AnchorButton>
    </FormInput>
  )
}

function InstanceArticlesLogin(props) {
  /* Renders a button that opens a Facebook login dialog */

  return (
    <FormInput label='Authenticate with Facebook'>
      <br />
      <AnchorButton
        href={fbLoginURI(props.clientId, props.pathname)}
        intent={Intent.PRIMARY}>Authenticate with Facebook</AnchorButton>
    </FormInput>
  )
}

function InstantArticlesPageDropdown(props) {
  /* Renders a dropdown list to select a Facebook page */

  const pageMap = props.pages.reduce((pageMap, page) => {
    pageMap[page.id] = page
    return pageMap
  }, {})

  const options = props.pages.map(page => ({ value: page.id, label: page.name }))

  return (

    <FormInput label='Choose a Facebook Page to connect'>
      <SelectInput
        options={options}
        selected={props.selected}
        onChange={e => props.onChange(pageMap[e.target.value])} />
        <AnchorButton
          onClick={props.onSave}
          intent={Intent.SUCCESS}>
          Enable Instant Articles
        </AnchorButton>
    </FormInput>

  )
}
