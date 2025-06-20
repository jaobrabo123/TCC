import bcrypt from 'bcryptjs';
import pool from './db.js';

export async function popularTabelaUsuarios(nome, email, senha, genero, datanasc) {
    
    //criptografa a senha
    const senhaCripitografada = await bcrypt.hash(senha, 10);

    await pool.query(
        `INSERT INTO cadastro_usuarios (nome, email, senha, genero, datanasc) VALUES ($1, $2, $3, $4, $5)`,
        [nome, email, senhaCripitografada, genero, datanasc]
    );

}

export async function criarTabelaUsuariosPerfil(idusuario) {

    const existente = await pool.query(`SELECT * FROM usuarios_perfil WHERE id_usuario = $1`, [idusuario]);

    if (existente.rows.length === 0) {
        await pool.query(`INSERT INTO usuarios_perfil (id_usuario) VALUES ($1)`, [idusuario]);
    }

}


export async function popularTabelaTags(nome_tag, id_usuario) {

    await pool.query(
        `INSERT INTO tags_usuario (nome_tag, id_usuario) VALUES ($1, $2)`,
        [nome_tag, id_usuario]
    )

}

export async function popularTabelaExperiencias(titulo_exp, descricao_exp, img_exp, id_usuario) {

    await pool.query(
        `INSERT INTO experiencia_usuario (titulo_exp, descricao_exp, img_exp, id_usuario) VALUES ($1, $2, $3, $4)`,
        [titulo_exp, descricao_exp, img_exp, id_usuario]
    )

}

export async function editarPerfil(atributo, valor, id_usuario){

    await pool.query(
        `UPDATE usuarios_perfil SET ${atributo} = $1 WHERE id_usuario = $2`,
        [valor, id_usuario]
    )

}