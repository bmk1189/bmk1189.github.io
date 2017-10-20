var logInModule =  angular.module('logInModule', []);


logInModule.controller('logInController', function($scope,$routeParams, $http, $location, SessionService) {
	$scope.usuario;
	$scope.password;
	//$scope.keyPress captures the keyboard input and "waits" for an enter key
	$scope.keyPress = function(keyEvent) {if (keyEvent.which === 13 && $scope.loginForm.$valid ){this.logIn();}}

	$scope.closeAlert = function(index) {$scope.alerts.splice(index, 1);};

	$scope.logInToPage = function(user){
		switch(user.accountLevel){
			 case userRols.generalUser :{$location.path('/main');break;}
		}
	}

	$scope.logIn=function(){
		SessionService.logIn({email:$scope.email,password:$scope.password}).then(function(user)
		{
			$scope.logInToPage(user);
		}).catch(function(err){
			$scope.password="";
			alert("Error: "+ err);
		});
	}

	//404

	$scope.goHome = function () {
		$location.path(getUserLayout())
	}

	$scope.goBack = function () {
		window.history.back();
	}
	$scope.goToSignUp=function(){
		$location.path('/signUp');
	}
});
