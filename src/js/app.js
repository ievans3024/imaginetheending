/**
 * Imagine The Ending
 * The angularjs code that runs Heather Nunnelly's gallery pages.
 * @copyright Ian Evans 2015
 * @license MIT
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
  );
