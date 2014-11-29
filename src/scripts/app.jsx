var React = require('react');

var HelloMessage = React.createClass({
    render: function() {
        return <div>Hello dear {this.props.name}</div>;
    }
});
React.render(<HelloMessage name="John" />, document.getElementById('hello'));
