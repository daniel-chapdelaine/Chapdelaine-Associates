'use strict'

app.controller('AddNew', function($scope, $mdDialog, table, job_number, clientArray, JobFactory, $route) {
  let NEW = this
  NEW.title = table

  if (clientArray) {
    NEW.ClientNames = clientArray
  }


  NEW.Display = {
    Clients: {
      'First Name': '', 
      'Middle Name': '', 
      'Last Name': '', 
      'Email': '', 
      'Business Phone': '', 
      'Mobile Phone': '', 
      'Home Phone': '', 
      'Fax Number': '', 
      'Address': '', 
      'City': '', 
      'State': '', 
      'Zip Code': '', 
      'County': '', 
      'Notes': '', 
    }, 
    Representatives: {
      'First Name': '', 
      'Middle Name': '', 
      'Last Name': '', 
      'Email': '', 
      'Business Phone': '', 
      'Mobile Phone': '', 
      'Home Phone': '', 
      'Fax Number': '', 
      'Address': '', 
      'City': '', 
      'State': '', 
      'Zip Code': '', 
      'County': '', 
      'Notes': '', 
    }, 
    Properties: {
      'Address': '',
      'City': '',
      'State': '',
      'Zip Code': '',
      'County': '',
      'Map': '',
      'Parcel Number': '',
      'Plat Book': '',
      'Plat Page': '',
      'Deed Book': '',
      'Deed Page': '',
      'Sub Division': '',
      'Notes': ''
    }
  }

  NEW.send = ()  => {
    let objToAdd = JobFactory.matchDatabaseKeys(_.cloneDeep(NEW.Display[`${NEW.title}`]))
    let dataObj = {
      table,
      objToAdd,
      job_number
    }

    if(NEW.clientId) {
      dataObj.clientId = NEW.clientId
    }
    JobFactory.addNewToJob(dataObj)
      .then( ({data}) => {
        $mdDialog.cancel()
        $route.reload()
      })
      .catch( ({data}) => console.log(data))
  }

  NEW.reject = () => {
    $mdDialog.cancel()
  }


})
