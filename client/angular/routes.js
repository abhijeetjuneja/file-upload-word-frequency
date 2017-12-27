
app.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider){
    $routeProvider
    	.when('/',{
            // location of the template
            templateUrl     : 'views/get-number-view.html',
            controller      : 'numberController',
            controllerAs    : 'number',
            // Which controller it should use
        })
        .when('/result',{
            // location of the template
            templateUrl     : 'views/query-detail-view.html',
            controller      : 'ticketController',
            controllerAs    : 'ticket',
            authenticated   :  true 
        })
        .otherwise(
            {
                //redirectTo:'/'
                templateUrl   : 'views/error404.html'
            }
        );
        $locationProvider.html5Mode({
  enabled: true,
  requireBase: false
}).hashPrefix('');
}]);

