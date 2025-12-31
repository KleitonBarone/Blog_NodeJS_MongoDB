# Blog App (Node.js + MongoDB)

A simple blog platform built with Node.js, Express, MongoDB (Mongoose), Handlebars, and Bootstrap. It supports user registration/login, categories, posts, and comments, with an admin area to manage content.

Admin access (for local/dev testing):
- Email: admin@admin.com
- Password: admin

## Features
- Blog posts: create, edit, list, and view posts.
- Categories: organize posts by category.
- Comments: users can comment on posts.
- Authentication: user registration and login.
- Admin area: manage categories and posts.
- UI: responsive frontend using Bootstrap and Handlebars.

## Tech Stack
- Backend: Node.js, Express
- Database: MongoDB with Mongoose ODM
- Templating: Handlebars
- Frontend: Bootstrap

## Project Structure
```
app.js
config/
  auth.js
  db.js
helpers/
  isAdmin.js
models/
  Categoria.js
  Comentario.js
  Postagem.js
  Usuario.js
public/
  css/, js/ (Bootstrap assets)
routes/
  admin.js
  usuario.js
views/
  layouts/main.handlebars
  partials/_navbar.handlebars, _footer.handlebars, _msg.handlebars
  admin/, categoria/, postagem/, usuario/
```

## Prerequisites
- Node.js (>= 16 recommended)
- MongoDB running locally or accessible remotely

## Setup
1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/KleitonBarone/Blog_NodeJS_MongoDB.git
   cd Blog_NodeJS_MongoDB
   npm install
   ```
2. Configure the MongoDB connection:
   - Open [config/db.js](config/db.js) and set your database name/URI. Example default:
     ```js
     module.exports = { mongoURI: "mongodb://localhost/blogapp" }
     ```
   - Alternatively, point `mongoURI` to a remote MongoDB (e.g., Atlas).

## Running Locally
Start the server:
```bash
npm start
```
By default it runs on `http://localhost:8081`.

Update the `PORT` constant to your preferred value.

## Routes Overview
- User-facing routes: see [routes/usuario.js](routes/usuario.js)
- Admin routes: see [routes/admin.js](routes/admin.js)

Admin routes are protected using the `isAdmin` helper in [helpers/isAdmin.js](helpers/isAdmin.js).

## Models
- Categories: [models/Categoria.js](models/Categoria.js)
- Posts: [models/Postagem.js](models/Postagem.js)
- Comments: [models/Comentario.js](models/Comentario.js)
- Users: [models/Usuario.js](models/Usuario.js)

## Development Tips
- Seed admin credentials responsibly and change them for production.
- Keep `mongoURI` secure when deploying (use environment variables or similar).

## License
This project is licensed under the terms of the license in [LICENSE](LICENSE).

## Author
**Kleiton Barone** — [GitHub](https://github.com/KleitonBarone)
