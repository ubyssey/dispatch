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
            field_data: this.props.fields ? this.props.fields : {},
        };
    },
    componentWillMount: function(){
        dispatch.list('template', function(data){
            this.setState({ templates: data.results });
        }.bind(this));
    },
    updateTemplate: function(event){
        return this.props.updateHandler('template', event);
    },
    updateField: function(field, event){
        var field_data = this.state.field_data;
        field_data[field] = event.target.value;
        this.setState({ field_data: field_data});
    },
    templateOptions: function(){
        return this.state.templates.map(function(template, i){
            return (<option key={i} value={template.slug}>{template.name}</option>);
        });
    },
    save: function(){
        return JSON.stringify(this.state.field_data);
    },
    renderFields: function(field_data){
        for(var i = 0; i < this.state.templates.length; i++){
            if(this.state.templates[i].slug == this.props.template){
                return this.state.templates[i].fields.map(function(field, i){
                    var rendered;
                    switch(FIELDS[field.type]){
                        case(FIELDS.text):
                            rendered = (<TextField key={i} field={field} value={field_data[field.name]} updateHandler={this.updateField.bind(this, field.name)} />);
                            break;
                        case(FIELDS.select):
                            rendered = (<SelectField key={i} label={field.label} options={field.options} value={field_data[field.name]} updateHandler={this.updateField.bind(this, field.name)} />);
                            break;
                    }
                   return rendered;
                }.bind(this));
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
                {this.renderFields(this.state.field_data)}
            </div>
            );
    }
});

module.exports = TemplateEditor;
