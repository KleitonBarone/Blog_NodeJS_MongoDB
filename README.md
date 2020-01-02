# Blog_NodeJS_MongoDB
Fazendo um Blog utilizando NodeJS e o MongoDB

Deploy com heroku: https://blogapp-nodejs-kb.herokuapp.com/

Login do Admin caso queira adicionar posts e/ou categorias
  Login: admin@admin.com
  Senha: admin

## De onde começar

Esse é um projeto JavaScript em NodeJs, que usa banco de dados MongoDB, em front-end foi utilizado o framework "Bootstrap"

### Prerequisitos

NodeJS e Banco de Dados MongoDB Instalados

### Instalando

Abra o arquivo "config/db.js" 

E na linha
```
 module.exports = {mongoURI: "mongodb://localhost/blogapp"}
```

altere o objeto para o nome do banco de dados desejado (O padrao é blogapp)


## Rodando

Feito os passos acima, vá até o diretorio do projeto e execute o comando 'npm install' para instalar todas as dependencias depois execute o comando 'npm start' para iniciar o projeto

```
./projeto> npm install
./projeto> npm start
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
