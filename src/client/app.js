var $ = jQuery = require('jquery');
var bootstrap = require('bootstrap');

var React = require('react');
var Header = require('./components/header');

var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;

var HelloMessage = React.createClass({
    render: function() {
        return <div>Hello dear {this.props.name}</div>;
    }
});

var Dashboard = React.createClass({
    render: function() {
        return <div>This is dashboard</div>;
    }
});

var Inbox = React.createClass({
    render: function() {
        return <div>This is inbox</div>;
    }
});

var Calendar = React.createClass({
    render: function() {
        return <div>This is calendar</div>;
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
                            <RouteHandler />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var routes = (
    <Route name="app" path="/" handler={App}>
        <Route name="inbox" path="/inbox" handler={Inbox}/>
        <Route name="calendar" path="/calendar" handler={Calendar}/>
        <DefaultRoute handler={Dashboard}/>
    </Route>
);

Router.run(routes, function(Handler) {
    React.render(<Handler />, document.body);
});
