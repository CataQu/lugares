// MODULOS
const express = require("express");
const path = require('path');
const mainRouter = require('./routes/routes');
const methodOverride = require('method-override');
const app = express();

// CONFIGURACION
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// ROUTES
app.use('/', mainRouter)


// EJECUTAR SERVIDOR
app.listen(process.env.PORT || 3000, () => { console.log('Servidor arriba en el puerto 3000 🤓👌');})


