var React = require('react');
var ReactTabs = require('react-tabs');
var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;

var QuillEditor = require('./QuillEditor.jsx');
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
           showVersions: false,
       };
    },
    componentDidMount: function(){
        dispatch.articles(this.props.articleId, function(article){
            this.setState({
                article: article,
                head: article.revision_id,
            });
        }.bind(this));
    },
    loadRevision: function(revision_id){
        dispatch.revision('article', this.state.article.parent, revision_id, function(article){
            this.setState({
                article: article,
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
    save: function(){
        var values = {
            long_headline: this.state.article.long_headline,
            content_json: this.refs.content.save(),
            section_id: this.state.article.section.id,
            author_ids: ItemStore(this.state.article.authors).getIds(),
        }
        if(this.state.firstSave){
            dispatch.add('article', values, function(article){
                this.setState({
                    article: article,
                    head: article.revision_id,
                    firstSave: false,
                });
            }.bind(this));
        } else {
            dispatch.update('article', this.state.article.id, values, function(article){
                this.setState({
                    article: article,
                    head: article.revision_id,
                });
            }.bind(this));
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
                <div>Loading</div>
            )
        }
        return (
            <main>
                <header>
                    <div className="save-buttons">
                        <button onClick={this.save}>Save</button>
                        <DropdownButton selectItem={this.loadRevision} label={'Version ' + this.state.head} items={this.renderVersions()} />
                    </div>
                </header>
                <div className="main clearfix">
                    <div className="container">
                        <div className="content panel">
                            <div className="inner">
                                <div className="field-row headline">
                                    <textarea value={this.state.article.long_headline} onChange={this.updateField.bind(this,'long_headline')} className="headline" placeholder="Enter a headline..."></textarea>
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
                                    <div className="field">
                                        <label>Short Headline</label>
                                        <input type="text" value={this.state.article.short_headline} onChange={this.updateField.bind(this,'short_headline')} />
                                    </div>
                                    <div className="field">
                                        <label>Slug</label>
                                        <input type="text" value={this.state.article.slug} onChange={this.updateField.bind(this,'slug')} />
                                    </div>
                                    <ModelDropdown model="section" item_key="id" display="name" label="Section" name="section" data={this.state.article.section} updateHandler={this.updateModelField} />
                                    <ManyModelDropdown model="person" item_key="id" display="full_name" label="Authors" name="authors" data={this.state.article.authors} updateHandler={this.updateModelField} />
                                </TabPanel>
                                <TabPanel>
                                    <FeaturedImage manager={this.props.imageManager}/>
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