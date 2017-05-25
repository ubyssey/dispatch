import React from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'

import { Link } from 'react-router'

import { Intent } from '@blueprintjs/core'

import articlesActions from '../../actions/ArticlesActions'
import { humanizeDatetime } from '../../util/helpers'

import { LinkButton } from '../../components/inputs'
import ItemList from '../../components/ItemList'

const DEFAULT_LIMIT = 15

class ArticlesPageComponent extends React.Component {

  constructor(props) {
    super(props)

    this.handleDeleteArticles = this.handleDeleteArticles.bind(this)
    this.handleSearchArticles = this.handleSearchArticles.bind(this)
  }

  getQuery() {
    var query = {
      limit: DEFAULT_LIMIT,
      drafts: true,
      offset: (this.getCurrentPage() - 1) * DEFAULT_LIMIT
    }

    // If section is present, add to query
    if (this.props.location.query.section) {
      query.section = this.props.location.query.section
    }

    // If search query is present, add to query
    if (this.props.location.query.q) {
      query.q = this.props.location.query.q
    }

    return query
  }

  getCurrentPage() {
    return parseInt(this.props.location.query.page, 10) || 1
  }

  getTotalPages() {
    return Math.ceil(
      parseInt(this.props.articles.count, 10) / DEFAULT_LIMIT
    )
  }

  componentWillMount() {
    // Fetch articles
    this.props.clearArticles()
    this.props.clearSelectedArticles()
    this.props.listArticles(this.props.token, this.getQuery())
  }

  componentDidUpdate(prevProps) {

    if (this.isNewSection(prevProps, this.props) || this.isNewQuery(prevProps, this.props)) {
      this.props.clearArticles()
      this.props.clearSelectedArticles()
      this.props.listArticles(this.props.token, this.getQuery())
    }

    else if (this.isNewPage(prevProps, this.props)) {
      // Fetch articles
      this.props.listArticles(this.props.token, this.getQuery())
      this.props.clearSelectedArticles()
    }
  }

  isNewSection(prevProps, props) {
    // Returns true if section has changed
    return prevProps.location.query.section !== props.location.query.section
  }

  isNewQuery(prevProps, props) {
    return prevProps.location.query.q !== props.location.query.q
  }

  isNewPage(prevProps, props) {
    // Returns true if page number has changed
    return prevProps.location.query.page !== props.location.query.page
  }

  handleDeleteArticles(articleIds) {
    this.props.deleteArticles(this.props.token, articleIds)
    this.props.clearSelectedArticles()
  }

  handleSearchArticles(query) {
    this.props.searchArticles(this.props.token, this.props.location.query.section, query)
  }

  render() {
    const section = this.props.entities.sections[this.props.location.query.section]
    const title = section ? `${section.name} - Articles` : 'Articles'

    return (
      <DocumentTitle title={title}>
        <ItemList
          location={this.props.location}

          typePlural='articles'
          typeSingular='article'

          currentPage={this.getCurrentPage()}
          totalPages={this.getTotalPages()}

          items={this.props.articles}
          entities={this.props.entities.articles}

          columns={[
            item => (<strong><Link to={`/articles/${item.id}`} dangerouslySetInnerHTML={{__html: item.headline}} /></strong>),
            item => item.authors_string,
            item => item.published_at ? humanizeDatetime(item.published_at) : 'Unpublished',
            item => item.latest_version + ' revisions'
          ]}


          emptyMessage={'You haven\'t created any articles yet.'}
          createHandler={() => (
            <LinkButton intent={Intent.SUCCESS} to={'articles/new'}>
              <span className='pt-icon-standard pt-icon-add'></span>Create article
            </LinkButton>)
          }

          actions={{
            toggleItem: this.props.toggleArticle,
            toggleAllItems: this.props.toggleAllArticles,
            deleteItems: this.handleDeleteArticles,
            searchItems: this.handleSearchArticles
          }}

          />
      </DocumentTitle>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    articles: state.app.articles.list,
    entities: {
      articles: state.app.entities.articles,
      sections: state.app.entities.sections
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listArticles: (token, query) => {
      dispatch(articlesActions.list(token, query))
    },
    toggleArticle: (articleId) => {
      dispatch(articlesActions.toggle(articleId))
    },
    toggleAllArticles: (articleIds) => {
      dispatch(articlesActions.toggleAll(articleIds))
    },
    clearSelectedArticles: () => {
      dispatch(articlesActions.clearSelected())
    },
    clearArticles: () => {
      dispatch(articlesActions.clearAll())
    },
    deleteArticles: (token, articleIds) => {
      dispatch(articlesActions.deleteMany(token, articleIds))
    },
    searchArticles: (token, section, query) => {
      dispatch(articlesActions.search(section, query))
    }
  }
}

const ArticlesPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ArticlesPageComponent)

export default ArticlesPage
