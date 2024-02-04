import { check, validationResult } from 'express-validator';
import {generarId } from '../helpers/tokens.js';
import {emailRegistro} from '../helpers/emails.js';
import Usuario from '../models/Usuario.js';

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina:'Iniciar sesion'
    });
}

const formularioSignin = (req, res) => {
    res.render('auth/signin', {
        pagina: 'Crear cuenta'
    });
}

const registrar = async (req, res) => {
    //Validacion
    await check('nombre').notEmpty().withMessage('El nombre no puede ser vacío').run(req);
    await check('email').isEmail().withMessage('Email inválido').run(req);
    await check('password').isLength({min: 6}).withMessage('La contraseña debe ser de mínimo 6 caracteres').run(req);
    await check('repetirPassword').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req);

    let resultado = validationResult(req);
    //return res.json(resultado.array())
    //verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/signin', {
            pagina: 'Crear cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    //estrer datos 
    const {nombre, email, password} = req.body;

    //verificar que el usuario no esté duplicado 
    const existeUsuario = await Usuario.findOne({where: {email}});
    if(existeUsuario){
        return res.render('auth/signin', {
            pagina: 'Crear cuenta',
            errores: [{msg: 'El usuario ya esta registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    //almacenar un usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    //Envia email de verificacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //Mostrar mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Cuenta creada exitosamente.',
        mensaje: 'Hemos enviado un correo de confirmacion, por favor revisa tu correo.'
    })
}

//Funcion para confirmar cuenta

const confirmar = async (req,res)=>{
    const{token}=req.params;
    //verificar que el token es valido

    const usuario = await Usuario.findOne({where: {token}});
    if(!usuario){
        return res.render('auth/confirmarCuenta',{
            pagina: 'Error al confirmar cuenta',
            mensaje: 'Hubo un error inesperado al confirmar tu cuenta, intenta de nuevo',
            error: true
        })
    }
    //confirmar la cuenta 

}

const formularioOlvideContrasena = (req, res) => {
    res.render('auth/recovery', {
        pagina: 'Recuperar contraseña'
    });
}
export{
    formularioLogin,
    formularioSignin,
    registrar,
    confirmar,
    formularioOlvideContrasena
}