'use strict'

app.controller('JobMain', function($scope, $location, JobFactory, $route, $mdDialog) {
  let JMScope = this

/////////////FOR EDITING A SINGLE COLUMN///////////////
  JMScope.editOptions = {}
  let editCanceled = {}
  //edit data submited by user    
  JMScope.editDatabase = (table, id, key, value) => {
    removeEditOptions() 
    //make sure user wants to make these changes
    let obj = JobFactory.matchDatabaseKeys({[key]: value})
    JobFactory.editColumn({table, id, obj})
      .then( ({data: {msg}}) => JobFactory.toastSuccess(msg))
      .catch( ({data: {msg}}) => JobFactory.toastReject(msg))
  }

  //set edit options on obj for easy comparison and edit canceled obj so data isn't lost 
  JMScope.setEditOptions = (editType, tableName, tableIndex, index, key, value) => {
    JMScope.editOptions.editType = editType
    JMScope.editOptions.tableName = tableName
    JMScope.editOptions.tableIndex = tableIndex
    JMScope.editOptions.inputIndex = index
    editCanceled.key = key
    editCanceled.value = value
  }

  //focuses specific editOne
  JMScope.changeFocus = (tableName, tableIndex, index) => {
    if (index == $scope.inputIndex && tableIndex == $scope.tIndex && tableName == $scope.table) {
      return true
    }
  }
  
  //if user cancels edit, reset ng-model
  JMScope.revertEditChanges = obj => {
    removeEditOptions()    
    obj[editCanceled.key] = editCanceled.value
  }
  //lodash for deep equals
  JMScope.compareObj = currDiv => _.isEqual(JMScope.editOptions, currDiv)
  //set editOptions back to null
  const removeEditOptions = () => {
    for(let key in JMScope.editOptions) {
        JMScope.editOptions[key] = null
    } 
  }


/////////////ADD OR REMOVE FROM JOB///////////////

  JMScope.removeFromJob = (table, objToRemove) => {
    let dataObj = {
      table,
      objToRemove
    }
    dataObj.objToRemove.job_id = $scope.jobId
    JobFactory.removeFromJob(dataObj)
      .then( ({data: {msg}}) => {
        JobFactory.toastSuccess(msg)
        $route.reload()
      })
      .catch( err => JobFactory.toastReject())
  }

})