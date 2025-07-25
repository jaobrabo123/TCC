//Imports
const express = require('express');
const pool = require('../config/db.js');
const { popularTabelaTags, removerTag } = require('../services/tagServices.js');
const { authenticateToken, apenasAdmins, apenasCandidatos } = require('../middlewares/auth.js');
const {ErroDeValidacao} = require('../utils/erroClasses.js')

//Router
const router = express.Router();

//Rota pra adicionar tag ao usuário
router.post('/tags', authenticateToken, async (req, res) => {
  try {
    const { nome } = req.body;
    const id = req.user.id;

    await popularTabelaTags(nome, id);
    res.status(201).json({ message: 'Tag cadastrada com sucesso!' });
  } catch (error) {
    if (error instanceof ErroDeValidacao) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro ao cadastrar tag: ' + error.message });
  }
});

//Rota para pegar  as tags
router.get('/tags/info', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM tags');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Erro no GET /tags:', error);
    res.status(500).json({error: 'Erro ao buscar tags: ' + error.message});
  }
});

router.get('/tags/all', authenticateToken, apenasAdmins, async (req,res)=>{
  try{
    const tags = await pool.query(`select t.id, t.nome, c.email as email_candidato, t.data_criacao from tags t join candidatos c on t.candidato = c.id`)
    res.status(200).json(tags.rows)
  }
  catch(erro){
    res.status(500).json({ error: `Erro ao buscar tags: ${erro?.message||'erro desconhecido'}` });
  }
})

router.delete('/tags/:tg', authenticateToken, apenasCandidatos, async (req, res) =>{
  try{
    const { tg } = req.params;
    const id = req.user.id;
    const nivel = req.user.nivel;

    await removerTag(tg, id, nivel);

    res.status(200).json({ message: "Tag removida com sucesso." });
  }
  catch{
    if (erro instanceof ErroDeAutorizacao) {
      return res.status(403).json({ error: erro.message });
    }else
    if (erro instanceof ErroDeValidacao){
      return res.status(400).json({ error: erro.message })
    }
    res.status(500).json({ error: "Erro ao remover tag: " + erro.message })
  }
})

module.exports = router