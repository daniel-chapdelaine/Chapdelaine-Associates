'use strict'

app.controller('Nav', function($scope, JobFactory, $mdDialog) {
  let NAV = this
  
  NAV.submit = jobNumber => {
    JobFactory.goToJobPage(jobNumber)
    NAV.jobNumber = ''
  }

  NAV.newJob = () =>{
    let locals = {
      job: null
    }
    $mdDialog.show({
      locals,
      fullscreen: true,
      controller: 'JobForm',
      templateUrl: '/partials/jobForm.html',
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      multiple: true
    })
    .then().catch( err => console.log('err', err))
  }
})