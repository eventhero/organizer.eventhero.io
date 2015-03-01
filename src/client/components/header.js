var React = require('../libs').React;
var Bootstrap = require('../libs').Bootstrap;
var Navbar = Bootstrap.Navbar;
var Nav = Bootstrap.Nav;
var NavItem = Bootstrap.NavItem;
var DropdownButton = Bootstrap.DropdownButton;
var MenuItem = Bootstrap.MenuItem;

var Router = require('../libs').Router;
var Link = Router.Link;

module.exports = React.createClass({
    mixins: [Router.State],
    render: function() {
        return (
            <nav className="navbar navbar-inverse" role="navigation">
                <div className="container-fluid">
                    {/*!-- Brand and toggle get grouped for better mobile display --*/}
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <Link to="app" className="navbar-brand">Brand</Link>
                    </div>

                    {/*!-- Collect the nav links, forms, and other content for toggling --*/}
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <li className={this.isActive('inbox') ? 'active' : ''}>
                                <Link to="inbox">Inbox</Link>
                            </li>
                            <li className={this.isActive('calendar') ? 'active' : ''}>
                                <Link to="calendar">Calendar</Link>
                            </li>
                        </ul>
                        <form className="navbar-form navbar-left" role="search">
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Search" />
                            </div>
                            <button type="submit" className="btn btn-default">Submit</button>
                        </form>
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <a href="#">Link</a>
                            </li>
                            <li className="dropdown">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Dropdown
                                    <span className="caret"></span>
                                </a>
                                <ul className="dropdown-menu" role="menu">
                                    <li>
                                        <a href="#">Action</a>
                                    </li>
                                    <li>
                                        <a href="#">Another action</a>
                                    </li>
                                    <li>
                                        <a href="#">Something else here</a>
                                    </li>
                                    <li className="divider"></li>
                                    <li>
                                        <a href="#">Separated link</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
        //<ul>
        //    <li>
        //        <Link to="app">Dashboard</Link>
        //    </li>
        //    <li>
        //        <Link to="inbox">Inbox</Link>
        //    </li>
        //    <li>
        //        <Link to="calendar">Calendar</Link>
        //    </li>
        //</ul>

        //(<div className="row">
        //    <div className="col-xs-12">
        //        <nav className="navbar navbar-default" role="navigation">
        //            <div className="navbar-header">
        //                <a className="navbar-brand" href="#">
        //                    <img src="images/components/header/powered_by_brickwork.png"/>
        //                </a>
        //            </div>
        //            <ul className="nav navbar-nav">
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
