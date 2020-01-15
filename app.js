//Node Modules
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const usuario = require('./routes/usuario')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Postagem')
const Postagem = mongoose.model("Postagem")
require('./models/Categoria')
const Categoria = mongoose.model("Categoria")
const passport = require('passport')
require('./config/auth')(passport)
const db = require('./config/db')
require('./models/Comentario')
const Comentario = mongoose.model('Comentario')

//Config
    //Session
    app.use(session({
        secret: "APPSESSION",
        resave: true,
        saveUninitialized: true
    }))

    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())

    //Middleware
    app.use((req,res,next)=>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null
        next()
    })

    //Body Parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    //Handlebars
    app.engine('handlebars', handlebars({
        defaultLayout: 'main',

        helpers: {
            ifEquals: function (arg1,arg2,options) { return (arg1 == arg2) ? options.fn(this) : options.inverse(this); }
        }
    }))
    
    app.set('view engine', 'handlebars')

    

    //Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect(db.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(()=>{
        console.log("Conectado ao MongoDB")
    }).catch((err)=>{
        console.log("Erro ao se conectar: " + err)
        
    })
    //Public
    app.use(express.static(path.join(__dirname,"public")))



//Rotas
    app.get('/', (req,res) =>{
        Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) => {


            res.render("index", {postagens: postagens})

        }).catch((err) =>{
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/404")
        })
        
    })

    

    app.get('/postagem/:slug', (req,res) =>{
        
        Postagem.findOne({slug: req.params.slug}).populate("categoria").then((postagem) =>{

            Comentario.find({postagem: postagem.id}).populate("usuario").populate("postagem").sort({data: "desc"}).then((comentarios) => {

                if(postagem){
                    res.render("postagem/index" , {postagem: postagem, comentarios: comentarios})
                } else {
                    req.flash("error_msg", "Essa Postagem não existe")
                    res.redirect('/')
                }


            }).catch((err) => {
                req.flash("error_msg", "Ocorreu um erro interno")
                res.redirect('/404')
            })
            
            
            

        }).catch((err) =>{
            req.flash("error_msg", "Ocorreu um erro interno")
            res.redirect('/404')
        })

    })

    app.get('/categorias', (req,res) =>{

        Categoria.find().sort({nome: "desc"}).then((categorias) => {


            res.render("categoria/index", {categorias: categorias})

        }).catch((err) =>{
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/404")
        })
        
    })

    app.get('/categorias/:slug', (req,res) =>{
        Categoria.findOne({slug: req.params.slug}).then((categoria) => {

            if(categoria) {

                Postagem.find({categoria: categoria.id}).then((postagens) =>{

                
                    res.render("categoria/postagens" , {categoria: categoria, postagens: postagens})

               
                }).catch((err) =>{
                req.flash("error_msg", "Ocorreu um erro interno")
                res.redirect('/404')
                })

            } else {

                req.flash("error_msg", "Essa categoria não existe")
                res.redirect('/categorias')

            }

            
            
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/404")
        }) 
        

    })

    app.get('/404', (req,res) =>{
        res.send("Oops, ocorreu um erro (404)")
    })

    

    app.use('/admin', admin)

    app.use('/usuarios', usuario)







//Server
const PORT = process.env.PORT || 8081
app.listen(PORT, () => {
    console.log("Servidor Rodando...")
})