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
var ModelField = require('./fields/ModelFieldA.jsx');
var ModelDropdown = require('./fields/ModelDropdown.jsx');
var ManyModelDropdown = require('./fields/ManyModelDropdown.jsx');
var ItemStore = require('./stores/ItemStore.js');
var DropdownButton = require('./buttons/DropdownButton.jsx');

var ArticleAdmin = React.createClass({
    getInitialState: function(){
       return {
           article: this.props.articleId ? false : {},
           firstSave: this.props.articleId ? false : true,
           head: 0,
           version: 1,
           head_id: this.props.articleId ? this.props.articleId : false,
           showVersions: false,
       };
    },
    componentDidMount: function(){
        dispatch.articles(this.props.articleId, function(article){
            this.setState({
                article: article,
                head: article.revision_id,
                version: article.revision_id,
            });
        }.bind(this));
    },
    loadRevision: function(revision_id){
        dispatch.revision('article', this.state.article.parent, revision_id, function(article){
            this.setState({
                article: article,
                version: article.revision_id,
            });
        }.bind(this));
    },
    updateField: function(field, event){
        var article = this.state.article;
        article[field] = event.target.value;
        this.setState({
            article: article,
        });
    },
    updateModelField: function(field, data){
        var article = this.state.article;
        article[field] = data;
        this.setState({
            article: article,
        });
    },
    requiredFields: [
        'long_headline',
        'short_headline',
        'content',
        'published_at',
        'authors',
    ],
    missingFields: function(){
        var errors = [];
        for(var i = 0; i < this.requiredFields.length; i++){
            var field = this.requiredFields[i];
            if(!this.state.article.hasOwnProperty(field))
                errors.push(field);
        }
        return errors.length == 0 ? false : errors;
    },
    save: function(){
        this.updateModelField('content', this.refs.content.save());
        var missing = this.missingFields();
        if(!missing){
            var values = {
                long_headline: this.state.article.long_headline,
                short_headline: this.state.article.short_headline,
                featured_image_json: JSON.stringify(this.state.article.featured_image),
                published_at: this.state.article.published_at,
                slug: this.state.article.slug,
                content_json: this.refs.content.save(),
                section_id: this.state.article.section.id,
                author_ids: ItemStore(this.state.article.authors).getIds(),
            }
            if(this.state.firstSave){
                dispatch.add('article', values, function(article){
                    this.setState({
                        article: article,
                        head: article.revision_id,
                        head_id: article.id,
                        version: article.revision_id,
                        firstSave: false,
                    });
                }.bind(this));
            } else {
                dispatch.update('article', this.state.head_id, values, function(article){
                    this.setState({
                        article: article,
                        head: article.revision_id,
                        head_id: article.id,
                        version: article.revision_id,
                    });
                }.bind(this));
            }
        } else {
            console.log("Missing fields: " + missing.join());
        }
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
                <header></header>
                )
        }
        return (
            <main>
                <header>
                    {QuillToolbar}
                    <div className="save-buttons">
                        <button onClick={this.save}>Save</button>
                        <DropdownButton selectItem={this.loadRevision} label={'Version ' + this.state.version} items={this.renderVersions()} />
                    </div>
                </header>
                <div className="main clearfix">
                    <div className="container">
                        <div className="content panel">
                            <div className="inner">
                                <div className="field-row headline">
                                    <Textarea rows={1} placeholder="Enter a headline"className="headline" value={this.state.article.long_headline} onChange={this.updateField.bind(this,'long_headline')}></Textarea>
                                </div>
                                <div className="field-row content">
                                    <QuillEditor imageManager={this.props.imageManager} article={this.state.article} ref="content"/>
                                </div>
                            </div>
                        </div>
                        <div className="options panel">
                            <Tabs
                                onSelect={this.handleSelected}
                                selectedIndex={0}>
                                <TabList>
                                    <Tab>Basic Fields</Tab>
                                    <Tab>Featured Image</Tab>
                                </TabList>
                                <TabPanel>
                                    <div className="field full">
                                        <label>Short Headline</label>
                                        <input type="text" value={this.state.article.short_headline} onChange={this.updateField.bind(this,'short_headline')} />
                                    </div>
                                    <div className="field full">
                                        <label>Slug</label>
                                        <input type="text" value={this.state.article.slug} onChange={this.updateField.bind(this,'slug')} />
                                    </div>
                                    <div className="field">
                                        <label>Publish at</label>
                                        <input type="text" value={this.state.article.published_at} onChange={this.updateField.bind(this,'published_at')} />
                                    </div>
                                    <ModelDropdown model="section" item_key="id" display="name" label="Section" name="section" data={this.state.article.section} updateHandler={this.updateModelField} />
                                    <ManyModelDropdown model="person" item_key="id" display="full_name" label="Authors" name="authors" data={this.state.article.authors} updateHandler={this.updateModelField} />
                                </TabPanel>
                                <TabPanel>
                                    <FeaturedImage name="featured_image" data={this.state.article.featured_image} manager={this.props.imageManager} updateHandler={this.updateModelField}/>
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </main>
            )
    }
});

module.exports = ArticleAdmin;