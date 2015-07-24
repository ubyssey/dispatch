var React = require('react');
var SearchList = require('./SearchList.jsx');
var ItemStore = require('../stores/ItemStore.js');

var ManyModelDropdown = React.createClass({
    getInitialState: function(){
        return this.getState();
    },
    getState: function(){
        return {
            items: this.props.data ? ItemStore(this.props.data) : ItemStore(),
            active: false,
        }
    },
    componentWillReceiveProps: function(nextProps){
        this.props = nextProps;
        this.setState(this.getState());
    },
    componentDidMount: function(){
      window.addEventListener("mousedown", this.pageClick, false);
    },
    pageClick: function(e) {
        if (this.mouseIsDownOnField){
            if(this.state.active)
                this.toggleActive(true);
        } else {
        this.toggleActive(false);
        }
    },
    setActive: function(){
        this.toggleActive(true);
    },
    toggleActive: function(toggle){
        this.setState({
            active: toggle,
        });
    },
    updateField: function(){
        if(this.props.serialize)
            this.props.updateHandler(this.props.name, this.state.items.getIds());
        else
            this.props.updateHandler(this.props.name, this.state.items.all());
    },
    getObjProp: function(obj, str){
        str = str.split(".");
        for (var i = 0; i < str.length; i++)
            obj = obj[str[i]];
        return obj;
    },
    selectItem: function(item){
        var display = this.getObjProp(item, this.props.display);
        this.appendItem(item);
    },
    createItem: function(item, callback){
        this.props.createHandler(item, callback);
    },
    appendItem: function(item){
        var items = this.state.items;
        items.append(item, this.props.item_key);
        this.setState({
            items: items,
        }, function(){
            this.toggleActive(false);
            this.updateField();
        });
    },
    replaceItem: function(item){
        var items = ItemStore();
        items.append(item, this.props.item_key);
        this.setState({
            items: items,
        }, function(){
            this.toggleActive(false);
            this.updateField();
        });
    },
    removeItem: function(id){
        var items = this.state.items;
        items.remove(id);
        this.setState({
            items: items,
        }, this.updateField);
    },
    renderItem: function(item){
        return this.getObjProp(item, this.props.display);
    },
    initialItems: function(callback){
        dispatch.search(this.props.model, {}, function(data){
            callback(data.results);
        });
    },
    searchItems: function(query, callback){
        dispatch.search(this.props.model, { q:query, limit:5 }, function(data){
            callback(data.results);
        });
    },
    mouseDownHandler: function () {
        this.mouseIsDownOnField = true;
    },
    mouseUpHandler: function () {
        this.mouseIsDownOnField = false;
    },
    renderSearch: function(){
        return (
            <div className="search-container">
                <SearchList initialItems={this.initialItems} selectItem={this.selectItem} createItem={this.createItem} renderItem={this.renderItem} searchItems={this.searchItems} />
            </div>
            )
    },
    renderField: function(text){
        return (
            <div className="model-label" onMouseDown={this.setActive}>
                <div className="left">{text}</div>
                <div className="icon drop"><i className="fa fa-plus"></i></div>
            </div>
            )
    },
    renderModel: function(model, i){
        return (
            <div key={i} className="model-label">
                <div className="left">{this.renderItem(model)}</div>
                <div className="icon delete" onClick={this.removeItem.bind(this, model.id)}><i className="fa fa-close"></i></div>
            </div>
            )
    },
    render: function(){
        var items = this.state.items.all().map(function(item, i){
            return this.renderModel(item, i);
        }.bind(this));
        return (
            <div className={'field model-dropdown many ' + (this.state.active ? 'active' : '')}>
                <label>{this.props.label}</label>
                <div className="items">
                    {items}
                </div>
                <div onMouseDown={this.mouseDownHandler} onMouseUp={this.mouseUpHandler} className={"field-container " + this.props.errorClass}>
                    {this.renderField("Add new")}
                    {this.state.active ? this.renderSearch() : ""}
                </div>
            </div>
            )
    }
});

module.exports = ManyModelDropdown;