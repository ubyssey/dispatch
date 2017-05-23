import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'

import MultiSelectInput from './MultiSelectInput'

import articlesActions from '../../actions/ArticlesActions'

class ArticleSelectInputComponent extends React.Component {

  addArticle(articleId) {
    let newArticles = R.append(articleId, this.props.selected)
    this.props.update(newArticles)
  }

  removeArticle(articleId) {
    let newArticles = R.remove(
      R.findIndex(R.equals(articleId), this.props.selected),
      1,
      this.props.selected
    )
    this.props.update(newArticles)
  }

  listArticles(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listArticles(this.props.token, queryObj)
  }

  render() {
    return (
      <MultiSelectInput
        selected={this.props.selected}
        results={this.props.articles.ids}
        entities={this.props.entities.articles}
        addValue={(id) => this.addArticle(id)}
        removeValue={(id) => this.removeArticle(id)}
        fetchResults={(query) => this.listArticles(query)}
        attribute='headline'
        editMessage={this.props.selected.length ? 'Edit articles' : 'Add articles'} />
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
