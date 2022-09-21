const { Router } = require('express');
const verifyToken = require('../../middlewares/authorization');
const { signin, signup, getinfo } = require('../controllers/auth.controller');

const router = Router();

router.post('/register', signup);
router.post('/login', signin);
router.get('/get_user', verifyToken, getinfo);

module.exports = router;
