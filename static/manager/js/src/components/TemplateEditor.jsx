var React = require('react');
var SelectField = require('./fields/SelectField.jsx');
var TextField = require('./fields/TextField.jsx');

var FIELDS = {
    text: 0,
    select: 1,
};

var TemplateEditor = React.createClass({
    getInitialState: function(){
        return {
            templates: [],
        };
    },
    componentDidMount: function(){
        dispatch.list('template', function(data){
            this.setState({ templates: data.results });
        }.bind(this));
    },
    updateTemplate: function(event){
        return this.props.updateHandler('template', event);
    },
    templateOptions: function(){
        return this.state.templates.map(function(template, i){
            return (<option key={i} value={template.slug}>{template.name}</option>);
        });
    },
    renderFields: function(){
        for(var i = 0; i < this.state.templates.length; i++){
            if(this.state.templates[i].slug == this.props.template){
                return this.state.templates[i].fields.map(function(field, i){
                    var rendered;
                    switch(FIELDS[field.type]){
                        case(FIELDS.text):
                            rendered = (<TextField field={field} />);
                            break;
                        case(FIELDS.select):
                            rendered = (<SelectField field={field} />);
                            break;
                    }
                   return rendered;
                });
            }
        }
    },
    render: function(){
        return (
            <div>
                <div className="field">
                    <label>Template</label>
                    <select value={this.props.template} onChange={this.updateTemplate}>
                        {this.templateOptions()}
                    </select>
                </div>
                {this.renderFields()}
            </div>
            );
    }
});

module.exports = TemplateEditor;
