import React from 'react'
import { connect } from 'react-redux'

import ItemIndexPage from '../ItemIndexPage'
import SectionSelectInput  from '../../components/inputs/SectionSelectInput'
import AuthorSelectInput from '../../components/inputs/AuthorSelectInput'
import articlesActions from '../../actions/ArticlesActions'
import { humanizeDatetime } from '../../util/helpers'

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    listItems: state.app.articles.list,
    entities: {
      listItems: state.app.entities.articles,
      sections: state.app.entities.sections,
      authors: state.app.entities.persons
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
    },
    filterArticles: (filterBy, query) => {
      dispatch(articlesActions.filter(filterBy, query))
    }
  }
}

function ArticlePageComponent(props) {
  const section = props.entities.sections[props.location.query.section]
  const title = section ? `${section.name} - Articles` : 'Articles'
  const filters = (
    <div className='c-item-list__header__filters'>
      <button className='pt-button c-item-list__header__filters__filter'>
        <SectionSelectInput
          selected={props.location.query.section}
          inline={false}
          showSortableList={false}
          update={(query) => props.filterArticles('section', query)}
          isFilter={true} />
      </button>
      <button className='pt-button c-item-list__header__filters__filter'>
        <AuthorSelectInput
          many={false}
          selected={props.location.query.author}
          inline={false}
          showSortableList={false}
          update={(query) => props.filterArticles('author', query)}
          isFilter={true} />
      </button>
    </div>
  )

  return (
    <ItemIndexPage
      pageTitle={title}
      typePlural='articles'
      typeSingular='article'
      displayColumn='headline'
      filterBy={filters}
      headers={[ 'Headline', 'Authors', 'Published', 'Revisions']}
      extraColumns={[
        item => item.authors_string,
        item => item.published_at ? humanizeDatetime(item.published_at) : 'Unpublished',
        item => item.latest_version + ' revisions'
      ]}
      shouldReload={(prevProps, props) => {
        return (prevProps.location.query.section !== props.location.query.section) || (prevProps.location.query.author !== props.location.query.author)
      }}
      queryHandler={(query, props) => {
        if (props.location.query.section) {
          query.section = props.location.query.section
        }
        if (props.location.query.author) {
          query.author = props.location.query.author
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
