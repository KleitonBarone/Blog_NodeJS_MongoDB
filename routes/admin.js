const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('Categoria')
require('../models/Postagem')
const Postagem =  mongoose.model('Postagem')

router.get('/', (req,res)=> {
    res.render("admin/index")
})



router.get('/categorias', (req,res)=> {
    Categoria.find().sort({date: 'desc'}).then((categorias)=>{
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) =>{
        req.flash("error_msg", "houve um erro ao listar as categorias")
        res.render("admin/categorias")
    })
    
})

router.get('/categorias/add', (req,res)=> {
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', (req,res)=> {
    
    let erros = []
    
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    } else if(req.body.nome.length < 2) {
        erros.push({texto: "Nome da Categoria é Muito Pequeno"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }
    

    if(erros.length > 0) {
        res.render('admin/addcategorias', {erros: erros})
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(()=>{
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect('/admin/categorias' )
        }).catch((err)=>{
            req.flash("error_msg", "Erro ao salvar categoria, tente novamente")
            console.log("Erro ao Inserir Categoria" + err)
            res.redirect('/admin/')
        })
        

    }
    
    
})

router.get('/categorias/edit/:id', (req,res)=> {
    Categoria.findOne({_id: req.params.id}).then((categoria)=>{
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err)=>{
        req.flash("error_msg", "Essa categoria nao existe")
        res.redirect('/admin/categorias')
    })
    
})

router.post('/categorias/edit', (req,res)=> {

    let erros = []
    
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    } else if(req.body.nome.length < 2) {
        erros.push({texto: "Nome da Categoria é Muito Pequeno"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"})
    }
    

    if(erros.length > 0) {
            erros.forEach(element => {
                req.flash("error_msg", element.texto)
            });
            
            res.redirect("/admin/categorias/edit/" + req.body.id)
        
    } else {
        
        Categoria.findByIdAndUpdate({_id: req.body.id}, {
            nome: req.body.nome,
            slug: req.body.slug
        }).then(()=>{
            req.flash("success_msg", "Categoria modificada com successo")
            res.redirect('/admin/categorias')
        }).catch((err)=>{
            req.flash("error_msg", "Não foi possivel modificar a Categoria, tente novamente")
            res.redirect('/admin/categorias')
        })


    }

   
    
})

router.post('/categorias/deletar', (req,res)=> {
    Categoria.deleteOne({_id: req.body.id}).then(()=>{
        req.flash("success_msg", "Categoria Deletada com Sucesso")
        res.redirect("/admin/categorias")
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao deletar, tente novamente")
        res.redirect('/admin/categorias')
    })
    
})

router.get('/postagens', (req,res)=> {
    res.render("admin/postagens")
})

router.get('/postagens/add', (req,res) => {
    Categoria.find().then((categorias) =>{
        res.render("admin/addpostagens", {categorias: categorias})
    }).catch((err)=> {
        req.flash("error_msg", "Houve um erro ao Carregar o Formulario.")
        req.redirect("/admin/postagens")
    })
    
})

router.post('/postagens/nova', (req,res) => {
    
    let erros = [];

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria inexistente, selecione uma valida ou registre uma nova"})
    }

    if(erros.length > 0){
        res.render('admin/addpostagens', {erros: erros})
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }


        new Postagem(novaPostagem).save().then(()=> {
            req.flash("success_msg", "Postagem criada com sucesso!")
            res.redirect('/admin/postagens')
        }).catch((err)=>{
            req.flash("error_msg", "Erro ao salvar postagem, tente novamente.")
            res.redirect('/admin/postagens')
        })
    }

})

module.exports = router