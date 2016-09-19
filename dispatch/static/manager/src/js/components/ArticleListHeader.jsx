import React from 'react'
import Toolbar from './Toolbar.jsx'

export default function ArticleListHeader(props) {

  function handleToggleAllArticles() {
    props.toggleAllArticles(props.articles.data)
  }

  function handleDeleteArticles() {
    return props.deleteArticles(props.articles.selected)
  }

  return (
    <Toolbar>
      <div className='c-list-header'>
        <div className='c-list-header__left'>
          <div className='c-list-header__checkbox'>
            <input type='checkbox'
              checked={props.articles.isAllSelected}
              onChange={handleToggleAllArticles} />
          </div>
          {`${props.articles.selected.length} articles selected`}
          <button className='c-list-header__delete' onClick={handleDeleteArticles} disabled={!props.articles.selected.length}>Delete</button>
        </div>
        <div className='c-list-header__right'>
        </div>
      </div>
    </Toolbar>
  )
}
