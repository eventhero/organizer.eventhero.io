var React = require('react');
var Router = require('react-router');
var Header = require('./components/header');

var HelloMessage = React.createClass({
    render: function() {
        return <div>Hello dear {this.props.name}</div>;
    }
});

var Dashboard = React.createClass({
    render: function() {
        return <div>This is dashboard Oh yeah</div>;
    }
});

var Inbox = React.createClass({
    render: function() {
        return <div>This is inbox !!!!!1 </div>;
    }
});

var Calendar = React.createClass({
    render: function() {
        return <div>This is calendar 123</div>;
    }
});

var App = React.createClass({
    render: function() {
        return (
            <div>
                <Header />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xs-12">
                            <HelloMessage name="Kliment"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <Router.RouteHandler />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var routes = (
    <Router.Route name="app" path="/" handler={App}>
        <Router.Route name="inbox" path="/inbox" handler={Inbox}/>
        <Router.Route name="calendar" path="/calendar" handler={Calendar}/>
        <Router.DefaultRoute handler={Dashboard}/>
    </Router.Route>
);

Router.run(routes, function(Handler) {
    React.render(<Handler />, document.body);
});
