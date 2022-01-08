// requiero el modulo path para normalizar
const path = require('path');
// requiero el modulo fs que es el filesSystem para poder hacer uso de archivos dentro del proyecto
const fs = require('fs');
const req = require('express/lib/request');
const routes = require('../routes/routes.js')

// con el path busco una ruta normalizada hacia el json donde guardo mi info
const itemsFilePath = path.join(__dirname, '../data/lugares.json');
// con un JSON.parse convierto en objeto literal o array de objetos al JSON para poder usarlo dentro de mis views. Ademas esto hace la lectura del JSON cada vez que se procesa algo con el controller
const lugares = JSON.parse(fs.readFileSync(itemsFilePath, 'utf-8'));

// el objeto controller es el que me guarda todas las funciones que van a las rutas para ejecutar las vistas y los procesos del servidor. Es la C de MVC
const controller = {
    // cada propiedad del objeto literal controller contrendrá una función req, res
    browse: (req, res) => { // browse es la raiz que muestra todos los productos
        // para renderizar una vista ejs solo tengo que poner el nombre de la vista si esta dentro de la carpeta 'views'
        return res.render('browse', {
            // llamo a la variable creada en -9- con la database. Ahora puedo usar la info dentro del JSON en esta view
            lugares: lugares,
        })
    } ,
    read: (req, res) => { // read me muestra un solo producto que viene desde una ruta parametrizada
        // -23- Number() convierte en number todo lo que venga en el params porque sino seria string 
        const id = Number(req.params.id) 
        // genero una variable que contenga el item encontrado mediante el metodo find() con el parametro que viene en la ruta
        const lugar = lugares.find(unLugar => unLugar.id === id);
        // retorno la vista y llamo a la variable generada en -25- con el id de la ruta parametrizada. A este puedo usarlo ahora en la vista 'read'. Tambien le paso la variable id para poder usarla en el if
        return res.render('read', {
            lugar: lugar,
            id: id
        })
    },
    // este metodo es para retornar la vista del formulario de edit, se accede con get
    edit: (req, res) => {
        //Necesito encontrar el item a editar para que complete el formulario con la info que ya existe
        const id = Number(req.params.id)
        const lugar = lugares.find(unLugar => unLugar.id === id);
        // al render le paso la vista, el id para que pueda usarlo dentro de la vista y la variable lugar con el item a editar
        res.render('edit', {
            lugar: lugar,
            id: id
        })
    },
    put: (req, res) => {
        // aqui tengo que sobreescribir el json con una variable que contenga las modificaciones
        const id = Number(req.params.id)
        // la logica para modificar el JSON. Hago un map para que recorra todo el array y con un if busco el id del para saber que item estoy modificando. 
        // el if retorna el objeto modificado, el spread operator es para que las propiedades que no modifico sigan iguales. Se usa el parametro con el que mapea para encontrar el item a modificar, luego las propiedades con el req.body
        // despues del if tengo que retornar el parametro mapeado
        // Los archivos de img se suben con req.file, no con req.body. Aqui solo ponemos el filename porque en la vista donde se va a mostrar la imagen completo el path
        const lugarModificado = lugares.map(unLugar => {
            if(unLugar.id === id){
                return {
                    ...unLugar,
                name: req.body.name,
                description: req.body.description,
                status: req.body.status,
                type: req.body.type,
                img: req.file.filename
        }
            } return unLugar;
        })
    //   se envia para sobreescribir el json el nombre de la funcion de mapeo
        fs.writeFileSync(itemsFilePath, JSON.stringify(lugarModificado, null, ' '))
        console.log('Esto confirma que se envio con exito el formulario para editar');
        return res.redirect('/') //este redirect me manda al browse pero sin la info nueva
    },
    add: (req, res) => {
        const id = Number(req.params.id);
        res.render('add', {
            lugares: lugares,
            id: id
        })
    },
    post: (req, res) => {
        //generamos un ID para el objeto que vamos a pushear
        const generateID = () =>{
        // 1. Obtenemos el último producto almacenado en la DB
			const ultimoLugar =  lugares[lugares.length - 1];
			// 2. Obtenemos el ID de ese último producto
			const lastID = ultimoLugar.id;
			// 3. Retornamos ese último ID incrementado en 1
			return lastID + 1;
        }
        lugares.push({
            id: generateID(),
            name: req.body.name,
            description: req.body.description,
            status: req.body.status,
            type: req.body.type,
            img: req.file.filename,
            imgEpigrafe: req.body.imgEpigrafe,
        })

        fs.writeFileSync(itemsFilePath, JSON.stringify(lugares, null, ' '));
        console.log('Esto confirma que se agregó el item con exito');
        res.redirect('/')
    },
    // Con este metodo se elimina el item/lugar seleccionado 
    delete: (req, res) => {
         // -50- Number() convierte en number todo lo que venga en el params porque sino seria string 
         const id = Number(req.params.id) 
        //  esta linea genera un array filtrado. Retorna todos los items MENOS el que vamos a borrar
         const lugaresFiltrado = lugares.filter(unLugar => unLugar.id !== id);
        // el fs.writeFileSync recibe el path del JSON que va a sobreescribir, luego recibe lo que va a volver a escribir convertido en string, se le pasa el array ya filtrado
         fs.writeFileSync(itemsFilePath, JSON.stringify(lugaresFiltrado, null, ' '));

        console.log('Esto confirma que se eliminó el item')
        res.redirect('/')
    }

}
module.exports = controller