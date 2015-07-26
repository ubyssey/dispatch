var React = require('react');
var ManyModelDropdown = require('../fields/ManyModelDropdown.jsx');
var ItemStore = require('../stores/ItemStore.js');

var ImageMeta = React.createClass({
    getInitialState: function(){
        return this.getState();
    },
    getState: function(){
        return {
            authors: this.props.image.authors ? this.props.image.authors : [],
            title: this.props.image.title,
            edited: false,
            saving: false,
            saved: false,
        }
    },
    componentWillReceiveProps: function(nextProps){
        this.props = nextProps;
        this.setState(this.getState());
    },
    updateAuthors: function(field, authors){
        this.setState({
            authors: authors,
            edited: true
        });
    },
    createAuthor: function(author_name, callback){
        dispatch.add('person', {full_name: author_name}, callback);
    },
    handleChangeTitle: function(event){
        this.setState({
            title: event.target.value,
            edited: true,
        });
    },
    handleUpdate: function(event){
        if(this.state.authors){
            this.saveAuthors(this.state.authors);
        }
    },
    handleDelete: function(){
        this.props.onDelete(this.props.image.id);
    },
    saveAuthors: function(authors){
        this.setState({
            saving: true,
        });
        dispatch.update('image', this.props.image.id, {author_ids: ItemStore(this.state.authors).getIds(), title: this.state.title}, function(data){
            this.props.onUpdate(data);
            this.setState({
                saving: false,
                saved: true,
            });
            $('.image-meta .fa-check').fadeIn(500, function(){
                setTimeout(function(){
                    $('.image-meta .fa-check').fadeOut(500, function(){
                        this.setState({
                            saved: false,
                        });
                    }.bind(this));
                }.bind(this), 1000);
            }.bind(this));
        }.bind(this));
    },
    renderLoader: function(){
        if(this.state.saving){
            return (
                <div className="loader"></div>
            )
        } else if (this.state.saved){
            return (
                <i className="fa fa-check"></i>
            );
        }
    },
    render: function(){
        return (
            <div className="image-meta">
                <img className="image-meta-preview" src={ this.props.image.url } />
                <h3>{this.props.image.filename}</h3>
                <div className="field full">
                    <label>Title</label>
                    <input type="text" className="full" onChange={ this.handleChangeTitle } value={ this.state.title }/>
                </div>
                <div className="field full">
                    <ManyModelDropdown model="person" item_key="id" display="full_name" label="Photographers" name="authors" data={this.state.authors} updateHandler={this.updateAuthors} createHandler={this.createAuthor} />
                    <div className="author-dropdown"></div>
                </div>
                <div className="field full">
                    <div className="pull-left">
                        <button onClick={this.handleUpdate} className="dis-button green update-image" disabled={!this.state.edited}>Update</button>
                        {this.renderLoader()}
                    </div>
                    <div className="pull-right">
                        <button onClick={this.handleDelete} className="dis-button" >Delete</button>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ImageMeta;