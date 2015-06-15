/**
 * Imagine The Ending
 * The angularjs code that runs Heather Nunnelly's gallery pages.
 * @copyright 2015 Ian Evans
 * @preserve
 */

'use strict';

angular.module(
  'imaginetheending',
  [
    'ngRoute',
    'imaginetheending.data',  // service
    'imaginetheending.showcase' // view/ctrl
  ]
)
  .config(
    [
      '$routeProvider',
      function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/illustration/'});
      }
    ]
  )
  .constant(
    'data_source',
    'showcases.json'
  )
  .filter(
  'striphtml',
  function () {
    return function (input) {
      return input.replace(
        /(<([^>]+)>)/ig, ""  // captures anything that looks like <...> and replaces it with nothing.
      );
    }
  }
  );
