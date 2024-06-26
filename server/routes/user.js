const express = require('express')
const { userRegister, userLogin, verifyCookie, logoutUser,
    makeChanges, getUserDetails } = require('../controllers/userController.js');
const router = express.Router();

//GET Routes : 
router.post('/checkCookie', verifyCookie);
router.get('/logout', logoutUser);

//POST Routes : 
router.post('/registerUser', userRegister);
router.post('/login', userLogin);
router.post('/makeChanges', makeChanges)

//GET id Routes : 
router.get('/:id', getUserDetails);

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = router