import React from 'react';
import { connect } from 'react-redux'

import * as articlesActions from '../actions/ArticlesActions'

import Toolbar from '../components/Toolbar.jsx';
import ArticleList from '../components/ArticleList.jsx';

export default class ArticlesPageComponent extends React.Component {

  componentWillMount() {
    // Fetch articles
    this.props.fetchArticles({section: this.props.location.query.section})
  }

  componentDidUpdate(prevProps) {

    // Fetch articles
    if (prevProps.location.query.section !== this.props.location.query.section) {
      this.props.fetchArticles({section: this.props.location.query.section})
    }
  }

  render() {
    return this.props.articles.isLoaded ? this.renderArticles() : this.renderLoading()
  }

  renderLoading() {
    return (
      <div>loading!</div>
    )
  }

  renderArticles() {
    let articles = this.props.articles.data.map( article => {
      return ( <li key={article.id}>{article.headline}</li> )
    })

    return (
      <div>
        <Toolbar>
          test
        </Toolbar>
        <ArticleList articles={this.props.articles.data} />
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    articles: state.app.articles.articles
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchArticles: (query) => {
      dispatch(articlesActions.fetchArticles(query))
    }
  }
}

const ArticlesPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticlesPageComponent)

export default ArticlesPage
