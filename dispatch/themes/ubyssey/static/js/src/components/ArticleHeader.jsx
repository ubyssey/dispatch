var ArticleHeader = React.createClass({
    componentWillMount: function(){
        this.logo = $('img.logo').attr('src');
        this.home = $('a.home-link').attr('href');
    },
    render: function(){
        return (
            <header className="topbar header-article">
                <div className="container">
                    <div className="section-name">
                        <a href={this.home} className="icon-logo">
                            <img className="logo" src={this.logo} />
                        </a>
                        <span>{this.props.name}</span>
                    </div>
                    |
                    <h1 className="nav-headline">{ this.props.headline|safe }</h1>
                </div>
            </header>
        );
    }
});

module.exports = ArticleHeader;

