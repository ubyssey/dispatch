require('babel/polyfill');

var React = require('react');
var Textarea = require('react-textarea-autosize');
var ReactTabs = require('react-tabs');
var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;

var QuillEditor = require('./QuillEditor.jsx');
var QuillToolbar = require('./QuillEditorToolbar.jsx');

var FeaturedImage = require('./ArticleFeaturedImage.jsx');
var SlugField = require('./fields/SlugField.jsx');
var DateTimeField = require('./fields/DateTimeField.jsx');
var ModelDropdown = require('./fields/ModelDropdown.jsx');
var ManyModelDropdown = require('./fields/ManyModelDropdown.jsx');
var ItemStore = require('./stores/ItemStore.js');
var DropdownButton = require('./buttons/DropdownButton.jsx');
var DropdownPanel = require('./buttons/DropdownPanel.jsx');
var TemplateEditor = require('./TemplateEditor.jsx');

var ArticleAdmin = React.createClass({
    getInitialState: function(){
       return {
           article: this.props.articleId ? false : this.newArticle(),
           errors: [],
           firstSave: this.props.articleId ? false : true,
           head: 0,
           version: 1,
           head_id: this.props.articleId ? this.props.articleId : false,
           showVersions: false,
           showOptions: true,
           unsaved: false,
       };
    },
    newArticle: function(){
        if(this.props.section){
            return {
                section: { slug: this.props.section }
            };
        } else {
            return {};
        }
    },
    componentDidMount: function(){
        if(this.props.articleId){
            dispatch.articles(this.props.articleId, function(article){
                this.setState({
                    article: article,
                    head: article.revision_id,
                    version: article.revision_id,
                });
            }.bind(this));
        }
    },
    loadRevision: function(revision_id){
        dispatch.revision('article', this.state.article.parent, revision_id, function(article){
            this.setState({
                article: article,
                version: article.revision_id
            });
        }.bind(this));
    },
    updateField: function(field, event){
        var article = this.state.article;
        article[field] = event.target.value;
        if(event.target.value != ""){
            this.clearError(field);
        }
        this.setState({
            unsaved: true,
            article: article,
        });
    },
    updateModelField: function(field, data, unsaved){
        var article = this.state.article;
        article[field] = data;
        if(data){
            this.clearError(field);
        }
        this.setState({
            unsaved: typeof unsaved !== 'undefined' ? unsaved : true,
            article: article,
        });
    },
    createTag: function(tag_name, callback){
        dispatch.add('tag', {name: tag_name}, callback);
    },
    requiredFields: [
        'long_headline',
        'short_headline',
        'section',
        'authors',
        'slug',
        'snippet'
    ],
    errorClass: function(field){
        return this.state.errors.indexOf(field) != -1 ? "error" : "";
    },
    clearError: function(field){
        var errors = this.state.errors;
        var index = errors.indexOf(field);
        if (index > -1) {
            errors.splice(index, 1);
        }
        this.setState({ errors: errors });
    },
    missingFields: function(){
        var errors = [];
        for(var i = 0; i < this.requiredFields.length; i++){
            var field = this.requiredFields[i];
            if(!this.state.article.hasOwnProperty(field) || this.state.article[field] == "")
                errors.push(field);
        }
        if ( errors.length != 0 ){
            this.setState({ errors: errors });
            return errors;
        } else {
            return false;
        }
    },
    handleSave: function(){
        return this.save();
    },
    handlePublish: function(publish, event){
        if(this.state.unsaved){
            return this.save({publish: publish});
        } else {
            return this.publish(publish);
        }
    },
    handleSchedule: function(publish_at){
        return this.save({schedule: publish_at});
    },
    save: function(options){
        var options = typeof options !== 'undefined' ? options : {};
        this.updateModelField('content', this.refs.content.save(), false);
        var missing = this.missingFields();
        if(!missing){
            var values = {
                long_headline: this.state.article.long_headline,
                short_headline: this.state.article.short_headline,
                featured_image_json: JSON.stringify(this.state.article.featured_image),
                slug: this.state.article.slug,
                snippet: this.state.article.snippet,
                content_json: this.refs.content.save(),
                section_id: this.state.article.section.id,
                author_ids: ItemStore(this.state.article.authors).getIds(),
                tag_ids: ItemStore(this.state.article.tags).getIds(),
                template: this.state.article.template
            }

            if(options.hasOwnProperty('publish'))
                values.publish = options.publish
            if(options.hasOwnProperty('schedule'))
                values.schedule = true
                values.publish_at = options.schedule

            this.setState({ saving: true, });
            if(this.state.firstSave){
                dispatch.add('article', values, this.saveCallback);
            } else {
                dispatch.update('article', this.state.head_id, values, this.saveCallback);
            }
        } else {
            console.log("Missing fields: " + missing.join());
        }
    },
    publish: function(published){
        dispatch.publish('article', this.state.head_id, published, this.saveCallback);
    },
    saveCallback: function(article){
        this.setState({
            article: article,
            head: article.revision_id,
            head_id: article.parent,
            version: article.revision_id,
            firstSave: false,
            saving: false,
            unsaved: false
        });
        this.animateLoader();
    },
    toggleOptions: function(){
        this.setState({
            showOptions: !this.state.showOptions
        });
    },
    animateLoader: function(){
        $('.load-success').fadeIn(500, function(){
            setTimeout(function(){
                $('.load-success').fadeOut(500);
            }, 1000);
        });
    },
    previewButton: function(){
        if(this.state.article.section){
            return (<a className="dis-button" href={dispatch.settings.base_url + (this.state.article ? this.state.article.section.slug + "/" : "") + this.state.article.slug } target="dispatch_preview">Preview</a>);
        }
    },
    renderLoader: function(){
        return ( <div className={'load-status' + (this.state.saving ? ' saving' : "")}><div className="loader"></div><div className="load-success"><i className="fa fa-check"></i></div></div> );
    },
    renderVersions: function(){
        var versions = [];
        for(var i = this.state.head; i > 0; i--){
            versions.push({
                value: i,
                label: i,
            });
        }
        return versions;
    },
    render: function(){
        if(!this.state.article){
            return (
                <header className="secondary"></header>
                )
        }
        return (
            <div className="inner">
                <header className="secondary">
                    {QuillToolbar}
                    <div className="header-buttons">
                        {this.renderLoader()}
                        <button className={"dis-button" + (this.state.unsaved ? " green" : "")} onClick={this.handleSave}>{this.state.firstSave ? 'Save' : 'Update'}</button>
                        <div className="combo-buttons">
                            <button className="dis-button" onClick={this.handlePublish.bind(this, !this.state.article.is_published)}>{this.state.article.is_published ? "Unpublish" : "Publish"}</button>
                            <DropdownPanel push="left" label="Schedule">
                                <DateTimeField datetime={this.state.article.published_at} updateHandler={this.handleSchedule} />
                            </DropdownPanel>
                        </div>
                        {this.previewButton()}
                        <DropdownButton push="left" selectItem={this.loadRevision} items={this.renderVersions()}>
                        {'Version ' + this.state.version}
                        </DropdownButton>
                    </div>
                </header>
                <div className="main clearfix">
                    <div className={"content panel" + (this.state.showOptions ? "" : " expanded")}>
                        <div className="inner">
                            <div className="field-row headline">
                                <Textarea rows={1} placeholder="Enter a headline" className={"headline " + this.errorClass("long_headline")} value={this.state.article.long_headline} onChange={this.updateField.bind(this,'long_headline')}></Textarea>
                            </div>
                            <div className="field-row content">
                                <QuillEditor imageManager={this.props.imageManager} article={this.state.article} ref="content"/>
                            </div>
                        </div>
                        <div className="toggle-options" onClick={this.toggleOptions}><i className={"fa fa-angle-double-" + (this.state.showOptions ? "right" : "left")}></i>{this.state.showOptions ? null : "open options"}</div>
                    </div>
                    <div className={"options panel" + (this.state.showOptions ? "" : " expanded")} >
                        <Tabs
                            onSelect={this.handleSelected}
                            selectedIndex={0}>
                            <TabList>
                                <Tab><i className="fa fa-info"></i> Basic Fields</Tab>
                                <Tab><i className="fa fa-camera"></i> Featured Image</Tab>
                                <Tab><i className="fa fa-files-o"></i> Template</Tab>
                            </TabList>
                            <TabPanel>
                                <div className="field full">
                                    <label>Short Headline</label>
                                    <input type="text" value={this.state.article.short_headline} className={this.errorClass("short_headline")} tabIndex={1} onChange={this.updateField.bind(this,'short_headline')} />
                                </div>
                                <div className="field full">
                                    <label>Slug</label>
                                    <SlugField url={dispatch.settings.base_url + (this.state.article && this.state.article.section ? this.state.article.section.slug + "/" : "") } value={this.state.article.slug ? this.state.article.slug : ""} tabIndex={2} errorClass={this.errorClass("slug")} onChange={this.updateField.bind(this,'slug')} />
                                </div>
                                <ModelDropdown model="section" item_key="id" display="name" label="Section" name="section" data={this.state.article.section} errorClass={this.errorClass("section")} updateHandler={this.updateModelField} />
                                <ManyModelDropdown model="person" item_key="id" display="full_name" label="Authors" name="authors" data={this.state.article.authors} errorClass={this.errorClass("authors")} updateHandler={this.updateModelField} />
                                <ManyModelDropdown model="tag" item_key="id" display="name" label="Tags" name="tags" data={this.state.article.tags} updateHandler={this.updateModelField} createHandler={this.createTag} />
                                <div className="field full">
                                    <label>Snippet</label>
                                    <Textarea rows={4} value={this.state.article.snippet} className={this.errorClass("snippet")} onChange={this.updateField.bind(this,'snippet')}></Textarea>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <FeaturedImage name="featured_image" data={this.state.article.featured_image} manager={this.props.imageManager} updateHandler={this.updateModelField}/>
                            </TabPanel>
                            <TabPanel>
                                <TemplateEditor template={this.state.article.template} updateHandler={this.updateField} />
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
            </div>
            )
    }
});

module.exports = ArticleAdmin;