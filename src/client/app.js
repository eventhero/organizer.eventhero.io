var React = require('react');
var Header = require('./components/header');

var HelloMessage = React.createClass({
    render: function() {
        return <div>Hello dear {this.props.name}</div>;
    }
});

var App = React.createClass({
    render: function() {
        return <div class="container-fluid">
            <Header />
            <div class="row">
                <div class="col-xs-12">
                    <HelloMessage name="Kliment"/>
                </div>
            </div>
        </div>;
    }
});
React.render(<App />, document.getElementById('app'));
