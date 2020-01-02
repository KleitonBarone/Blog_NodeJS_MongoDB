const mongoose = require('mongoose')
const Schema = mongoose.Schema


const comentarioSchema = new Schema({
    
    conteudo: {
        type: String,
        required: true
    },
    postagem: {
        type: Schema.Types.ObjectId,
        ref: "Postagem",
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }

})

mongoose.model("Comentario", comentarioSchema)