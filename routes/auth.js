const express = require("express");
const { listen } = require("express/lib/application");
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.post('/add', authController.add);

router.get('/reports', authController.reporting);
module.exports = router; 