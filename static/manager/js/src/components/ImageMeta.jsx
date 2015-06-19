var React = require('react');
var ImageMeta = React.createClass({
    getInitialState: function(){
        return this.getState();
    },
    getState: function(){
        return {
            authorName: this.props.authors[0] ? this.props.authors[0].full_name : "",
            author: this.props.authors[0] ? this.props.authors[0] : false,
            title: this.props.title,
            edited: false,
            saving: false,
            saved: false,
        }
    },
    componentDidMount: function(){
    },
    componentWillReceiveProps: function(nextProps){
        this.props = nextProps;
        this.setState(this.getState());
    },
    changeAuthor: function(author){
        this.setState({
            authorName: author.full_name,
            author: author,
        });
    },
    handleChangeAuthor: function(event){
        this.setState({
            authorName: event.target.value,
            author: false,
            edited: true,
        });
    },
    handleChangeTitle: function(event){
        this.setState({
            title: event.target.value,
            edited: true,
        });
    },
    handleUpdate: function(event){
        if(this.state.author){
            this.updateAuthor(this.state.author.id);
        } else {
            dispatch.add("person", {
                'full_name': this.state.authorName,
            }, function(data){
                this.updateAuthor(data.id);
            }.bind(this));
        }
    },
    handleDelete: function(){
        this.props.onDelete(this.props.id);
    },
    updateAuthor: function(authorId){
        this.setState({
            saving: true,
        });
        dispatch.update('image', this.props.id, {authors: authorId, title: this.state.title}, function(data){
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
                <img className="image-meta-preview" src={ this.props.url } />
                <h3>{this.props.filename}</h3>
                <div className="field full">
                    <label>Title:</label>
                    <input type="text" className="full" onChange={ this.handleChangeTitle } value={ this.state.title }/>
                </div>
                <div className="field full">
                    <label>Photographer:</label>
                    <input type="text" className="dis-input add-author" onChange={ this.handleChangeAuthor } value={ this.state.authorName }/>
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