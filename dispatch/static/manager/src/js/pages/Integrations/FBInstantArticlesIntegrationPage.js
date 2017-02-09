import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'

import { FormSection, FormInput, TextInput, SelectInput } from '../../components/inputs'
import { AnchorButton, Intent } from '@blueprintjs/core'

import * as integrationActions from '../../actions/IntegrationActions'

const DISPATCH_APP_ID = '1747937028850008'
const DISPTACH_REDIRECT_URI = 'http://localhost:8000/admin/integrations/fb-instant-articles/?callback=1'

const facebookLoginURI = `https://www.facebook.com/v2.8/dialog/oauth?client_id=${DISPATCH_APP_ID}&redirect_uri=${DISPTACH_REDIRECT_URI}&scope=pages_manage_instant_articles,pages_show_list`

class FBInstantArticlesIntegrationPageComponent extends React.Component {

  constructor(props) {
    super(props)

    this.cachedSettings = null

    this.state = {
      editMode: false
    }
  }

  componentWillMount() {

    this.props.fetchIntegration(this.props.token, 'fb-instant-articles')

    if (this.props.location.query.callback) {
      this.props.integrationCallback(
        this.props.token,
        'fb-instant-articles',
        this.props.location.query
      );
    }

  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.integration && nextProps.integration.settings && nextProps.integration.settings.client_configured) {
      this.setState({ editMode: false })
    }

  }

  enterEditMode() {
    // Temporarily save old settings so we can revert
    this.cachedSettings = this.props.integration.settings

    this.updateSettings({ client_configured: false })
    this.setState({ editMode: true })
  }

  exitEditMode() {
    // Revert old settings
    this.updateSettings(this.cachedSettings)

    this.setState({ editMode: false })
  }

  saveIntegration(integration) {
    this.props.saveIntegration(this.props.token, 'fb-instant-articles', integration)
  }

  updateSettings(settings) {
    return this.props.updateIntegration(
      'fb-instant-articles',
      { settings: R.merge(this.props.integration.settings, settings) }
    )
  }

  updateFacebookPage(page) {
    return this.updateSettings({
      page_id: page.id,
      page_name: page.name,
      page_access_token: page.access_token
    })
  }

  renderFacebookPages(integration) {

    let pageMap = {}

    let options = integration.callback.pages.data.map(page => {

      // Add access token to map
      pageMap[page.id] = page

      return {
        'value': page.id,
        'label': page.name
      }
    })

    return (

      <FormInput label='Choose a Facebook Page to connect'>
        <SelectInput
          options={options}
          onChange={e => this.updateFacebookPage(pageMap[e.target.value])} />
          <AnchorButton
            onClick={ e => this.props.saveIntegration(this.props.token, 'fb-instant-articles', integration)}
            intent={Intent.SUCCESS}>
            Enable Instant Articles
          </AnchorButton>
      </FormInput>

    )
  }

  renderFacebookLogin() {
    return (
      <FormInput label='Authenticate with Facebook'>
        <br />
        <AnchorButton
          href={facebookLoginURI}
          intent={Intent.PRIMARY}>Authenticate with Facebook</AnchorButton>
      </FormInput>
    )
  }

  renderFacebookInstantArticles(integration) {

    let settings = integration.settings || {}
    let callback = integration.callback || {}

    if (settings.page_configured) {
      return (
        <FormInput label={`Instant Articles is enabled for ${settings.page_name}`}>
          <br />
          <AnchorButton
            onClick={e => this.props.deleteIntegration(this.props.token, 'fb-instant-articles')}
            intent={Intent.DANGER}>
            Remove integration
          </AnchorButton>
        </FormInput>
      )
    }

    if (settings.client_configured && !this.state.editMode) {
      return (

        <div>
          <FormInput label='Facebook App ID'>
            <TextInput
              disabled={true}
              value={settings.client_id}
              fill={true} />

            <AnchorButton onClick={e => this.enterEditMode()}>
              Change app information
            </AnchorButton>
          </FormInput>

          {callback.pages ? this.renderFacebookPages(integration) : this.renderFacebookLogin()}

        </div>
      )
    }

    let cancelButton = (
      <AnchorButton
        onClick={ e => this.exitEditMode()}>
        Cancel
      </AnchorButton>
    )

    return (
      <div>
        <FormInput label='Facebook App ID'>
          <TextInput
            placeholder='App ID'
            value={settings.client_id || ''}
            fill={true}
            onChange={ e => this.updateSettings({ client_id: e.target.value }) } />
        </FormInput>

        <FormInput label='Facebook App Secret'>
          <TextInput
            placeholder='App Secret'
            value={settings.client_secret || ''}
            fill={true}
            onChange={ e => this.updateSettings({ client_secret: e.target.value }) } />
        </FormInput>

        <FormInput>
          <AnchorButton
            intent={Intent.SUCCESS}
            onClick={ e => this.saveIntegration(integration)}>
            Save settings
          </AnchorButton>
          {this.state.editMode ? cancelButton : null}
        </FormInput>
      </div>
    )

  }

  render() {

    let integration = this.props.integration

    if (integration) {
      return (
        <FormSection title='Facebook Instant Articles'>
          {this.renderFacebookInstantArticles(integration)}
        </FormSection>
      )
    }

    return (
      <div>Loading</div>
    )

  }

}

const mapStateToProps = (state) => {

  let integration = state.app.integrations.integrations['fb-instant-articles'] || null

  if (integration) {
    integration.settings = integration.settings || {}
  }

  return {
    token: state.app.auth.token,
    integration: integration
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    integrationCallback: (token, integrationId, query) => {
      dispatch(integrationActions.integrationCallback(token, integrationId, query))
    },
    fetchIntegration: (token, integrationId) => {
      dispatch(integrationActions.fetchIntegration(token, integrationId))
    },
    saveIntegration: (token, integrationId, data) => {
      dispatch(integrationActions.saveIntegration(token, integrationId, data))
    },
    deleteIntegration: (token, integrationId) => {
      dispatch(integrationActions.deleteIntegration(token, integrationId))
    },
    updateIntegration: (integrationId, data) => {
      dispatch(integrationActions.updateIntegration(integrationId, data))
    }
  }
}

const FBInstantArticlesIntegrationPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(FBInstantArticlesIntegrationPageComponent)

export default FBInstantArticlesIntegrationPage
