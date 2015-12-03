var React = require('react');
var ManyModelDropdown = require('./fields/ManyModelDropdown.jsx');

var FIELDS = {
    text: 0,
    model: 1,
}

var TextField = React.createClass({
    getInitialState: function(){
        return {
            text: this.props.data ? this.props.data : "",
        }
    },
    updateField: function(){
        this.props.updateHandler(this.props.field.name, this.state.text);
    },
    updateText: function(event){
        this.setState({
            text: event.target.value,
        }, this.updateField);
    },
    render: function(){
        return (
            <div className="field">
                <label>{this.props.field.label}</label>
                <input onChange={this.updateText} value={this.props.data} type="text"></input>
            </div>
            )
    }
});

var ComponentEditor = React.createClass({
    componentDidMount: function(){
        this.fields = {};
    },
    saveComponent: function(){
        dispatch.saveComponent(this.props.page, this.props.component, this.props.spot, this.fields, function(data){
            console.log(data);
            console.log(this.fields);
        }.bind(this));
    },
    updateField: function(field, data){
        this.fields[field] = data;
    },
    renderField: function(field, data){
        switch(FIELDS[field.type]){
            case(FIELDS.text):
                return (<TextField field={field} data={data} updateHandler={this.updateField} />);
            case(FIELDS.model):
                if(field.many)
                    return (<ManyModelDropdown model={field.model} serialize item_key={field.key} display={field.display} label={field.label} name={field.name} data={data} updateHandler={this.updateField} />);
                else
                    return (<ModelField field={field} data={data} updateHandler={this.updateField} />);
        }
    },
    renderFields: function(){
        return this.props.fields.map(function(field, i){
            if(this.props.data && this.props.data[field.name]){
                return this.renderField(field, this.props.data[field.name]);
            } else {
                return this.renderField(field, null);
            }
        }.bind(this));
    },
    render: function(){
        return (
            <div>
                {this.renderFields()}
                <button onClick={this.saveComponent}>Save</button>
            </div>
            )
    }
});

var PageEditor = React.createClass({
    getInitialState: function(){
        return {
            currentSpot: false,
            currentComponent: false,
            currentComponentData: null,
            spots: [],
        };
    },
    componentWillMount: function(){
        dispatch.components(this.props.slug, function(data){
            this.components = data.components;
            this.component_data = data.saved;
            this.setState({
                spots: data.spots,
            });
            this.changeSpot(data.spots[0]);
        }.bind(this));
    },
    changeSpot: function(spot){
        if(this.component_data[spot.slug]){
            var data = this.component_data[spot.slug];
            this.changeComponent(data.slug, data.fields);
        } else {
            this.changeComponent(spot.options[0].slug);
        }
        this.setState({
            currentSpot: spot,
        });
    },
    changeComponent: function(component, data){
        if(typeof data === 'undefined'){
            data = null;
        }
        this.setState({
            currentComponent: component,
            currentComponentData: data,
        });
    },
    handleChangeComponent: function(event){
        this.changeComponent(event.target.value);
    },
    renderComponent: function(){
        if(!this.state.currentComponent)
            return
        return (
            <ComponentEditor page={this.props.slug} spot={this.state.currentSpot.slug} component={this.state.currentComponent} data={this.state.currentComponentData} fields={this.components[this.state.currentComponent]} />
            )
    },
    renderOptions: function(){
        if(!this.state.currentSpot)
            return
        var options = this.state.currentSpot.options.map(function(option, i){
            return (
                <option value={option.slug} key={i}>{option.name}</option>
                );
        });
        return (
            <select onChange={this.handleChangeComponent}>{options}</select>
            );
    },
    render: function(){
        var spots = this.state.spots.map(function (spot, i) {
            return (
                <li className={this.state.currentSpot == spot ? "active" : ""} onClick={this.changeSpot.bind(this, spot)} key={i}>{spot.name}</li>
                );
        }.bind(this));

        return (
            <div className="row">
                <div className="spots">
                    <div className="component-header"><label>Components</label></div>
                    <ul>{spots}</ul>
                </div>
                <div className="component">
                    <div className="component-header"><label>Choose layout:</label> {this.renderOptions()}</div>
                    <div className="component-fields">{this.renderComponent()}</div>
                </div>
            </div>
            );
    }
});

module.exports = PageEditor;