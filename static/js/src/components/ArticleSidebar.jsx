var React = require('react');
var ReactTabs = require('react-tabs');
var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;

var FeaturedImage = require('./ArticleFeaturedImage.jsx');

var ArticleSidebar = React.createClass({
    handleSelected: function(){
    },
    render: function(){
        return (
            <Tabs
                onSelect={this.handleSelected}
                selectedIndex={0}>
                <TabList>
                    <Tab>Basic Fields</Tab>
                    <Tab>Featured Image</Tab>
                </TabList>
                <TabPanel>
                    <h2>Hello from Foo</h2>
                </TabPanel>
                <TabPanel>
                    <FeaturedImage manager={this.props.imageManager}/>
                </TabPanel>
            </Tabs>
        );
    }
});

module.exports = ArticleSidebar;
