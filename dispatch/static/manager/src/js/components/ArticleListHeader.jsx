import React from 'react'
import Toolbar from './Toolbar.jsx'

export default function ArticleListHeader(props) {

  function handleToggleAllArticles() {
    props.toggleAllArticles(props.articles.data)
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
        </div>
        <div className='c-list-header__right'>
        {`${props.articles.selected.length} articles selected`}
        </div>
      </div>
    </Toolbar>
  )
}
