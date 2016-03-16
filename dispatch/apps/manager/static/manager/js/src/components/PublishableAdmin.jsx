var React = require('react');
var diff = require('deep-diff').diff;

var DropdownButton = require('./buttons/DropdownButton.jsx');
var QuillToolbar = require('./QuillEditorToolbar.jsx');

var STATUS_ITEMS = [
    {
        value: 2,
        label: 'Pitch'
    },
    {
        value: 0,
        label: 'Draft'
    },
    {
        value: 3,
        label: 'To be copyedited'
    },
    {
        value: 4,
        label: 'To be managed'
    }
];

var FIELD_VALIDATORS = {
	hasTextValidator: function(fieldName, instance) {
	    if(!instance.hasOwnProperty(fieldName) || instance[fieldName] == "")
	        return false;
		return true;
	},
	hasCharRangeValidator: function(fieldName, instance) {
		var LOW_THRESHOLD = 200;
		var HIGH_THRESHOLD = 250;
		var charLength = instance[fieldName].length;
		if(charLength < LOW_THRESHOLD || charLength > HIGH_THRESHOLD || !instance.hasOwnProperty(fieldName))
			return false;
		return true;
	}
};

var PublishableAdmin = function(component) {
    var prototype = {
        getInitialState: function(){
            var instance = this.props.instanceId ? false : this.newInstance();
            return {
               instance: instance,
               savedInstance: JSON.parse(JSON.stringify(instance)),
               errors: [],
               firstSave: this.props.instanceId ? false : true,
               head: 0,
               version: 1,
               head_id: this.props.instanceId ? this.props.instanceId : false,
               showVersions: false,
               showOptions: window.innerWidth > 400,
               unsaved: false,
            };
        },
        newInstance: function(){
            if(this.props.model == 'article' && this.props.sectionId){
                return {
                    section: {
                        id: this.props.sectionId,
                        name: this.props.sectionName,
                        slug: this.props.sectionSlug
                    }
                }
            } else {
                return {};
            }
        },
        componentDidMount: function(){
            if(this.props.instanceId){
                dispatch.find(this.props.model, this.props.instanceId, {template_fields:true}, function(instance){
                    this.setState({
                        instance: instance,
                        savedArticle: JSON.parse(JSON.stringify(instance)),
                        head: instance.revision_id,
                        version: instance.revision_id,
                    });
                }.bind(this));
            }
        },
        loadRevision: function(revision_id){
            dispatch.revision(this.props.model, this.state.instance.parent, revision_id, function(instance){
                this.setState({
                    instance: instance,
                    version: instance.revision_id
                });
            }.bind(this));
        },
        updateStatus: function(status){
            var instance = this.state.instance;
            instance.status = status;
            this.setState({
                unsaved: diff(instance, this.state.savedInstance) ? true : false,
                instance: instance,
            });
        },
        updateField: function(field, event){
            var instance = this.state.instance;
            instance[field] = event.target.value;
            if(event.target.value != ""){
                this.clearError(field);
            }
            this.setState({
                unsaved: diff(instance, this.state.savedInstance) ? true : false,
                instance: instance,
            });
        },
        updateModelField: function(field, data){
            var instance = this.state.instance;
            instance[field] = data;
            if(data){
                this.clearError(field);
            }
            this.setState({
                unsaved: diff(instance, this.state.savedInstance) ? true : false,
                instance: instance,
            });
        },
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
				if(!FIELD_VALIDATORS[field.validator](field.name, this.state.instance)) {
					errors.push(field.name);
				}
            }
            if(errors.length != 0) {
                this.setState({ errors: errors });
                return errors;
            } else {
                return false;
            }
        },
        handleSave: function(event){
            event.preventDefault();
            return this.save();
        },
        handlePublish: function(publish, event){
            event.preventDefault();
            if(publish){
                dispatch.publish(this.props.model, this.state.instance.id, function(data){
                    this.setState({ instance: data });
                }.bind(this));
            } else {
                dispatch.unpublish(this.props.model, this.state.instance.id, function(data){
                   this.setState({ instance: data });
                }.bind(this));
            }
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
        handlePreview: function(){
           if(this.state.unsaved){
               this.save(false, this.loadPreview);
           } else {
               this.loadPreview();
           }
        },
        loadPreview: function(){
            var win = window.open(this.getPreviewURL(), '_dispatch_' + this.state.instance.parent);
            win.focus();
        },
        saveCallback: function(instance, callback){
            this.setState({
                instance: instance,
                savedArticle: JSON.parse(JSON.stringify(instance)),
                head: instance.revision_id,
                head_id: instance.parent,
                version: instance.revision_id,
                firstSave: false,
                saving: false,
                unsaved: false
            }, function(){
                if(callback)
                    callback();
            });
            this.animateLoader();
        },
        renderLoader: function(){
            return ( <div className={'load-status' + (this.state.saving ? ' saving' : "")}><div className="loader"></div><div className="load-success"><i className="fa fa-check"></i></div></div> );
        },
        renderStatusDropdown: function(){
            return (
                <DropdownButton push="left" selectItem={this.updateStatus} items={STATUS_ITEMS}>
                    {this.state.instance.status ? this.getStatus(this.state.instance.status) : 'Draft'}
                </DropdownButton>
                );
        },
        renderVersions: function(){
            var versions = [];
            for(var i = this.state.head; i > 0; i--){
                versions.push({
                    value: i,
                    label: this.state.instance.published_version == i ? i + " (published)" : i,
                });
            }
            return versions;
        },
        getStatus: function(status){
            for(var i = 0; i < STATUS_ITEMS.length; i++){
                if(STATUS_ITEMS[i].value == status){
                    return STATUS_ITEMS[i].label;
                }
            }
        },
        renderToolbar: function(){
            return (
                <header className="secondary">
                    <div className="top-toolbar" dangerouslySetInnerHTML={QuillToolbar} />
                    <div className="header-buttons">
                        {this.renderLoader()}
                        <button className={"dis-button" + (this.state.unsaved ? " green" : "")} onClick={this.handleSave}>{this.state.firstSave ? 'Save' : 'Update'}</button>
                        {!this.state.instance.is_published ? this.renderStatusDropdown() : null}
                        <button className="dis-button" onClick={this.handlePublish.bind(this, !this.state.instance.is_published)}>{this.state.instance.is_published ? 'Unpublish' : 'Publish'}</button>
                        {this.renderPreviewButton()}
                        <DropdownButton push="left" selectItem={this.loadRevision} items={this.renderVersions()}>
                        {'Version ' + this.state.version}
                        </DropdownButton>
                    </div>
                </header>
            );
        }
    }

    for (var attrname in component) { prototype[attrname] = component[attrname]; }

    return prototype;
};

module.exports = PublishableAdmin;