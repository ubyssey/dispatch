import React from 'react';

import ArticleEditor from '../components/ArticleEditor.jsx'

export default function ArticlePage(props) {
  return (
    <ArticleEditor articleId={props.params.articleId} />
  )
}
