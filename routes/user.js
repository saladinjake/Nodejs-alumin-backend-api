const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/key')
const requireLogin = require('../middleware/requireLogin')
const Roles = require("../models/roles");
const rolesChecker = require('../middleware/roleschecker')

const userController = require("../controllers/userController")

// GET /api/users
router.get('/', rolesChecker([Roles.admin,Roles.siteAdmin]), userController.list);

// GET /api/users/:id
router.get('/:id', rolesChecker([Roles.admin,Roles.siteAdmin]), userController.find);

// DELETE /api/users/:id
router.delete('/:id', rolesChecker([Roles.admin,Roles.siteAdmin]), userController.destroy);

// PUT /api/users
router.put('/users', rolesChecker([Roles.admin,Roles.siteAdmin]), userController.updateUser);

// PUT /api/users/password
router.put('/password', rolesChecker([Roles.admin,Roles.siteAdmin]), userController.updatePassword);

// PUT /api/users/profile
router.put('/profile', rolesChecker(), userController.updateProfile);

// PUT /api/users/profile/password
router.put('/profile/password', rolesChecker(), userController.updateProfilePassword);

module.exports = router;