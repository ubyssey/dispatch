import React from 'react'
import { connect } from 'react-redux'

import ItemSelectInput from './ItemSelectInput'

import articlesActions from '../../../actions/ArticlesActions'

class ArticleSelectInputComponent extends React.Component {

  listArticles(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    if (this.props.section) {
      queryObj['section'] = this.props.section
    }

    this.props.listArticles(this.props.token, queryObj)
  }

  render() {

    const label = this.props.many ? 'articles' : 'article'

    return (
      <ItemSelectInput
        many={this.props.many}
        selected={this.props.selected}
        results={this.props.articles.ids}
        entities={this.props.entities.articles}
        onChange={(selected) => this.props.onChange(selected)}
        fetchResults={(query) => this.listArticles(query)}
        attribute='headline'
        editMessage={this.props.selected ? `Edit ${label}` : `Add ${label}`} />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    articles: state.app.articles.list,
    entities: {
      articles: state.app.entities.articles
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listArticles: (token, query) => {
      dispatch(articlesActions.list(token, query))
    }
  }
}

const ArticleSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticleSelectInputComponent)

export default ArticleSelectInput
