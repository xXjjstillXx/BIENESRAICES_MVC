import express from 'express';
import { formularioLogin, formularioSignin,formularioOlvideContrasena,registrar } from '../controllers/UsuarioController.js';

const router = express.Router();

router.get('/login',formularioLogin);

router.get('/signin',formularioSignin);

router.post('/signin',registrar);

router.get('/recovery',formularioOlvideContrasena);


router.post('/', function(req,res){
    res.json({msg: 'Respuesta tipo post'});
})



//Otro tipo de sintaxis puede ser
// router.route('/')
//     .get(function(req, res) {
//         res.json({msg: 'Hola mundo en express'})
//     })
//     .post(function(req,res){
//         res.json({msg: 'Respuesta tipo post'})
//     })

export default router;
