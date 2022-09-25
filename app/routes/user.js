const { Router } = require('express');
const verifyToken = require('../../middlewares/authorization');
const {
  signin, signup, getinfo, updateprofile,
} = require('../controllers/auth.controller');

const router = Router();

router.post('/register', signup);
router.post('/login', signin);
router.get('/get_user', verifyToken, getinfo);
router.post('/update-profile', verifyToken, updateprofile);

module.exports = router;
