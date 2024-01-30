//Forma anterior de importar paquetes
// const express = require('express');

//Forma nueva de importar paquetes
import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js';

//Crear app
const app = express();

//habilitar pug
app.set('view engine','pug')
app.set('views','./views')

//Carpeta publica
app.use(express.static('public'))

//Routing
// app.get('/', usuarioRoutes); este comando se limita a una ruta exacta, en este caso solo a la '/'
app.use('/auth', usuarioRoutes);


//Definir puerto  para arrancar el proyecto
const port = 3000;

app.listen(port,() =>{
    console.log(`El servidor esta funcionando en el pueto: ${port}`)
});




