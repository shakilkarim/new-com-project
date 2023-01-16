const express = require('express');
const { register, login, profileUpdate } = require('../controllers/auth');
const { requireSignin, isAdmin } = require('../middlewares/auth');

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/auth-check', requireSignin, (req, res) => {
    res.json({ ok: true });
});
router.get('/admin-check', requireSignin, isAdmin, (req, res) => {
    res.json({ ok: true });
});
router.put('/profileUpdate', requireSignin, profileUpdate);

module.exports = router;
