var signUpModule =  angular.module('signUpModule', []);


signUpModule.controller('signUpController', function($scope, $http, $location, SessionService) {
	$scope.userName;
	$scope.password = "BV-API-Challenge";

	//$scope.keyPress captures the keyboard input and "waits" for an enter key
	$scope.keyPress = function(keyEvent) {if (keyEvent.which === 13 && $scope.usuario && $scope.password){this.logIn();}}

	$scope.signUp=function(){
		//I'm not sure were should I assign the accountLevel, so let's do that at interface level for now...
		SessionService.signUp ({email:$scope.email, userName:$scope.userName, password: $scope.password, accountLevel:1}).then(function(TransacStatus){
			alert("User Creation: " + TransacStatus);
			$location.path('/');
		}).catch(function(err){
			alert("Error: "+ err);
		});
	}
	$scope.goToLogIn=function(){
		$location.path('/');
	}
});
