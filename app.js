//Node Modules
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

//Config
    //Session
    app.use(session({
        secret: "APPSESSION",
        resave: true,
        saveUninitialized: true
    }))

    app.use(flash())

    //Middleware
    app.use((req,res,next)=>{
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })

    //Body Parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    //Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')

    //Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect("mongodb://localhost/blogapp", {
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
        res.send("Index")
    })

    app.get('/posts', (req,res) =>{
        res.send("Posts")
    })

    app.use('/admin', admin)







//Server
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor Rodando...")
})