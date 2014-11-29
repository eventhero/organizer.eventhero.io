var React = require('react');

module.exports = React.createClass({
    render: function() {
        return <div class="row">
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
        </div>;
    }
});
