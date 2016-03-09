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
var SEO = require('./ArticleSEO.jsx');
var SlugField = require('./fields/SlugField.jsx');
var SelectField = require('./fields/SelectField.jsx');

var DateTimeField = require('./fields/DateTimeField.jsx');
var ModelDropdown = require('./fields/ModelDropdown.jsx');
var ManyModelDropdown = require('./fields/ManyModelDropdown.jsx');
var ItemStore = require('./stores/ItemStore.js');
var DropdownButton = require('./buttons/DropdownButton.jsx');
var TemplateEditor = require('./TemplateEditor.jsx');

var PublishableAdmin = require('./PublishableAdmin.jsx');

var READING_TIME_OPTIONS = [
    ['morning', 'Morning'],
    ['midday', 'Midday'],
    ['evening', 'Evening']
];

var IMPORTANCE_OPTIONS = [
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
    [5, 5],
];

var PageAdmin = React.createClass(PublishableAdmin({
    requiredFields: [
        {name: 'title', validator: 'hasTextValidator'},
        {name: 'slug', validator: 'hasTextValidator'}
    ],
    save: function(options, callback){
        var options = typeof options !== 'undefined' ? options : {};
        this.updateModelField('content', this.refs.content.save(), false);
        if(!this.missingFields()){
            var values = {
                title: this.state.instance.title,
                featured_image_json: JSON.stringify(this.state.instance.featured_image),
                slug: this.state.instance.slug,
                snippet: this.state.instance.snippet,
                content_json: this.refs.content.save(),
                status: this.state.instance.status,
                template: this.state.instance.template,
                template_fields: this.refs.template.save(),
                seo_keyword: this.state.instance.seo_keyword,
                seo_description: this.state.instance.seo_description
            }

            this.setState({ saving: true, });

            if(this.state.firstSave){
                dispatch.add(this.props.model, values, function(instance){
                    this.saveCallback(instance, callback)
                }.bind(this));
            } else {
                dispatch.update(this.props.model, this.state.head_id, values, function(instance){
                    this.saveCallback(instance, callback)
                }.bind(this));
            }
        }
    },
    getPreviewURL: function(){
        return dispatch.settings.base_url + this.state.instance.slug;
    },
    renderPreviewButton: function(){
        if(this.state.instance)
            return (<button onClick={this.handlePreview} className="dis-button" href={dispatch.settings.base_url + this.state.instance.slug } target="dispatch_preview">Preview</button>);
    },
    render: function(){
        if(!this.state.instance){
            return (<header className="secondary"></header>)
        }
        return (
            <div className="inner">
                {this.renderToolbar()}
                <div className="main clearfix">
                    <div className={"content panel" + (this.state.showOptions ? "" : " expanded")}>
                        <div className="inner">
                            <div className="field-row headline">
                                <Textarea rows={1} placeholder="Title" className={"headline " + this.errorClass("title")} value={this.state.instance.title} onChange={this.updateField.bind(this,'title')}></Textarea>
                            </div>
                            <div className="field-row content">
                                <QuillEditor key="quill-editor" imageManager={this.props.imageManager} galleryManager={this.props.galleryManager} article={this.state.instance} ref="content"/>
                            </div>
                        </div>
                        <div className="toggle-options" onClick={this.toggleOptions}><i className={"fa fa-angle-double-" + (this.state.showOptions ? "right" : "left")}></i>{this.state.showOptions ? null : "open options"}</div>
                    </div>
                    <div className={"options panel" + (this.state.showOptions ? "" : " expanded")} >
                        <Tabs onSelect={this.handleSelected} selectedIndex={0}>
                            <TabList>
                                <Tab><i className="fa fa-info"></i> Basic Fields</Tab>
                                <Tab><i className="fa fa-camera"></i> Featured Image</Tab>
                                <Tab><i className="fa fa-files-o"></i> Template</Tab>
                                <Tab><i className="fa fa-bullhorn"></i> SEO</Tab>
                            </TabList>
                            <TabPanel>
                                <div className="field full">
                                    <label>Slug</label>
                                    <SlugField url={dispatch.settings.base_url + (this.state.instance && this.state.instance.section ? this.state.instance.section.slug + "/" : "") } value={this.state.instance.slug ? this.state.instance.slug : ""} tabIndex={2} errorClass={this.errorClass("slug")} onChange={this.updateField.bind(this,'slug')} />
                                </div>
                                <div className="field full">
                                    <label>Snippet</label>
                                    <Textarea rows={4} value={this.state.instance.snippet} className={this.errorClass("snippet")} onChange={this.updateField.bind(this,'snippet')}></Textarea>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <FeaturedImage name="featured_image" data={this.state.instance.featured_image} manager={this.props.imageManager} updateHandler={this.updateModelField}/>
                            </TabPanel>
                            <TabPanel>
                                <TemplateEditor ref="template" instance_id={this.state.instance.id} fields={this.state.instance.template_fields} template={this.state.instance.template} updateHandler={this.updateField} />
                            </TabPanel>
                            <TabPanel>
                                <SEO instance={this.state.instance} updateHandler={this.updateField} />
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}));




module.exports = PageAdmin;