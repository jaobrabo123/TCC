//Imports
const express = require('express');
const { authenticateToken } = require('../middlewares/auth.js');

//Router
const router = express.Router();

router.get('/get-tipo', authenticateToken, (req, res) => {
  res.status(200).json({
    tipo: req.user.tipo,
  });
});

module.exports = router;