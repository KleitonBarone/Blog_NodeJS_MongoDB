const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
Usuario = mongoose.model("Usuario")
const bcrypt = require('bcryptjs')


//valida se os campos estao vazios
function valida(body) {
    let erros = []
    for (campo in body) {

        if (!body[campo] || typeof body[campo] == undefined || body[campo] == null) {
            erros.push({ texto: campo + " inválido" })
        }

    }
    return erros
}


router.get('/registro', (req, res) => {
    res.render("usuario/registro")
})

router.post('/registro', (req, res) => {

    //valida se os campos estao vazios
    let erros = valida(req.body)

    //validação adicionais
    if(req.body.senha.length < 4) {
        erros.push({texto: "Senha muito curta"})
    }

    if(req.body.senha != req.body.senha2) {
        erros.push({texto: "As senhas são diferentes, digite novamente"})
    }

    //verifica se tem algum erro
    if(erros.length > 0){
        res.render("usuario/registro", {erros: erros})
    } else {
        //caso nao tiver salva o usuario

        //verifica se esse email ja existe
        
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario) {

                req.flash("error_msg", "Esse email já foi cadastrado")
                res.redirect("/usuarios/registro")

                
            } else {
                //caso nao, salva o usuario

                 const novoUsuario = new Usuario ({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })
                
                    bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
                        if(err) {
                            req.flash("error_msg", "Ocorreu um erro Interno")
                            res.redirect("/usuarios/registro")
                        } else {
                            
                            novoUsuario.senha = hash
                            
                            novoUsuario.save().then(() => {
                                req.flash("success_msg", "Usuario criado com sucesso!")
                                res.redirect('/')
                            }).catch((err) => {
                                req.flash("error_msg", "Erro ao salvar usuario, tente novamente")
                                console.log("Erro ao Inserir Usuario" + err)
                                res.redirect('/usuarios/registro')
                            })

                        }
                    })
                })

            }
        }).catch((err) => {
            req.flash("error_msg", "Ocorreu um erro interno")
            res.redirect("/usuarios/registro")
        })
    }

})

router.get('/login', (req, res) => {
    res.render("usuario/login")
})




module.exports = router