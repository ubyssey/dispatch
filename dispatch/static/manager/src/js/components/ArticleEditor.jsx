import React from 'react'
import QuillEditor from './QuillEditor.jsx'
import ArticleHeadline from './ArticleHeadline.jsx'

export default function ArticleEditor(props) {
  return (
    <div className='c-article-editor'>
      <div className='c-article-editor__inner'>
        <ArticleHeadline update={props.update} headline={props.article.headline} />
        <div className='c-article-editor__body'>
          <QuillEditor article={props.article} />
        </div>
      </div>
    </div>
  )
}

// <div className={"content panel" + (this.state.showOptions ? "" : " expanded")}>
//     <div className="inner">
//         <div className="field-row content">
//             <QuillEditor key="quill-editor" imageManager={this.props.imageManager} galleryManager={this.props.galleryManager} article={this.state.instance} ref="content"/>
//         </div>
//     </div>
//     <div className="toggle-options" onClick={this.toggleOptions}><i className={"fa fa-angle-double-" + (this.state.showOptions ? "right" : "left")}></i>{this.state.showOptions ? null : "open options"}</div>
// </div>
