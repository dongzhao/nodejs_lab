var myApp = angular.module('myApp', []);

function userController($scope, $http) {
	$scope.users = {};
	$http.get('/api/user/list')
	.success(function(results){
		$scope.users = results;
		console.log(results);
	})
	.error(function(results){
		console.log('error: ' + results);
	});
}