'use strict';

angular.module(
  'imaginetheending.data', []
)
  .factory(
    'data',
    [
      '$http',
      'data_source',
      function ($http, data_source) {
        return $http.get(data_source);
      }
    ]
  );