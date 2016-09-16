import React from 'react'
import R from 'ramda'
import { Link } from 'react-router'
import PlaceholderBar from './PlaceholderBar.jsx'

function ArticleListItem(props) {

  function handleChange() {
    return props.toggleArticle(props.article.id)
  }

  return (
    <li className='c-list__item'>
      <div className='c-list__item__cell c-list__item__cell--checkbox' onClick={handleChange}>
        <input type='checkbox' checked={props.selected} />
      </div>
      <div className='c-list__item__cell c-list__item__cell--title'>
        <Link to={`/articles/${props.article.id}`} dangerouslySetInnerHTML={{__html: props.article.headline}} />
      </div>
      <div className='c-list__item__cell'>{props.article.authors_string}</div>
      <div className='c-list__item__cell'>{props.article.published_at}</div>
      <div className='c-list__item__cell'>{props.article.revision_id + ' revisions'}</div>
    </li>
  )
}

function ArticleListItemPlaceholder(props) {
  return (
    <li className='c-list__item'>
      <div className='c-list__item__cell c-list__item__cell--checkbox'>
        <input type='checkbox' disabled={true} checked={false} />
      </div>
      <div className='c-list__item__cell c-list__item__cell--title'>
        <PlaceholderBar />
      </div>
      <div className='c-list__item__cell'>
        <PlaceholderBar />
      </div>
      <div className='c-list__item__cell'>
        <PlaceholderBar />
      </div>
      <div className='c-list__item__cell'>
        <PlaceholderBar />
      </div>
    </li>
  )
}

export default function ArticleList(props) {

  if (props.isLoading) {
    return (
      <div className='c-list'>
        <ul>
          <ArticleListItemPlaceholder />
          <ArticleListItemPlaceholder />
          <ArticleListItemPlaceholder />
          <ArticleListItemPlaceholder />
          <ArticleListItemPlaceholder />
          <ArticleListItemPlaceholder />
          <ArticleListItemPlaceholder />
          <ArticleListItemPlaceholder />
          <ArticleListItemPlaceholder />
          <ArticleListItemPlaceholder />
        </ul>
      </div>
    )
  } else {

    const articles = props.articles.map( (article) => {
      return (
        <ArticleListItem
          key={article.id}
          article={article}
          selected={R.contains(article.id, props.selected)}
          toggleArticle={props.toggleArticle} />
      )
    })

    return (
      <div className='c-list'>
        <ul>{articles}</ul>
      </div>
    )
  }

}
