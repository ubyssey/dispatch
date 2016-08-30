import React from 'react'
import { Link } from 'react-router'

function ArticleListItem(props) {
  return (
    <li className='c-list__item'>
      <div className='c-list__item__cell c-list__item__cell--checkbox'></div>
      <div className='c-list__item__cell c-list__item__cell--title'>
        <Link to={`/articles/${props.article.id}`} dangerouslySetInnerHTML={{__html: props.article.headline}} />
      </div>
      <div className='c-list__item__cell'>{props.article.authors_string}</div>
      <div className='c-list__item__cell'>{props.article.published_at}</div>
      <div className='c-list__item__cell'>{props.article.revision_id + ' revisions'}</div>
    </li>
  )
}

export default function ArticleList(props) {
  let articles = props.articles.map( article => {
    return ( <ArticleListItem key={article.id} article={article} /> )
  })

  return (
    <div className='c-list'>
      <ul>{articles}</ul>
    </div>
  )
}
