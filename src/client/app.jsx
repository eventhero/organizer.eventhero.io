var React = require('react');

var HelloMessage = React.createClass({
    render: function() {
        return <div>Hello dear {this.props.name}</div>;
    }
});

var App = React.createClass({
    render: function() {
        var app = <div class="container-fluid">
            <div class="row">
                <div class="col-xs-12">
                    <nav class="navbar navbar-default" role="navigation">
                        <div class="navbar-header">
                            <a class="navbar-brand" href="#">
                                <img src="images/components/header/powered_by_brickwork.png"/>
                            </a>
                        </div>
                        <ul class="nav navbar-nav">
                            <li data-match-route="/state1">
                                <a ui-sref="state1">State 1</a>
                            </li>
                            <li data-match-route="/state2">
                                <a ui-sref="state2">State 2</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <HelloMessage name="Kliment"/>
                </div>
            </div>
        </div>;
        return app;
    }
});
React.render(<App />, document.getElementById('app'));
