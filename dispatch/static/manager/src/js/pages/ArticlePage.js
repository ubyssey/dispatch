import React from 'react';

import ArticleEditor from '../components/ArticleEditor'

export default function ArticlePage(props) {
  return (
    <ArticleEditor articleId={props.params.articleId} />
  )
}
