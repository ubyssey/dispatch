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
    searchArticles: (section, query) => {
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
      filterBy='Sections'
      headers={[ 'Headline', 'Authors', 'Published', 'Revisions']}
      extraColumns={[
        item => item.authors_string,
        item => item.published_at ? humanizeDatetime(item.published_at) : 'Unpublished',
        item => item.latest_version + ' revisions'
      ]}
      shouldReload={(prevProps, props) => {
        return prevProps.location.query.section !== props.location.query.section
      }}
      queryHandler={(query, props) => {
        if (props.location.query.section) {
          query.section = props.location.query.section
        }
        return query
      }}
      searchListItems={(query) => props.searchArticles(props.location.query.section, query)}
      {...props} />
  )
}


const ArticlesPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticlePageComponent)

export default ArticlesPage
