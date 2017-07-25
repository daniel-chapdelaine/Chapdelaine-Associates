'use strict'

const { Router } = require('express')
const config = require('../../database/knexfile.js').development
const knex = require('knex')(config)
const router = Router()
const locateOrCreate = require('../locateOrCreate')
const validateRep = require('../validation/validRepresentative')
const validationHelper = require('../validation/validationHelper')

router.get('/api/getCustomersForSearch', ({body}, res) => {
  knex('Customers')
    .select(
      knex.raw(`first_name + ' ' + middle_name + ' ' + last_name AS 'value'`),
      'customer_id AS id'
    )
    .then( data => res.send(data))
    .catch( err => console.log(err))
})

router.post('/api/validateCustomer', ({body: {dbObj, customer_id}}, res) => {
  const errors = validateRep.validate(dbObj)
  if (errors[0]) {
    let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
    res.status(400).send({msg: `${msg}`})
  } else {
    validationHelper.checkNameExists(dbObj, customer_id).then( nameExists => {
      nameExists ? res.status(400).send({msg: `${nameExists}`}) : res.send({msg: 'Valid Customer!'})
    })
  }
})

router.post('/api/getFullCustomerById', ({body: {customer_id}}, res) => {
  console.log('customer_id', customer_id)
  knex('Customers')
  .select(
    'Customers.customer_id',
    'Customers.first_name',
    'Customers.middle_name',
    'Customers.last_name',
    'Customers.email',
    'Customers.business_phone',
    'Customers.mobile_phone',
    'Customers.home_phone',
    'Customers.fax_number',
    'Customers.notes',
    'Companies.company_name',
    'Company_Address.address as company_address',
    'Addresses.address',
    'Cities.city',
    'States.state',
    'Zip_Codes.zip_code',
    'Counties.county'
  )
  .leftJoin('Companies', 'Customers.company_id', 'Companies.company_id')
  .leftJoin('Addresses as Company_address', 'Companies.address_id', 'Company_address.address_id')
  .leftJoin('Addresses', 'Customers.address_id', 'Addresses.address_id')      
  .leftJoin('Cities', 'Customers.city_id', 'Cities.city_id') 
  .leftJoin('States', 'Customers.state_id', 'States.state_id')      
  .leftJoin('Zip_Codes', 'Customers.zip_id', 'Zip_Codes.zip_id')      
  .leftJoin('Counties', 'Customers.county_id', 'Counties.county_id')    
  .where('Customers.customer_id', customer_id)
  .then(data => res.send(data[0]))
  .catch(err => console.log('err', err))
})

// router.post('/api/removeRepFromJob', ({body: {ids}}, res) => {
//   knex('Client_Specs_Per_Job')
//   .update('representative_id', null) //-----------------update to null so we keep client associated with job
//   .where(ids)
//   .then( data => {res.send({msg: 'Removed from Job!'})})
//   .catch( err => console.log(err))
// })

// router.post('/api/addNewRep', ({body: {dbObj, ids}}, res) => {
//   const job_id = ids.job_id
//   const client_id = ids.client_id
//   const errors = validateRep.validate(dbObj)
//   if (errors[0]) {  //------------------------------------checks each data type
//     let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
//     res.status(400).send({msg: `${msg}`})
//   } else {
//     validationHelper.checkNameExists(dbObj, 'Representatives').then( nameExists => {//true/false
//       if (nameExists) { //-----------------------------checks if name already exists in DB
//         res.status(400).send({msg: `${nameExists}`})
//       } else {
//         getConnectTableIds(dbObj).then( data => {
//           let polishedObj = data.obj
//           knex('Representatives')     //----------make rep
//           .returning('representative_id')
//           .insert(polishedObj)
//           .then( data => {
//             if (job_id) {
//               let representative_id = data[0]
//               knex('Client_Specs_Per_Job')  //-----set ids on connecting table
//               .update({ representative_id })   //this update means that there can only be one rep per client per job  
//               .where({client_id: client_id})
//               .andWhere({job_id: job_id})
//               .then( data => res.send({msg: 'Successfully created and added to Job!'}))
//               .catch( err => console.log(err))
//             } else {
//               res.send({msg: 'Successfully created Representative!'})
//             }
//           }).catch( err => console.log(err))
//         })
//       } 
//     })   
//   }
// })

