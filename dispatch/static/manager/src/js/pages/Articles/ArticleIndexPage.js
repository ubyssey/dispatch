import React from 'react'
import { connect } from 'react-redux'

import ItemIndexPage from '../ItemIndexPage'
import articlesActions from '../../actions/ArticlesActions'
import { humanizeDatetime } from '../../util/helpers'

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    listItems: state.app.articles.list,
    entities: {
      listItems: state.app.entities.articles,
      sections: state.app.entities.sections
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listListItems: (token, query) => {
      dispatch(articlesActions.list(token, query))
    },
    toggleListItem: (articleId) => {
      dispatch(articlesActions.toggle(articleId))
    },
    toggleAllListItems: (articleIds) => {
      dispatch(articlesActions.toggleAll(articleIds))
    },
    clearSelectedListItems: () => {
      dispatch(articlesActions.clearSelected())
    },
    clearListItems: () => {
      dispatch(articlesActions.clearAll())
    },
    deleteListItems: (token, articleIds) => {
      dispatch(articlesActions.deleteMany(token, articleIds))
    },
    searchListItems: (token, section, query) => {
      dispatch(articlesActions.search(section, query))
    }
  }
}

function ArticlePageComponent(props) {
  const section = props.entities.sections[props.location.query.section]
  const title = section ? `${section.name} - Articles` : 'Articles'

  return (
    <ItemIndexPage
      pageTitle={title}
      typePlural='articles'
      typeSingular='article'
      displayColumn='headline'
      headers={[ 'Headline', 'Authors', 'Published', 'Revisions']}
      extraColumns={[
        item => item.authors_string,
        item => item.published_at ? humanizeDatetime(item.published_at) : 'Unpublished',
        item => item.latest_version + ' revisions'
      ]}

      {...props} />
  )
}


const ArticlesPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticlePageComponent)

export default ArticlesPage
