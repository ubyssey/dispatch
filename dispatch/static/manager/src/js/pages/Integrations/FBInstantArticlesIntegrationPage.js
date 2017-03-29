import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'

import Panel from '../../components/Panel'

import {
  InstantArticlesClientEditor,
  InstantArticlesPageEditor,
  InstantArticlesEnabledEditor
} from '../../components/integrations/FBInstantArticles'

import * as integrationActions from '../../actions/IntegrationActions'

const INTEGRATION_ID = 'fb-instant-articles'

class FBInstantArticlesIntegrationPageComponent extends React.Component {

  constructor(props) {
    super(props)

    this.cachedSettings = null

    this.state = {
      editMode: false
    }
  }

  componentWillMount() {

    this.props.fetchIntegration(this.props.token, INTEGRATION_ID)

    if (this.props.location.query.callback) {
      this.props.integrationCallback(
        this.props.token,
        INTEGRATION_ID,
        this.props.location.query
      )
    }

  }

  componentWillReceiveProps(nextProps) {

    if (R.path(['integration', 'settings', 'client_configured'], nextProps)) {
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
    this.props.saveIntegration(this.props.token, INTEGRATION_ID, integration)
  }

  updateSettings(settings) {
    return this.props.updateIntegration(
      INTEGRATION_ID,
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

  componentDidUpdate() {

    if (!this.props.integration.settings.page_id && R.path(['callback', 'pages', 'data'], this.props.integration)) {
      const page = this.props.integration.callback.pages.data[0]
      this.updateFacebookPage(page)
    }

  }

  renderFacebookInstantArticles() {

    const settings = this.props.integration.settings
    const callback = this.props.integration.callback || {}

    if (settings.page_configured) {
      return (
        <InstantArticlesEnabledEditor
          pageName={settings.page_name}
          onDelete={() => this.props.deleteIntegration(this.props.token, INTEGRATION_ID)} />
      )
    }

    if (settings.client_configured && !this.state.editMode) {
      return (
        <InstantArticlesPageEditor
          enterEditMode={() => this.enterEditMode()}
          clientId={settings.client_id}
          pages={R.path(['pages', 'data'], callback)}
          pathname={this.props.location.pathname}
          onChange={data => this.updateFacebookPage(data)}
          onSave={() => this.saveIntegration(this.props.integration)} />
      )
    }

    return (
      <InstantArticlesClientEditor
        clientId={settings.client_id}
        clientSecret={settings.client_secret}
        onChange={data => this.updateSettings(data)}
        onSave={() => this.saveIntegration(this.props.integration)}
        editMode={this.state.editMode}
        exitEditMode={() => this.exitEditMode()}/>
    )
  }

  render() {

    if (this.props.integration) {
      return (
        <DocumentTitle title='Integrations - Facebook Instant Articles'>
          <Panel title='Facebook Instant Articles'>
            {this.renderFacebookInstantArticles()}
          </Panel>
        </DocumentTitle>
      )
    }

    return (
      <div>Loading</div>
    )

  }

}

const mapStateToProps = (state) => {

  let integration = state.app.integrations.integrations[INTEGRATION_ID] || null

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
