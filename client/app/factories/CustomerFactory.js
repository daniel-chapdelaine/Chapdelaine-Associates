'use strict'

app.factory('CustomerFactory', function($http, SearchFactory, FormFactory) {

  const factory = {}

  const getCustomersForSearch = () => $http.get('/api/getCustomersForSearch')

  factory.searchForCustomers = () => {
    return new Promise ((resolve, reject) => {
      getCustomersForSearch().then( ({data}) => {
        let names = data
        SearchFactory.addBySearch(names).then( customer_id => {
          customer_id ? resolve(customer_id) : resolve(null)
        })
      }).catch( err => reject({msg:'Nothing Saved'}))
    })
  }

  factory.addCustomer = () => FormFactory.updateForm('Customers' , null, {customer_id: null}, 'Add New')

  factory.editCustomer = (customer, id) => FormFactory.updateForm('Customers', customer, {customer_id: id}, 'Update')

  factory.getFullCustomerById = customer_id => $http.post('/api/getFullCustomerById', customer_id)

  return factory
})