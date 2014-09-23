'use strict';

var angular = require('angular'); // That's right! We can just require angular as if we were in node

var app = angular.module('myApp', []);

app.controller('HelloCtrl', function($scope) {
  $scope.test = 'Test varretjes';
});

