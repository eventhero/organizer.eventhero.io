var $ = require('jquery');
global.jQuery = $; // HACK: This is until bootstrap fixes the check relying on jQuery being accessible on global/window
require('bootstrap'); // force browserify to bundle it
module.exports = {
    $: $,
    React: require('react'),
    Router: require('react-router'),
    Bootstrap: require('react-bootstrap')
};
