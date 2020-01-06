const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
Usuario = mongoose.model("Usuario")
require('../models/Comentario')
const Comentario = mongoose.model('Comentario')
require('../models/Postagem')
const Postagem = mongoose.model("Postagem")
const bcrypt = require('bcryptjs')
const passport = require('passport')


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

router.post('/login', (req, res, next) => {

    passport.authenticate("local", {
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req, res, next)

})

router.get('/logout', (req, res) => {

    req.logout();
    req.flash('success_msg', "Deslogado com sucesso!")
    res.redirect("/")

})

router.post('/postagens/comentar',  (req, res) => {

    let erros = valida(req.body)

    if (erros.length > 0) {
        erros.forEach(element => {
            req.flash("error_msg", element.texto)
        });

        res.redirect("/postagens/" + req.body.postagem)
    } else {
        const novoComentario = {
            conteudo: req.body.conteudo,
            postagem: req.body.post,
            usuario: req.body.usuario
        }

        Postagem.findById(req.body.post).then((postagem) => {

        new Comentario(novoComentario).save().then(() => {
            req.flash("success_msg", "Comentado com sucesso!")
            res.redirect("/postagem/" + postagem.slug)
        }).catch((err) => {
            req.flash("error_msg", "Erro ao salvar comentario, tente novamente.")
            res.redirect("/postagem/" + postagem.slug)
        })

    }).catch((err) => {
        req.flash("error_msg", "Erro ao achar a postagem")
        res.redirect("/404")
    })

    }

})

router.post('/postagens/comentar/deletar',  (req, res) => {

    Comentario.deleteOne({ _id: req.body.id }).then(() => {

        Postagem.findById({_id: req.body.postagem}).then((postagem) => {
            req.flash("success_msg", "Comentario Deletado com Sucesso")
            res.redirect("/postagem/" + postagem.slug)

        }).catch((err) => {

            req.flash("error_msg", "Erro ao achar a postagem")
            res.redirect("/404")

        })
        



    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar, tente novamente")
        res.redirect('/')
    })

})

module.exports = router