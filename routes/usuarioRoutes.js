import express from 'express';
import { formularioLogin, autenticar,formularioSignin, registrar, confirmar,
    formularioOlvideContrasena, resetPassword, comprobarToken, nuevoPassword} from '../controllers/UsuarioController.js';

const router = express.Router();

router.get('/login',formularioLogin);
router.post('/login',autenticar);

router.get('/signin',formularioSignin);
router.post('/signin',registrar);

router.get('/confirm/:token',confirmar);


router.get('/recovery',formularioOlvideContrasena);
router.post('/recovery',resetPassword);

//Almacenar nuevo password
router.get('/recovery/:token', comprobarToken);
router.post('/recovery/:token', nuevoPassword);




export default router;


//Otro tipo de sintaxis puede ser
// router.route('/')
//     .get(function(req, res) {
//         res.json({msg: 'Hola mundo en express'})
//     })
//     .post(function(req,res){
//         res.json({msg: 'Respuesta tipo post'})
//     })
