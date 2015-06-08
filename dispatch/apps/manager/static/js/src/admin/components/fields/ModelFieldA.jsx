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
    getDefaultProps: function() {
        return {
            many: false,
        };
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
        this.props.updateHandler(this.props.name, this.state.items.all(), this.props.many);
    },
    getObjProp: function(obj, str){
        str = str.split(".");
        for (var i = 0; i < str.length; i++)
            obj = obj[str[i]];
        return obj;
    },
    selectItem: function(item){
        console.log(this.props);
        var id = this.getObjProp(item, this.props.item_key);
        var display = this.getObjProp(item, this.props.display);
        var item_obj = {
            id: id,
            display: display,
        };
        if(this.props.many)
            this.appendItem(item);
        else
            this.replaceItem(item);
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
        return this.getObjProp(item, this.props.display);
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
                <div className="left">{this.getObjProp(item, this.props.display)}</div>
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
                    <label>{this.props.label}</label>
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