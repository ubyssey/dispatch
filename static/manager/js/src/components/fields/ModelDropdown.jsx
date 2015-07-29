var React = require('react');
var SearchList = require('./SearchList.jsx');

var ModelDropdown = React.createClass({
    getInitialState: function(){
        return {
            item: this.props.data ? this.props.data : false,
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
        this.props.updateHandler(this.props.name, this.state.item);
    },
    getObjProp: function(obj, str){
        str = str.split(".");
        for (var i = 0; i < str.length; i++)
            obj = obj[str[i]];
        return obj;
    },
    selectItem: function(item){
        var id = this.getObjProp(item, this.props.item_key);
        var display = this.getObjProp(item, this.props.display);
        this.replaceItem(item);
    },
    replaceItem: function(item){
        this.setState({
            item: item,
        }, function(){
            this.toggleActive(false);
            this.updateField();
        });
    },
    removeItem: function(id){
        this.setState({
            item: false,
        }, this.updateField);
    },
    createItem: function(item, callback){
        this.props.createHandler(item, callback);
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
                <div className="icon"><i className="fa fa-caret-down"></i></div>
            </div>
            )
    },
    render: function(){
        var label = (<label>{this.props.label}</label>);
        return (
            <div className={'field model-dropdown ' + (this.state.active ? 'active' : '')}>
                {this.props.label ? label : null}
                <div onMouseDown={this.mouseDownHandler} onMouseUp={this.mouseUpHandler} className={"field-container " + this.props.errorClass}>
                    {this.state.item ? this.renderField(this.getObjProp(this.state.item, this.props.display)) : this.renderField()}
                    {this.state.active ? this.renderSearch() : ""}
                </div>
            </div>
            )
    }
});

module.exports = ModelDropdown;