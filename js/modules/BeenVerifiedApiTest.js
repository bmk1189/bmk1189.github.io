/////
/*
variables de localStorage utilizadas:
bvUsers
*/

var bvAPIChallengeRouting = angular.module('BvAPIChallengeModule',
		['ngRoute','ui.bootstrap','logInModule','signUpModule','mainViewModule',
		'anguFixedHeaderTable']);

//variable to have current user loaded
var currentUser;

const userRols = {
	unauthenticatedUser:0,
	generalUser:1
}

const routes =
{
		////////////////////////////////////////////////////
		/////////////////////LOGIN//////////////////////////
    "/": {
        templateUrl: 'pages/login.html',
        controller: 'logInController',
        requireLogin: false,
		roles:[userRols.unauthenticatedUser,userRols.generalUser]
    },

	"/signUp": {
        templateUrl: 'pages/signup.html',
        controller: 'signUpController',
        requireLogin: false,
		roles:[userRols.unauthenticatedUser,userRols.generalUser]
    },
	"/main": {
        templateUrl: 'pages/mainView.html',
        controller: 'mainViewController',
        requireLogin: true,
		roles:[userRols.generalUser]
    }
};

bvAPIChallengeRouting.config(['$routeProvider', function($routeProvider){
    //this loads up the routes dynamically from the previous object
    for(var path in routes) {
        $routeProvider.when(path, routes[path]);
    }
	//if rout not found
    $routeProvider.otherwise({redirectTo: '/404'});
}]).run(function($rootScope, $route, $modalStack, SessionService){
    $rootScope.$on("$locationChangeStart", function(event, next, current) {
		var user = SessionService.getUserAuthenticated()?SessionService.getCurrentUser():undefined;
    	for(var i in routes) {

            if(next.indexOf(i) != -1) {

				//if the page wanted requires login but current user is unauthenticated, i.e.: user typed url by himself.
				if(routes[i].requireLogin && !user) {
                    alert("You need to be authenticated to see this page.");
                    event.preventDefault();
					//go back to the main window
                    window.location.assign(window.location.protocol+"//" + window.location.hostname + ":" + window.location.port +
                    		window.location.pathname + "#/");
                }
				//since there may be some pages for different account levels, verify that the user is allowed to see an specific page.
                if(routes[i].requireLogin && !_.isUndefined(user) &&
                		routes[i].roles.indexOf(parseInt(user.accountLevel))<0){
                	alert("You're not allowed to see this page.");
                	event.preventDefault();
                }
            }
        }
    });
});


