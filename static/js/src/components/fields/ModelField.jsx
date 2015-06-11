var React = require('react');
var SearchField = require('./SearchField.jsx');
var ItemStore = require('../stores/ItemStore.js');

var ModelField = React.createClass({
    getInitialState: function(){
        return {
            items: this.props.data ? ItemStore(this.props.data) : ItemStore(),
            active: false,
        }
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
        this.props.updateHandler(this.props.field.name, this.state.items.getIds());
    },
    getObjProp: function(obj, str){
        str = str.split(".");
        for (var i = 0; i < str.length; i++)
            obj = obj[str[i]];
        return obj;
    },
    selectItem: function(item){
        var id = this.getObjProp(item, this.props.field.key);
        var display = this.getObjProp(item, this.props.field.display);
        var item_obj = {
            id: id,
            display: display,
        };
        if(this.props.field.many)
            this.appendItem(item_obj);
        else
            this.replaceItem(item_obj);
    },
    appendItem: function(item_obj){
        var items = this.state.items;
        items.append(item_obj);
        this.setState({
            items: items,
        }, function(){
            this.toggleActive(false);
            this.updateField();
        });
    },
    replaceItem: function(item_obj){
        var items = ItemStore();
        items.append(item_obj);
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
        return item.long_headline;
    },
    searchItems: function(query, callback){
        dispatch.search(this.props.field.model, { q:query, limit:5 }, function(data){
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
                <SearchField selectItem={this.selectItem} renderItem={this.renderItem} searchItems={this.searchItems} />
            </div>
            )
    },
    renderModel: function(item){
        var deleteButton = (
            <div onClick={this.removeItem.bind(this, item.id)} className="model-delete"><i className="fa fa-close"></i></div>
            );
        return (
            <div className="model-label">
                <div className="left">{item.display}</div>
                {deleteButton}
            </div>
            )
    },
    render: function(){
        var items = this.state.items.all().map(function(item, i){
            return this.renderModel(item);
        }.bind(this));
        return (
            <div onMouseDown={this.mouseDownHandler} onMouseUp={this.mouseUpHandler} className={'field model-field ' + (this.state.active ? 'active' : '')}>
                <div className="field-container">
                    <label>{this.props.field.label}</label>
                    {items}
                </div>
                {this.state.active ? this.renderSearch() : ""}
                <div className="config">
                    <a href="#" onMouseDown={this.setActive}>Change article</a>
                </div>
            </div>
            )
    }
});

module.exports = ModelField;