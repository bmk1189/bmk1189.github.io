var mainViewModule =  angular.module('mainViewModule', []);

mainViewModule.controller('mainViewController', function($scope, $location, $filter, $modal, SessionService, filterFilter){

/*
  ______ _____ _   _______ ______ _____   _____
 |  ____|_   _| | |__   __|  ____|  __ \ / ____|
 | |__    | | | |    | |  | |__  | |__) | (___
 |  __|   | | | |    | |  |  __| |  _  / \___ \
 | |     _| |_| |____| |  | |____| | \ \ ____) |
 |_|    |_____|______|_|  |______|_|  \_\_____/

*/

	$scope.search = {};

	$scope.currentPage=1;
	$scope.pageSize=10;


	$scope.firstArg=function(el){
		var str='';
		for(var i=0;el.length>0;i++){
			if(el[i]===']'){
				str+=el[i];
				return str;
			}
			str+=el[i]
		}
	}

	$scope.filterReports = function(el) {
		str="$scope.search"+el; // e.g >>> el = "['x']" ó "['x']['y']" ó "['x']['y']['z']" ó ...
		if(!hasText(eval(str))){
			str = "$scope.search" + $scope.firstArg(el);
			str = 'delete '+str; // e.g >>> str = delete $scope.searchArt['x']
			eval(str);
		}
		//$scope.filterList = filterFilter($scope.userReports, $scope.search);
		$scope.filterList = $filter('filter')($scope.userReports, $scope.search);
		$scope.currentPage = 1;
	};
	$scope.filterReports("");

/*

	  __  __      _   _               _                       _    __                  _   _
	 |  \/  |    | | | |             | |                     | |  / _|                | | (_)
	 | \  / | ___| |_| |__   ___   __| |___    __ _ _ __   __| | | |_ _   _ _ __   ___| |_ _  ___  _ __  ___
	 | |\/| |/ _ \ __| '_ \ / _ \ / _` / __|  / _` | '_ \ / _` | |  _| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
	 | |  | |  __/ |_| | | | (_) | (_| \__ \ | (_| | | | | (_| | | | | |_| | | | | (__| |_| | (_) | | | \__ \
	 |_|  |_|\___|\__|_| |_|\___/ \__,_|___/  \__,_|_| |_|\__,_| |_|  \__,_|_| |_|\___|\__|_|\___/|_| |_|___/


*/



	$scope.lookUpEmail=function(){
		SessionService.lookUpEmail($scope.lookUpEmailField).then(function(data){
			//$scope.userReports.push(data);
			$scope.loadUserReports();
			$scope.filterReports("");
		}).catch(function(error){
			console.log(error);
		});
	}
	$scope.openReport=function(report){

		SessionService.getReportByReportID(report).then(function(data){
			//$scope.userReports.push(data);
			$scope.openReportModal(data);

		}).catch(function(error){
			console.log("Error: ", error);
		});
	}

	$scope.loadUserReports=function(){
		SessionService.getReportsHeadersByUserMail().then(function(data){
			$scope.userReports = data;
			$scope.filterReports("");
		}).catch(function(err){
		});
	}
	$scope.loadUserReports();


	$scope.openReportModal = function(report){
		var mainReportsModalInstance = $modal.open({
			templateUrl: 'pages/modals/mainReports.html',
			controller: mainReportsCtrl,
			windowClass:"modalWindowExtraLarge",
			backdrop:'static',
			resolve:{
				items: function(){
					$scope.items = {report:report};
					return $scope.items;
				}
			}
		});
		//pdf/articulosVentaCatalogo?idFamilia=3&idSubfamilia=3&familiaName=bajos 720&subfamiliaName=gaveta
		mainReportsModalInstance.result.then(
			function(result){

			},function(result){
			}
		);
	};

	$scope.keyPress = function(keyEvent) {if (keyEvent.which === 13 && $scope.lookUpEmailForm.$valid ){this.lookUpEmail();}}




});