bvAPIChallengeRouting.service('DataService', function($http, $q){
	/***************************************************************************
	* MANY OF WHAT HAPPENS HERE SHOULD HAVE SOME VALIDATIONS, LIKE
	* IF THE USER REQUESTING DATA IS ALLOWED TO CONSUME SOME DATA SERVICE
	* BUT HERE IT IS OMMITED
	***************************************************************************/
	this.addUser=function(user){
		let users = angular.fromJson(localStorage.getItem("bvUsers"))||[];
		let defered = $q.defer();
		let promise = defered.promise;
		let userFound=false;
		for(u of users){
			if(u.email == user.email){
				userFound=true;
				defered.reject("Email "+ user.email +" already exists");
				break;
			}
		}

		if(!userFound){
			users.push(user);
			try{
				localStorage.setItem("bvUsers",angular.toJson(users));
				defered.resolve("User added successfully");
			}catch(error){
				//With localStorage the only problem that I can imagine is that the quote is full.
				defered.reject("Something went wrong. Please try again in a few minutes.");
			}
		}
        return promise;
	}

	this.getUserAccountLevel=function(user){
		let users = angular.fromJson(localStorage.getItem("bvUsers"))||[];
        let defered = $q.defer();
        let promise = defered.promise;
		let userFound=false;
		for(user of users){
			if(user.email==userAttempt.email){
				userFound=true;
				defered.resolve(user.accountLevel);
			}
				break;//in a complete app, user email should only be one time in all records,
					  //so if found but with wrong password, exit the loop.
		}
		if(!userFound){defered.reject("User not found")}
        return promise;
    };

	this.getAuthentication=function (userAttempt) {
		let users = angular.fromJson(localStorage.getItem("bvUsers"))||[];
        let defered = $q.defer();
        let promise = defered.promise;
		let loggedSuccess=false;
		for(user of users){
			if(user.email==userAttempt.email){
				if(userAttempt.password == user.password){
					loggedSuccess=true;
					//the password shouldn't be sent to the user. Not used in this case, anyway...
					_.isUndefined(user.password)?null:delete user.password;
					defered.resolve(user);
				}
				break;//in a complete app, user email should only be one time in all records,
					  //so if found but with wrong password, exit the loop.
			}
		}
		if(!loggedSuccess){defered.reject("Unknown Credentials")}
        return promise;
    };

	this.clearLocalStorage =function(){
		var defered = $q.defer();
		var promise = defered.promise;
		try{
			localStorage.clear();
			defered.resolve("localStorage cleared successfully");
		}catch(err){
			defered.reject(err);
		};
		return promise;
	}


	this.getReportsByUserEmail=function(user){
		let reportsByUserEmail = angular.fromJson(localStorage.getItem("bvReportsByUserEmail"))||[];
		let reportsOfUser;

		for(rbu in reportsByUserEmail){
			if(reportsByUserEmail[rbu].userEmail = user.email){
				reportsOfUser = reportsByUserEmail[rbu];
				break;
			}
		}
		if(_.isUndefined(reportsOfUser)) {
			reportsOfUser={userEmail: user.email, reports:[]};
		}
		return reportsOfUser;
	}

	this.lookUpEmail= function(request){
        var defered = $q.defer();
        var promise = defered.promise;
		let user = request.user;
		let email = request.email;

		let reportsByUserEmail = angular.fromJson(localStorage.getItem("bvReportsByUserEmail"))||[];
		let reportsOfUser;

		let reportData;

		for(rbu in reportsByUserEmail){
			if(reportsByUserEmail[rbu].userEmail = user.email){
				reportsOfUser = reportsByUserEmail[rbu];
				reportsByUserEmail.splice(rbu,1);
				break;
			}
		}

		if(_.isUndefined(reportsOfUser)) {
			reportsOfUser={userEmail: user.email, reports:[]};
		}

/*


    _
   (_)
    _ ___  ___  _ __  _ __
   | / __|/ _ \| '_ \| '_ \
   | \__ \ (_) | | | | |_) |
   | |___/\___/|_| |_| .__/
  _/ |               | |
 |__/                |_|


*/
		serviceUrl = "http://www.beenverified.com/hk/dd/email?callback=JSON_CALLBACK";
		$http.jsonp(serviceUrl,{params:{email: email}}).success(
			function(data){
				console.log(data);
				reportData = angular.fromJson(data);
				let report = {
					emailRequested:email,
					requestDate: Date.now(),
					reportData: reportData
				};

				reportsOfUser.reports.push(report);

				reportsByUserEmail.push(reportsOfUser);

				reportHeader={emailRequested:report.emailRequested, requestDate:report.requestDate, reportId:report.reportData.report_info.report_id};
				let = response={reportHeader:reportHeader, report:report};

				try{
					localStorage.setItem("bvReportsByUserEmail",angular.toJson(reportsByUserEmail));
					defered.resolve(response);
				}catch(error){
					//With localStorage the only problem that I can imagine is that the quote is full.
					defered.reject("Something went wrong. Please try again in a few minutes.");
				}
			}
		).error(function(err){

		});





/*


  _     _   _                      _
 | |   | | | |                    | |
 | |__ | |_| |_ _ __     __ _  ___| |_
 | '_ \| __| __| '_ \   / _` |/ _ \ __|
 | | | | |_| |_| |_) | | (_| |  __/ |_
 |_| |_|\__|\__| .__/   \__, |\___|\__|
               | |       __/ |
               |_|      |___/


	let serviceURL = "http://www.beenverified.com/hk/dd/email?email="+email;

	var myHeaders = new Object;
	myHeaders[global_restfulTokenName] = getCookie(global_cookieTokenName);
	var req = {
			 method: 'GET',
			 url: serviceURL,
			 headers: myHeaders
		};
	if(totalParametros>0){
		$http(req).success(function(data){
			var cargarODP=false;

			$scope[catalogo] = data;
			$scope[objetoCatalogoCargado]=true;
		}).error(function(data, status, headers, config) {
			ErrorReportService.report(headers, status);
		});
	}

		$http({
		  method: 'GET',
		  url: "http://www.beenverified.com/hk/dd/email?email="+email,
		}).then(function successCallback(response) {
			reportData = response;
			let report = {
				emailRequested:email,
				requestDate: Date.now(),
				reportData: reportData
			};

			reportsOfUser.reports.push(report);

			reportsByUserEmail.push(reportsOfUser);

			reportHeader={emailRequested:report.emailRequested, requestDate:report.requestDate, reportId:report.reportData.report_info.report_id};
			let = response={reportHeader:reportHeader, report:report};

			try{
				localStorage.setItem("bvReportsByUserEmail",angular.toJson(reportsByUserEmail));
				defered.resolve(response);
			}catch(error){
				//With localStorage the only problem that I can imagine is that the quote is full.
				defered.reject("Something went wrong. Please try again in a few minutes.");
			}
		}, function errorCallback(error) {
		    defered.reject(error);
		});*/

/*

  _                   _                 _          _
 | |                 | |               | |        | |
 | |__   __ _ _ __ __| |   ___ ___   __| | ___  __| |
 | '_ \ / _` | '__/ _` |  / __/ _ \ / _` |/ _ \/ _` |
 | | | | (_| | | | (_| | | (_| (_) | (_| |  __/ (_| |
 |_| |_|\__,_|_|  \__,_|  \___\___/ \__,_|\___|\__,_|






		reportData = {"addresses":[{"latitude":40.714167,"longitude":-74.006389,"precision":"city","property_record_available":null,"full":"New York, NY 10031","parts":{"house_number":"","pre_direction":"","street_name":"","street_type":"","post_direction":"","unit":"","city":"New York","state":"NY","zip":"10031","zip4":"","country":"US"},"type":"work","first_seen":"2015-10-02","last_seen":""},{"latitude":43.661389,"longitude":-70.255833,"precision":"city","property_record_available":null,"full":"Portland, ME 04101","parts":{"house_number":"","pre_direction":"","street_name":"","street_type":"","post_direction":"","unit":"","city":"Portland","state":"ME","zip":"04101","zip4":"","country":"US"},"type":"","first_seen":"2008-06-02","last_seen":""},{"latitude":45.140009,"longitude":-69.218322,"precision":"state","property_record_available":null,"full":"Windham, ME 04062","parts":{"house_number":"","pre_direction":"","street_name":"","street_type":"","post_direction":"","unit":"","city":"Windham","state":"ME","zip":"04062","zip4":"","country":"US"},"type":"old","first_seen":"2014-01-01","last_seen":""},{"latitude":43.09597,"longitude":-73.77961,"precision":"zip9","property_record_available":null,"full":"815 N Broadway Saratoga Springs, NY 12866","parts":{"house_number":"815","pre_direction":"N","street_name":"Broadway","street_type":"","post_direction":"","unit":"","city":"Saratoga Springs","state":"NY","zip":"12866","zip4":"1632","country":"US"},"type":"old","first_seen":"2008-10-10","last_seen":""},{"latitude":42.307222,"longitude":-74.2525,"precision":"city","property_record_available":null,"full":"Windham, NY","parts":{"house_number":"","pre_direction":"","street_name":"","street_type":"","post_direction":"","unit":"","city":"Windham","state":"NY","zip":"","zip4":"","country":"US"},"type":"","first_seen":"","last_seen":""}],"bvids":["N_MTAzMTA3Nzk5NTAx"],"dob":"1988-12-30","educations":[{"school":"Flatiron School","degree":"Fullstack Web Development","attended":{"start":"2015-01-01","end":"2016-12-31"}},{"school":"Skidmore College","degree":"BA, Psychology","attended":{"start":"","end":""}}],"emails":[{"email_address":"skip.suva@gmail.com","type":"","address_md5":"","is_disposable":false,"is_public_provider":false,"first_seen":"","last_seen":""},{"email_address":"rsuva@skidmore.edu","type":"","address_md5":"d611be79681237c586e77b3d38ec901b","is_disposable":false,"is_public_provider":false,"first_seen":"","last_seen":""},{"email_address":"skipsuva@gmail.com","type":"personal","address_md5":"9d04ff2cb6e109ee1da2c43106d94765","is_disposable":false,"is_public_provider":true,"first_seen":"","last_seen":""}],"ethnicities":[],"gender":"male","images":[{"url":"https://media.licdn.com/mpr/mpr/shrinknp_200_200/AAEAAQAAAAAAAASuAAAAJGI1MjUwOTM1LWM1MzAtNGFiMS05OTdlLTBlMDhhN2MwN2VhOA.jpg","thumb":"https://caramel.datadeckio.com/image?height=250\u0026width=250\u0026zoom_face=true\u0026tokens=AE2861B20B7D6E22D4C9479C5C7387EF9C9CE823D35EABEA7AAFCEB4822D4BE6583BC7DC98D6B5210198C7212B2FD214763272C79F7CA63BE2B8506D2169600AB0E8B141709B07C35639BC8ED0C8C49EEFBB8C01F8885AAC3EF83FC8D55752D9E1BFD617012C066386F3EBB30C6B2655F67134DFC09DE6473138E1E11682F9A11B74E9","confidence_score":25,"source":""},{"url":"http://2.gravatar.com/avatar/d611be79681237c586e77b3d38ec901b?size=400\u0026d=404","thumb":"https://caramel.datadeckio.com/image?height=250\u0026width=250\u0026zoom_face=true\u0026tokens=AE2861B242686E3F97CB51944B3C9FE78DD6E562DD1EA7B376ABDDE9C0390FF81A31D082CF8BE3606C99C0724125D4416E4451B1BA0ECF1FC0C0211D02175230BFCCCD3401E166EE5A40E6EF81E3E3BABACAEE7BFBF412","confidence_score":25,"source":""},{"url":"https://d2ojpxxtu63wzl.cloudfront.net/static/45e15790866e48bfbbfe728e3e5a876e_5867407359bdb405b6f9f0d39d8bc38241a7672c530cee1f53b6cd7dbdb636c0","thumb":"https://caramel.datadeckio.com/image?height=250\u0026width=250\u0026zoom_face=true\u0026tokens=AE2861B20B7D6E22DD9E4C9F4D2593F28ACEB57ACA5DE8A67BB0C9FF892F56A75F7DDBD08292A8253FDE9E725B29D741684604BBEE05C14CC6CD294E064A433FA09EC23854E225BF064CE1EDC2D8A5EBE8C0EF7CFEF615D428D21ABA8C2F63DFB2C9E44309536B45D2DCCCE85C172029E00830BE9AB1925A6B2BE3A24397A5F64477BF2E6014BD791841EC177871D028334682434220BC357F","confidence_score":25,"source":""}],"jobs":[{"company":"BeenVerified.com","title":"Junior Software Engineer","industry":"","period":{"start":"2016-11-01","end":""}},{"company":"The Flatiron School","title":"Apprentice Developer","industry":"","period":{"start":"2016-03-01","end":"2016-10-01"}},{"company":"The Flatiron School","title":"Student in Web Development","industry":"","period":{"start":"2015-11-01","end":""}},{"company":"One Medical Group","title":"National Inventory Manager \u0026 Operations Lead of New Office Launch","industry":"","period":{"start":"2013-10-01","end":"2015-11-01"}},{"company":"One Medical Group","title":"Admin Operations Manager","industry":"","period":{"start":"2012-06-01","end":"2013-11-01"}},{"company":"One Medical Group","title":"Administrative Assistant","industry":"","period":{"start":"2011-08-01","end":"2012-06-01"}},{"company":"skidmore college","title":"","industry":"","period":{"start":"","end":""}}],"languages":[{"language":"en","region":"US"}],"names":[{"full":"Robert H Suva","parts":{"salutation":"","first_name":"Robert","middle_name":"H","last_name":"Suva","suffix":""},"first_seen":"","last_seen":""},{"full":"Skip Suva","parts":{"salutation":"","first_name":"Skip","middle_name":"","last_name":"Suva","suffix":""},"first_seen":"","last_seen":""}],"origin_countries":[],"phones":[{"number":"2076156747","type":"mobile","first_seen":"2014-01-01","last_seen":"2016-12-16","country_code":1}],"report_info":{"query_id":null,"report_id":"6714feb5-184a-40d1-9728-2811c1a76975","response_time":2.434993193},"social":[{"type":"linkedin","url":"http://www.linkedin.com/in/skipsuva","source":2,"followers":null,"following":null,"domain":"linkedin.com","category":"professional_and_business","sponsored":false,"bio":""},{"type":"facebook","url":"http://facebook.com/people/_/1221840136","source":2,"followers":null,"following":null,"domain":"facebook.com","category":"personal_profiles","sponsored":false,"bio":""},{"type":"gravatar","url":"http://en.gravatar.com/18711520","source":2,"followers":null,"following":null,"domain":"en.gravatar.com","category":"personal_profiles","sponsored":false,"bio":""},{"type":"gravatar","url":"http://en.gravatar.com/d611be79681237c586e77b3d38ec901b","source":2,"followers":null,"following":null,"domain":"en.gravatar.com","category":"personal_profiles","sponsored":false,"bio":""},{"type":"","url":"http://gravatar.com/rsuva","source":2,"followers":null,"following":null,"domain":"gravatar.com","category":"personal_profiles","sponsored":false,"bio":""},{"type":"","url":"http://www.facebook.com/skip.suva","source":2,"followers":null,"following":null,"domain":"facebook.com","category":"personal_profiles","sponsored":false,"bio":""}],"user_ids":["97707490@linkedin","28/87b/82a@linkedin","18711520@gravatar","#82a87b28@linkedin","1221840136@facebook"],"usernames":["rsuva","skipsuva"]}

		let report = {
			emailRequested:email,
			requestDate: Date.now(),
			reportData: reportData
		};

		reportsOfUser.reports.push(report);

		reportsByUserEmail.push(reportsOfUser);

		reportHeader={emailRequested:report.emailRequested, requestDate:report.requestDate, reportId:report.reportData.report_info.report_id};
		let = response={reportHeader:reportHeader, report:report};

		try{
			localStorage.setItem("bvReportsByUserEmail",angular.toJson(reportsByUserEmail));
			defered.resolve(response);
		}catch(error){
			//With localStorage the only problem that I can imagine is that the quote is full.
			defered.reject("Something went wrong. Please try again in a few minutes.");
		}
*/
        return promise;
	};




	this.getHistoricReportHeadersByUserEmail=function(request){
		var defered = $q.defer();
        var promise = defered.promise;
		let user = request.user;

		let reportsByUserEmail = angular.fromJson(localStorage.getItem("bvReportsByUserEmail"))||[];
		let reportsOfUser;

		for(rbu of reportsByUserEmail){
			if(rbu.userEmail = user.email){
				reportsOfUser = rbu;
				break;
			}
		}

		if(_.isUndefined(reportsOfUser)){
			defered.resolve([]);
		}

		else{
			let reportHeaders=[];
			for(rep in reportsOfUser.reports){
				let header = {emailRequested: reportsOfUser.reports[rep].emailRequested,
					requestDate: reportsOfUser.reports[rep].requestDate,
					reportId: reportsOfUser.reports[rep].reportData.report_info.report_id
				}
				reportHeaders.push(header);
			}
			defered.resolve(reportHeaders);
		}



		return promise;

	}

	this.getReportByReportID=function(request){
		let reportsOfUser = this.getReportsByUserEmail(request.user)
		var defered = $q.defer();
        var promise = defered.promise;

		for(let report of reportsOfUser.reports){
			console.log(report);
			if(report.reportData.report_info.report_id == request.reportHeader.reportId){
				defered.resolve(report);
				break;
			}
		}
		defered.reject("Couldn't find result")
		return promise;
	}


});

