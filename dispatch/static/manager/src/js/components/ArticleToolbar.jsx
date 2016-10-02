import React from 'react'
import Toolbar from './Toolbar.jsx'

const toolbar = {__html: '<div id="full-toolbar" class="toolbar ql-toolbar ql-snow"><span class="ql-format-group"><button title="Bold" class="ql-format-button ql-bold"><i class="fa fa-bold"></i></button><button title="Italic" class="ql-format-button ql-italic"><i class="fa fa-italic"></i></button><button title="Underline" class="ql-format-button ql-underline"><i class="fa fa-underline"></i></button><button title="H1" data-size="H1" class="ql-format-button ql-header H1"><span>H1</span></button><button title="H2" data-size="H2" class="ql-format-button ql-header H2"><span>H2</span></button><button title="H3" data-size="H3" class="ql-format-button ql-header H3"><span>H3</span></button></span><span class="ql-format-group"><button title="Bullet" class="ql-format-button ql-bullet"><i class="fa fa-list-ul"></i></button><button title="Link" class="ql-format-button ql-link"><i class="fa fa-link"></i></button></span></div>'};

export default function ArticleToolbar(props) {
  return (
    <Toolbar>
      <div className="top-toolbar" dangerouslySetInnerHTML={toolbar} />
      <div className="header-buttons">

      </div>
    </Toolbar>
  )
}

// <button className={"dis-button" + (this.state.unsaved ? " green" : "")} onClick={this.handleSave}>{this.state.firstSave ? 'Save' : 'Update'}</button>
// {!this.state.instance.is_published ? this.renderStatusDropdown() : null}
// <button className="dis-button" onClick={this.handlePublish.bind(this, !this.state.instance.is_published)}>{this.state.instance.is_published ? 'Unpublish' : 'Publish'}</button>
// {this.renderPreviewButton()}
// <DropdownButton push="left" selectItem={this.loadRevision} items={this.renderVersions()}>
// {'Version ' + this.state.version}
// </DropdownButton>
