//Imports
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

//Dotenv
dotenv.config();

// Chave secreta para o JWT
const SECRET_KEY = process.env.JWT_SECRET;

// Autenticação JWT
function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err && err.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expirado' });
    }

    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
}

function apenasEmpresa(req,res,next) {
  if(req.user?.tipo==='empresa') return next()
  return res.status(403).json({ error: 'Acesso apenas para empresas' });
}

function apenasCandidatos(req,res,next) {
  if(req.user?.tipo==='candidato'||req.user?.tipo==='admin') return next()
  return res.status(403).json({ error: 'Acesso apenas para candidatos' });
}

module.exports = {
  authenticateToken,
  apenasEmpresa,
  apenasCandidatos
}