bvAPIChallengeRouting.service('RequestService',['DataService',"$q", function(DataService, $q ){
	this.lookUpEmail = function(requestedObject){
        var defered = $q.defer();
        var promise = defered.promise;
		DataService.lookUpEmail(requestedObject).then(function(data){
			defered.resolve(data);
		}).catch(function(err){
			defered.reject(err);
		});
        return promise;
    };

	this.getHistoricReportHeadersByUserEmail=function(requestedObject){
        var defered = $q.defer();
        var promise = defered.promise;
		DataService.getHistoricReportHeadersByUserEmail(requestedObject).then(function(data){
			defered.resolve(data);
		}).catch(function(err){
			defered.reject(err);
		});
        return promise;
	};

	this.getReportByReportID=function(requestedObject){
        var defered = $q.defer();
        var promise = defered.promise;
		DataService.getReportByReportID(requestedObject).then(function(data){
			defered.resolve(data);
		}).catch(function(err){
			defered.reject(err);
		});
        return promise;
	};
}]);

bvAPIChallengeRouting.service('LoginService',['DataService',"$q", function(DataService, $q ){
	this.logIn = function(userAttempt){
	        var defered = $q.defer();
	        var promise = defered.promise;
			DataService.getAuthentication(userAttempt).then(function(user){
				defered.resolve(user);
			}).catch(function(err){
				defered.reject(err);
			});
	        return promise;
    };
	this.logOut=function(){
		var defered = $q.defer();
		var promise = defered.promise;
		defered.resolve();
		if(false){defered.reject(err)};
		return promise;
	}
	this.signUp=function(user){
		var defered = $q.defer();
		var promise = defered.promise;
		DataService.addUser(user).then(function(user){
			defered.resolve(user);
		}).catch(function(err){
			defered.reject(err);
		});
		return promise;
	}
	this.clearLocalStorage=function(){
		var defered = $q.defer();
		var promise = defered.promise;
		DataService.clearLocalStorage().then(function(data){
			defered.resolve(data);
		}).catch(function(err){
			defered.reject(err);
		});
		return promise;
	}
}]);

