const path = require('path');

const controller = {
    browse: (req, res) => {
        res.render('browse',)
    } ,
    read: (req, res) => {
        res.render('read')
    },
    edit: (req, res) => {
        res.render('edit')
    },
    put: (req, res) => {
        console.log('Esto confirma que se envio con exito el formulario para editar');
        res.redirect('/')
    },
    add: (req, res) => {
        res.render('add')
    },
    post: (req, res) => {
        console.log('Esto confirma que se agregó el item con exito');
        res.redirect('/')
    },
    delete: (req, res) => {
        console.log('Esto confirma que se eliminó el item')
        res.redirect('/')
    }

}
module.exports = controller