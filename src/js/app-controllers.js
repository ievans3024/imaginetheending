
angular.module(
  'imaginetheending.showcase',
  [
    'ngRoute',
    'imaginetheending.data'
  ]
)

.config(
  [
    '$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when(
          '/:showcase/',
          {
            templateUrl: 'templates/showcase.html',
            controller: 'showcase'
          }
        )
        .when(
          '/:showcase/:image/',
          {
            templateUrl: 'templates/image.html',
            controller: 'image'
          }
        )
        .when(
          '/:showcase/:section/:image/',
          {
            templateUrl: 'templates/image.html',
            controller: 'image'
          }
        );
    }
  ]
)

.controller(
  'menu',
  [
    '$scope',
    '$routeParams',
    'data',
    function($scope, $routeParams, data) {

      $scope.current_showcase = "";
      $scope.is_image = false;
      $scope.showcases = {};
      $scope.menu_order = [];
      $scope.menu_cols = 0;

      $scope.$on('$routeChangeSuccess', function () {
        $scope.current_showcase = $routeParams.showcase;
        if ($routeParams.image) {
          $scope.is_image = true;
        } else {
          $scope.is_image = false;
        }
      });

      data.success(function (data, status, xhr) {
        $scope.showcases = data.showcases;
        $scope.menu_order = data.showcase_order;
        $scope.menu_cols = Math.floor(12 / $scope.menu_order.length);
      });

    }
  ]
)

.controller(
  'footer',
  [
    '$scope',
    function ($scope) {
      $scope.date = new Date();
    }
  ]
)

.controller(
  'showcase',
  [
    '$scope',
    '$sce',
    '$routeParams',
    'data',
    function($scope, $sce, $routeParams, data) {

      $scope.showcase = {};
      $scope.view_id = "";

      data
        .success(
          function (data, status, xhr) {
            var i = 0,
                sections;
            $scope.showcase = data.showcases[$routeParams.showcase];
            $scope.view_id = $scope.showcase.slug;

            sections = $scope.showcase.sections;
            for (i; i < sections.length; i++) {
              if (sections[i].title) {
                sections[i].title = $sce.trustAsHtml(sections[i].title);
              }
            }
          }
        );
    }
  ]
)

.controller(
  'image',
  [
    '$scope',
    '$sce',
    '$routeParams',
    'data',
    function($scope, $sce, $routeParams, data) {

      $scope.showcase = {};
      $scope.image = {};
      $scope.view_id = "";

      data
        .success(
          function (data, status, xhr) {
            $scope.showcase = data.showcases[$routeParams.showcase];
            $scope.image = $scope.showcase.images[$routeParams.image];
            $scope.view_id = $scope.image.slug;
            if ($scope.image.description) {
              $scope.image.description = $sce.trustAsHtml($scope.image.description);
            }
          }
        );
    }
  ]
);