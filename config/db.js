if(process.env.NODE_ENV == "production") {
    module.exports = {mongoURI: "DB de Producao"}
} else {
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}

