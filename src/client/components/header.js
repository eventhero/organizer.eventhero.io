var React = require('react');
var Navbar = require('react-bootstrap').Navbar;
var Nav = require('react-bootstrap').Nav;
var NavItem = require('react-bootstrap').NavItem;
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;

module.exports = React.createClass({
    render: function() {
        return (
            <Navbar className="special">
                <Nav>
                    <NavItem eventKey={1} href="#">Link</NavItem>
                    <NavItem eventKey={2} href="#">Link</NavItem>
                    <DropdownButton eventKey={3} title="Dropdown">
                        <MenuItem eventKey="1">Action</MenuItem>
                        <MenuItem eventKey="2">Another action</MenuItem>
                        <MenuItem eventKey="3">Something else here</MenuItem>
                        <MenuItem divider />
                        <MenuItem eventKey="4">Separated link</MenuItem>
                    </DropdownButton>
                </Nav>
            </Navbar>
        );

        //(<div class="row">
        //    <div class="col-xs-12">
        //        <nav class="navbar navbar-default" role="navigation">
        //            <div class="navbar-header">
        //                <a class="navbar-brand" href="#">
        //                    <img src="images/components/header/powered_by_brickwork.png"/>
        //                </a>
        //            </div>
        //            <ul class="nav navbar-nav">
        //                <li data-match-route="/state1">
        //                    <a ui-sref="state1">State 1</a>
        //                </li>
        //                <li data-match-route="/state2">
        //                    <a ui-sref="state2">State 2</a>
        //                </li>
        //            </ul>
        //        </nav>
        //    </div>
        //</div>);
    }
});
