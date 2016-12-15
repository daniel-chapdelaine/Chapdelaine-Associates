'use strict'

angular
	.module('Database', ['ngRoute'])
	.config( $routeProvider =>
		$routeProvider
			.when('/', {
				controller: 'Login-Register',
				templateUrl: 'partials/login-register.html'
			})
			.when('/home', {
				controller: 'Home',
				templateUrl: 'partials/home.html'
			})
			.when('/newJob', {
				controller: 'NewJob',
				templateUrl: 'partials/newJob.html'
			})
			.when('/findJob', {
				controller: 'FindJob',
				templateUrl: 'partials/findJob.html'
			})
			.when('/getData', {
				controller: 'GetData',
				templateUrl: 'partials/getData.html'
			})
	)
	.controller('Login-Register', function($scope, $http) {

    const legitPassword = (password) => {
      const pattern = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$")
      return pattern.test(password)
    }

		$scope.loginOrRegister = "login"

		$scope.enterSite = (password) => {
      const testPassword = legitPassword(password)
      if (testPassword) {
  			$http.post('/' , $scope.formData)
  			.success(function(data) {
              console.log("posted successfully");
         		})
         		.error(function(data) {
              console.error("error in posting");
          	})
      } else {
        alert("Password must be atleast 8 characters long including one uppercase letter, one lowercase letter, and one number!")
      }

		}

    $scope.register = () => {
      $scope.loginOrRegister = 'register'
    }

    $scope.login = () => {
      $scope.loginOrRegister = 'login'
    } 




	})
	.controller('Home', function($scope, $http) {
		$http.get('/home')
    .success( data => {
      $scope.recentJobs = data
    })
    .error( () => {
      console.log('error')
    })
    $scope.title = "Home"
	})
	.controller('NewJob', function($scope) {
		$scope.title = "NewJob"
	})
	.controller('FindJob', function($scope) {
		$scope.title = "FindJob"
	})
	.controller('GetData', function($scope) {
		$scope.title = "GetData"
	})
