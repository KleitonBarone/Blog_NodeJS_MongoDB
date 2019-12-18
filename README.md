# Blog_NodeJS_MongoDB
Fazendo um Blog utilizando NodeJS e o MongoDB

## De onde começar

Esse é um projeto JavaScript em NodeJs, que usa banco de dados MongoDB, em front-end foi utilizado o framework "Bootstrap"

### Prerequisitos

NodeJS e Banco de Dados MongoDB Instalados

### Instalando

Abra o arquivo "models/db.js" 

E na linha
```
 mongoose.connect("mongodb://localhost/blogapp"
```

altere o parametro para o nome do banco de dados desejado


## Rodando

Feito os passos acima, Execute o comando 'node' no app.js

```
./projeto> node app.js
```
pronto, o projeto estara rodando em localhost, na porta 8081

caso queira alterar a porta do localhost, vá até o arquivo app.js

```
const PORT = 8081
app.listen(PORT, function(){
    console.log("Localhost rodando na porta 8081")
})
```
Altere a const PORT para a porta que desejar

## Autor

* **Kleiton Barone** - [GitHub](https://github.com/KleitonBarone)
