mainReportsCtrl=function($scope,$modalInstance, $filter,items){

	$scope.report = items.report;
	$scope.pageSize=5;

	$scope.exit = function () {
		$modalInstance.dismiss();
	};

	$scope.save = function(){
		$modalInstance.close();
	};

	$scope.hasText=hasText;


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

	$scope.filterWithObject = function(el,searchObjectString, list, searchObject, currentPage) {
		str=searchObjectString + el; // e.g >>> el = "['x']" ó "['x']['y']" ó "['x']['y']['z']" ó ...
		if(!hasText(eval(str))){
			str = searchObjectString + $scope.firstArg(el);
			str = 'delete '+str; // e.g >>> str = delete $scope.searchArt['x']
			eval(str);
		}
		//$scope.filterList = filterFilter($scope.userReports, $scope.search);
		currentPage = 1;
		return $filter('filter')(list, searchObject);

	};

	$scope.searchAddress={};
	$scope.currentAddressPage=1;
	$scope.filterAddress=function(el){
		$scope.filteredAddresses=$scope.filterWithObject(el,"$scope.searchAddress", $scope.report.reportData.addresses, $scope.searchAddress, $scope.currentAddressPage);
	}
	$scope.filterAddress("");

	$scope.searchName={};
	$scope.currentNamesPage=1;
	$scope.filterName=function(el){
		$scope.filteredNames=$scope.filterWithObject(el,"$scope.searchName", $scope.report.reportData.names, $scope.searchName, $scope.currentNamesPage);
	}
	$scope.filterName("");



	$scope.searchLanguage={};
	$scope.currentLanguagesPage=1;
	$scope.filterLanguage=function(el){
		$scope.filteredLanguages=$scope.filterWithObject(el,"$scope.searchLanguage", $scope.report.reportData.languages, $scope.searchLanguage, $scope.currentLanguagesPage);
	}
	$scope.filterLanguage("");

	$scope.searchJob={};
	$scope.currentJobPage=1;
	$scope.filterJob=function(el){
		$scope.filteredJobs=$scope.filterWithObject(el,"$scope.searchJob", $scope.report.reportData.jobs, $scope.searchJob, $scope.currentJobPage);
	}
	$scope.filterJob("");

	$scope.searchPhones={};
	$scope.currentPhonesPage=1;
	$scope.filterPhone=function(el){
		$scope.filteredPhones=$scope.filterWithObject(el,"$scope.searchPhones", $scope.report.reportData.phones, $scope.searchPhones, $scope.currentPhonesPage);
	}
	$scope.filterPhone("");

	$scope.searchEmail={};
	$scope.currentEmailsPage=1;
	$scope.filterEmail=function(el){
		$scope.filteredEmails=$scope.filterWithObject(el,"$scope.searchEmail", $scope.report.reportData.emails, $scope.searchEmail, $scope.currentEmailsPage);
	}
	$scope.filterEmail("");

	$scope.searchSocial={};
	$scope.currentSocialsPage=1;
	$scope.filterSocial=function(el){
		$scope.filteredSocials=$scope.filterWithObject(el,"$scope.searchSocial", $scope.report.reportData.social, $scope.searchSocial, $scope.currentSociallsPage);
	}
	$scope.filterSocial("");

	$scope.tabs = [{
		title: 'Personal',
		url: 'mainReports.personal.tpl.html'
	}, {
		title: 'Professional',
		url: 'mainReports.professional.tpl.html'
	}, {
		title: 'CONTACT AND SOCIAL',
		url: 'mainReports.contactAndSocial.tpl.html'
	}];

	$scope.currentTab = 'mainReports.personal.tpl.html';

	$scope.onClickTab = function (tab) {
		$scope.currentTab = tab.url;
	}

	$scope.isActiveTab = function(tabUrl) {
		return tabUrl == $scope.currentTab;
	}
}
