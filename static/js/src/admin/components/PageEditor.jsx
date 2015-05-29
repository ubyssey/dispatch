var FIELDS = {
    text: 0,
    model: 1,
}


var SearchField = React.createClass({
    getInitialState: function(){
        return {
            results: [],
            query: "",
        }
    },
    componentDidMount: function(){
         this.refs.search.getDOMNode().focus();
    },
    updateQuery: function(event){
        var query = event.target.value;
        this.setState({
            query: query,
        });
        if(query.length >= 3){
            this.props.searchItems(query, function(results){
                this.setState({
                    results: results,
                });
            }.bind(this));
        } else {
            this.setState({
                results: [],
            });
        }

    },
    renderResults: function(){
        return this.state.results.map(function(item, i){
            return (
                <li onClick={this.props.selectItem.bind(this, item)}>{this.props.renderItem(item)}</li>
                )
        }.bind(this));
    },
    renderNoResults: function(){
        if(this.state.query){
            return (
                 <li>Sorry, no results found.</li>
                )
        }
    },
    render: function(){
        var results = this.state.results.length > 0 ? this.renderResults() : this.renderNoResults();
        return (
            <div className="search-field">
                <div className="search-bar">
                    <input autoFocus ref="search" onChange={this.updateQuery} value={this.state.query} placeholder="Search" type="text" />
                </div>
                <ul>{results}</ul>
            </div>
            )
    }
});

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
                <input onChange={this.updateText} value={this.state.text} type="text" />
            </div>
            )
    }
});

var ItemStore = function(data){

    return {
        items: data ? data : [],
        remove: function(id){
            for(var i = 0; i < this.items.length; i++){
                if(this.items[i].id == id){
                    this.items.splice(i, 1);
                    return
                }
            }
        },
        append: function(item){
            this.items.push(item);
        },
        all: function(){
            return this.items;
        },
        getIds: function(){
            var ids = [];
            for(var i = 0; i < this.items.length; i++){
                ids.push(this.items[i].id);
            }
            return ids.join();
        }
    }
}

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

var ComponentEditor = React.createClass({
    componentDidMount: function(){
        this.fields = {};
    },
    saveComponent: function(){
        dispatch.saveComponent(this.props.page, this.props.component, this.props.spot, this.fields, function(data){
            console.log(data);
        });
    },
    updateField: function(field, data){
        this.fields[field] = data;
    },
    renderField: function(field, data){
        switch(FIELDS[field.type]){
            case(FIELDS.text):
                return (<TextField field={field} data={data} updateHandler={this.updateField} />);
            case(FIELDS.model):
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