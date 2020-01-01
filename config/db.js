if(process.env.NODE_ENV == "production") {
    module.exports = {mongoURI: "mongodb+srv://kleitonbarone:polartigre@main-t1doi.mongodb.net/test?retryWrites=true&w=majority"}
} else {
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}