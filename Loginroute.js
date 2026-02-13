const express = require('express');
const Logincontrollars = require('./Logincontroller');
const route = express.Router();

// Authentication routes
route.post('/login', Logincontrollars.loginuser);
route.post('/logout', Logincontrollars.logoutuser);
route.get('/verify-token', Logincontrollars.verifyToken);

// Admin routes (protected)
route.get('/loginfind', Logincontrollars.getalllogins);
route.delete('/logindelete/:_id', Logincontrollars.deletelogin);

module.exports = route;