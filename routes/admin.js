const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('Categoria')
require('../models/Postagem')
const Postagem = mongoose.model('Postagem')

router.get('/', (req, res) => {
    res.render("admin/index")
})

function valida(body) {
    let erros = []
    for (campo in body) {

        if (!body[campo] || typeof body[campo] == undefined || body[campo] == null) {
            erros.push({ texto: campo + " inválido" })
        }

    }
    return erros
}

router.get('/categorias', (req, res) => {
    Categoria.find().sort({ date: 'desc' }).then((categorias) => {
        res.render("admin/categorias", { categorias: categorias })
    }).catch((err) => {
        req.flash("error_msg", "houve um erro ao listar as categorias")
        res.render("admin/categorias")
    })

})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', (req, res) => {

    let erros = valida(req.body)

    if (erros.length > 0) {
        res.render('admin/addcategorias', { erros: erros })
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash("error_msg", "Erro ao salvar categoria, tente novamente")
            console.log("Erro ao Inserir Categoria" + err)
            res.redirect('/admin/categorias')
        })


    }


})

router.get('/categorias/edit/:id', (req, res) => {
    Categoria.findOne({ _id: req.params.id }).then((categoria) => {
        res.render("admin/editcategorias", { categoria: categoria })
    }).catch((err) => {
        req.flash("error_msg", "Essa categoria nao existe")
        res.redirect('/admin/categorias')
    })

})

router.post('/categorias/edit', (req, res) => {

    let erros = valida(req.body)

    if (erros.length > 0) {
        erros.forEach(element => {
            req.flash("error_msg", element.texto)
        });

        res.redirect("/admin/categorias/edit/" + req.body.id)

    } else {

        Categoria.findByIdAndUpdate({ _id: req.body.id }, {
            nome: req.body.nome,
            slug: req.body.slug
        }).then(() => {
            req.flash("success_msg", "Categoria modificada com successo")
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash("error_msg", "Não foi possivel modificar a Categoria, tente novamente")
            res.redirect('/admin/categorias')
        })


    }



})

router.post('/categorias/deletar', (req, res) => {
    Categoria.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Categoria Deletada com Sucesso")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar, tente novamente")
        res.redirect('/admin/categorias')
    })

})

router.get('/postagens', (req, res) => {
    Postagem.find().populate("categoria").sort({ data: "desc" }).then((postagens) => {
        res.render("admin/postagens", { postagens: postagens })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao buscar as postagens")
        res.redirect("/admin")
    })

})

router.get('/postagens/add', (req, res) => {
    Categoria.find().then((categorias) => {
        res.render("admin/addpostagens", { categorias: categorias })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao Carregar o Formulario.")
        req.redirect("/admin/postagens")
    })

})




router.post('/postagens/nova', (req, res) => {

    let erros = valida(req.body)

    if (req.body.categoria == "0") {
        erros.push({ texto: "Categoria inexistente, registre uma nova" })
    }

    if (erros.length > 0) {
        res.render('admin/addpostagens', { erros: erros })
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }


        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso!")
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash("error_msg", "Erro ao salvar postagem, tente novamente.")
            res.redirect('/admin/postagens')
        })
    }

})

router.get('/postagens/edit/:id', (req, res) => {
    Postagem.findOne({ _id: req.params.id }).populate("categoria").then((postagem) => {
        Categoria.find().then((categorias) => {

            let select_filter = []
            categorias.forEach(cat => {
                if (cat.id !== postagem.categoria.id) {
                    select_filter.push({
                        id: cat.id,
                        nome: cat.nome,
                        selected: false
                    })
                } else {
                    select_filter.push({
                        id: cat.id,
                        nome: cat.nome,
                        selected: true
                    })
                }
            })



            res.render("admin/editpostagens", {
                postagem: postagem,
                categorias: select_filter
            })

        }).catch((err) => {
            req.flash("error_msg", "Erro ao selecionar Categorias")
            res.redirect('/admin/postagens')
        })

    }).catch((err) => {
        req.flash("error_msg", "Essa postagem nao existe")
        res.redirect('/admin/postagens')
    })

})

router.post('/postagens/edit', (req, res) => {

    let erros = valida(req.body)

    if (erros.length > 0) {
        erros.forEach(element => {
            req.flash("error_msg", element.texto)
        });

        res.redirect("/admin/postagens/edit/" + req.body.id)

    } else {

        Postagem.findByIdAndUpdate({ _id: req.body.id }, {
 
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug

        }).then(() => {
            req.flash("success_msg", "Postagem modificada com successo")
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash("error_msg", "Não foi possivel modificar a Postagem, tente novamente")
            res.redirect('/admin/postagens')
        })


    }



})


router.post('/postagens/deletar', (req, res) => {
    Postagem.deleteOne({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Postagem Deletada com Sucesso")
        res.redirect("/admin/postagens")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar, tente novamente")
        res.redirect('/admin/postagens')
    })

})

module.exports = router