import React from 'react'
import { connect } from 'react-redux'

import ItemSelectInput from './ItemSelectInput'

import templatesActions from '../../actions/TemplatesActions'

class TemplateSelectInputComponent extends React.Component {

  listTemplates(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listTemplates(this.props.token, queryObj)
  }

  render() {

    return (
      <ItemSelectInput
        many={false}
        selected={this.props.selected}
        results={this.props.templates.ids}
        entities={this.props.entities.templates}
        onChange={(selected) => this.props.update(selected)}
        fetchResults={(query) => this.listTemplates(query)}
        attribute='name'
        editMessage={this.props.selected ? 'Change template' : 'Set template'} />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    templates: state.app.templates,
    entities: {
      templates: state.app.entities.templates
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listTemplates: (token, query) => {
      dispatch(templatesActions.list(token, query))
    }
  }
}

const TemplateSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateSelectInputComponent)

export default TemplateSelectInput