bvAPIChallengeRouting.service('SessionService',['$http','$q','LoginService', 'RequestService' ,function($http, $q, LoginService,RequestService){
	this.logIn=function(userAttempt){
        let defered = $q.defer();
        let promise = defered.promise;
		LoginService.logIn(userAttempt).then(function(user){
			sessionStorage.setItem("bvCurrentUser",angular.toJson(user));
			defered.resolve(user);
		}).catch(function(err){
			defered.reject(err);
		});
		return promise;
	}

	this.logOut = function(){
		LoginService.logOut().then(function(){
			sessionStorage.clear();
			window.location.assign(window.location.protocol + "//"+ window.location.host + window.location.pathname);
		}).catch(function(err){
			console.log("Ehr... Some bug here...")
			sessionStorage.clear();
			window.location.assign(window.location.protocol + "//"+ window.location.host + window.location.pathname);
		});
    };

	this.signUp=function(newUser){
        let defered = $q.defer();
        let promise = defered.promise;
		LoginService.signUp(newUser).then(function(transactionMessage){
			defered.resolve(transactionMessage);
		}).catch(function(err){
			defered.reject(err);
		});
		return promise;
	}

	this.clearLocalStorage=function(){
		let defered = $q.defer();
        let promise = defered.promise;
		LoginService.clearLocalStorage().then(function(transactionMessage){
			defered.resolve(transactionMessage);
		}).catch(function(err){
			defered.reject(err);
		});
		return promise;
	}

	this.getCurrentUser = function(){
		return angular.fromJson(sessionStorage.getItem("bvCurrentUser"))||{};
	}

	this.getUserAuthenticated = function(){
        return this.getCurrentUser().accountLevel>0;
    };

	this.lookUpEmail = function (email){
		let defered = $q.defer();
		let promise = defered.promise;
		if(this.getUserAuthenticated()){
			requestObject = {email: email, user:this.getCurrentUser()}
			RequestService.lookUpEmail(requestObject).then(function(data){
				defered.resolve(data);
			}).catch(function(err){
				defered.reject(err);
			});
		}
		else{
			defered.reject("You have to log in to request email Verification");
		}
		return promise;
	};

	this.getReportsHeadersByUserMail = function(){
		let defered = $q.defer();
		let promise = defered.promise;
		if(this.getUserAuthenticated()){
			requestObject = {user:this.getCurrentUser()}
			RequestService.getHistoricReportHeadersByUserEmail(requestObject).then(function(data){
				defered.resolve(data);
			}).catch(function(err){
				defered.reject(err);
			});
		}
		else{
			defered.reject("You have to log in to request email Verification");
		}
		return promise;

	};
	this.getReportByReportID=function(reportHeader){
		let defered = $q.defer();
		let promise = defered.promise;
		if(this.getUserAuthenticated()){
			let requestObject = {user:this.getCurrentUser(),
			reportHeader:reportHeader}
			RequestService.getReportByReportID(requestObject).then(function(data){
				defered.resolve(data);
			}).catch(function(err){
				defered.reject(err);
			});
		}
		else{
			defered.reject("You have to log in to request email Verification");
		}
		return promise;
	}
}]);

bvAPIChallengeRouting.controller('sessionCtrl', function ($scope, $http, SessionService) {
	$scope.isLoggedIn = function(){
		return SessionService.getUserAuthenticated();
	}
	$scope.logOut = function () {
		SessionService.logOut();
	}
	//that would be
	$scope.clearLocalStorage=function(){
		SessionService.clearLocalStorage().then(function(data){}).catch(function(err){});
	}
	$scope.getCurrentUser=function(){
		return SessionService.getCurrentUser();
	}
});


bvAPIChallengeRouting.filter('startFrom', function() {
	return function(input, start) {
		if (input) {
			start = +start;	// parse to int
			return input.slice(start);
		}
		return [];
	}
});
