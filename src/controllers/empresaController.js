
const EmpresaModel = require('../models/empresaModel.js');
const EmpresaService = require('../services/empresaService.js')
const Erros = require('../utils/erroClasses.js')

class EmpresaController{

    static async cadastrar(req, res){
        try {
            const { cnpj, nome_fant, telefone, email, senha, razao_soci, cep, complemento, numero } = req.body;

            if (!cnpj || !nome_fant || !telefone || !email || !senha || !razao_soci || !cep || !numero ) {
                return res.status(400).json({ error: "Informações faltando para o cadastro!" });
            }

            await EmpresaService.popularTabelaEmpresas(
                cnpj,
                nome_fant,
                telefone,
                email,
                senha,
                razao_soci,
                cep,
                complemento,
                numero
            );

            res.status(201).json({ message: "Empresa cadastrada com sucesso!" });
        } catch (erro) {
            if (erro instanceof Erros.ErroDeValidacao) {
                return res.status(400).json({ error: erro.message });
            }
            if(erro instanceof Erros.ErroDeConflito) {
                return res.status(409).json({ error: erro.message });
            }
            return res.status(500).json({ error: "Erro ao cadastrar empresa: " + erro.message });
        }
    }

    static async listarTodas(req, res){
        try {
            const empresas = await EmpresaModel.buscarTodasEmpresas();

            res.status(200).json(empresas);
        } catch (erro) {
            res.status(500).json({ error: `Erro ao buscar empresas: ${erro?.message || "erro desconhecido"}` });
        }
    }

    static async remover(req, res){
        try {
            const { em } = req.params;
            const { id, nivel } = req.user;

            await EmpresaService.removerEmpresa(em, id, nivel);

            res.status(200).json({ message: "Empresa removida com sucesso" });
        } catch (erro) {
            if (erro instanceof Erros.ErroDeAutorizacao) {
                return res.status(403).json({ error: erro.message });
            }
            if (erro instanceof Erros.ErroDeValidacao){
                return res.status(400).json({ error: erro.message });
            }
            if (erro instanceof Erros.ErroDeNaoEncontrado){
                return res.status(404).json({ error: erro.message });
            }
            res.status(500).json({ error: erro.message });
        }
    }

}

module.exports = EmpresaController;