const express = require('express');
const signupcontrollars = require('./signupcontroller');
const route = express.Router();

route.post('/signup', signupcontrollars.adduser);
route.get('/signupfind', signupcontrollars.getuser);
route.delete('/signupdelete/:_id', signupcontrollars.deleteuser);

module.exports = route;