// router.post('/api/addExistingRep', ({body: {dbObj, ids}}, res) => {
//   const job_id = {job_id: ids.job_id}
//   const client_id = {client_id: ids.client_id}
//   const representative_id = {representative_id: ids.representative_id}
//   const errors = validateRep.validate(dbObj)
//   if (errors[0]) {  //------------------------------------checks each data type
//     let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
//     res.status(400).send({msg: `${msg}`})
//   } else {
//     validationHelper.checkNameExistsOnEdit(representative_id, dbObj, 'Representatives')
//     .then( nameExists => {
//       if (nameExists) { //-----------------------------checks if name already exists in DB
//         res.status(400).send({msg: `${nameExists}`})
//       } else {
//         getConnectTableIds(dbObj).then( data => {
//           let polishedObj = data.obj
//           knex('Representatives') //---------------------find rep
//           .update(polishedObj)
//           .where(representative_id)
//           .then( data => {
//             knex('Client_Specs_Per_Job')  //-----set ids on connecting table
//             .update(representative_id)   //this update means that there can only be one rep per client per job  
//             .where(client_id)
//             .andWhere(job_id)
//             .then( data => res.send({msg: 'Successfully added to Job!'}))
//             .catch( err => console.log(err))
//           }).catch( err => console.log(err))     
//         })
//       }
//     })
//   }
// })

// router.post('/api/updateRep', ({body: {dbObj, ids}}, res) => {
//   const representative_id = {representative_id: ids.representative_id}
//   const errors = validateRep.validate(dbObj)
//   if (errors[0]) {  //------------------------------------checks each data type
//     let msg = errors.reduce( (string, err) => string.concat(`${err.message}\n`), '')
//     res.status(400).send({msg: `${msg}`})
//   } else {
//     validationHelper.checkNameExistsOnEdit(representative_id, dbObj, 'Representatives')
//     .then( nameExists => {
//       if (nameExists) { //-----------------------------checks if name already exists in DB
//         res.status(400).send({msg: `${nameExists}`})
//       } else {
//         getConnectTableIds(dbObj).then( data => {
//           let polishedObj = data.obj
//           knex('Representatives') //---------------------find client
//           .update(polishedObj)
//           .where(representative_id)
//           .then( () => res.send({msg: 'Successfully updated Job!'}))
//           .catch( err => console.log(err))        
//         })
//       }
//     })
//   }
// })

// const getConnectTableIds = obj => {
//   let dbPackage = {}
//   return new Promise( (resolve, reject) => {
//     Promise.all([  //-----------------get existing state, city, address, county, zip_code
//       locateOrCreate.state(obj.state).then( data => {
//         delete obj.state
//         obj.state_id = data
//       }),
//       locateOrCreate.city(obj.city).then( data => { 
//         delete obj.city
//         obj.city_id = data
//       }),
//       locateOrCreate.address(obj.address).then( data => { 
//         delete obj.address
//         obj.address_id = data
//       }),
//       locateOrCreate.county(obj.county).then( data => { 
//         delete obj.county
//         obj.county_id = data
//       }),
//       locateOrCreate.zip_code(obj.zip_code).then( data => { 
//         delete obj.zip_code
//         obj.zip_id = data
//       }),
//       locateOrCreate.company_name(obj.company_name, obj.company_address).then( data => { 
//         delete obj.company_name
//         delete obj.company_address
//         obj.company_id = data
//       })
//     ])
//     .then( () => {
//       dbPackage.obj = obj
//       resolve(dbPackage)
//     })
//   })
// }

module.exports = router