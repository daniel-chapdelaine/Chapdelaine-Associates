'use strict'

app.factory('JobFactory', function($location, $http) {

  const factory = {}

    factory.goToJobPage = jobNumber => $location.path(`/jobs/:${jobNumber}`) 

    factory.getJobFromDatabase = job_number => $http.post('/api/getJobInfo', {job_number})  

    factory.getActiveJobs = () => $http.get('/api/activeJobs')

    factory.getPendingJobs = () => $http.get('/api/pendingJobs')

    factory.editColumn = columnInfo => $http.post('/api/editColumn', columnInfo)

    factory.getMaxJob = () => $http.get('/api/getMaxJob')

    factory.getMinJob = () => $http.get('/api/getMinJob')

    factory.createNewJob = job_number => $http.post('/api/createNewJob', job_number)

  return factory
})