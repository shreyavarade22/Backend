const express = require('express')

const usercontrollars = require('./controllar')
// const {photoUpload} = require('./fileUpload')
const route = express.Router()

route.post('/register', usercontrollars.adduser)
route.get('/findall',usercontrollars.getuser)
route.delete('/deleteuser/:_id',usercontrollars.deleteuser)
route.put('/updateuser/:_id',usercontrollars.updateuser)

module.exports = route