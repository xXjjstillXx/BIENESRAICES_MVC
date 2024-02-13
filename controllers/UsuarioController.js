import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import {generarId } from '../helpers/tokens.js';
import {emailRegistro, emailRecovery} from '../helpers/emails.js';
import Usuario from '../models/Usuario.js';

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina:'Iniciar sesion',
        csrfToken: req.csrfToken()
    });
}

const formularioSignin = (req, res) => {
    res.render('auth/signin', {
        pagina: 'Crear cuenta',
        csrfToken: req.csrfToken()
    });
}

const registrar = async (req, res) => {
    //Validacion
    await check('nombre').notEmpty().withMessage('El nombre no puede ser vacío').run(req);
    await check('email').isEmail().withMessage('Email inválido').run(req);
    await check('password').isLength({min: 6}).withMessage('La contraseña debe ser de mínimo 6 caracteres').run(req);
    await check('repetirPassword').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req);

    let resultado = validationResult(req);
    //verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/signin', {
            pagina: 'Crear cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    //extraer datos 
    const {nombre, email, password} = req.body;

    //verificar que el usuario no esté duplicado 
    const existeUsuario = await Usuario.findOne({where: {email}});
    if(existeUsuario){
        return res.render('auth/signin', {
            pagina: 'Crear cuenta',
            csrfToken: req.csrfToken(),
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
    usuario.token = null;
    usuario.confirmado = true;
    res.render('auth/confirmarCuenta',{
        pagina: 'Cuenta confirmada',
        mensaje: 'La cuenta se confirmo correctamente',
    })
    await usuario.save();
    console.log(usuario.token)


}

const formularioOlvideContrasena = (req, res) => {
    res.render('auth/recovery', {
        pagina: 'Recuperar contraseña',
        csrfToken: req.csrfToken()
        
    });
}

const resetPassword = async (req,res) =>{
    //Validacion
    await check('email').isEmail().withMessage('Email inválido').run(req);

    const {email} = req.body;

    let resultado = validationResult(req);
    //return res.json(resultado.array())
    //verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/recovery', {
            pagina: 'Recuperar contraseña',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                email: email
            }
        })
    }

    //Buscar usuario

    const usuario = await Usuario.findOne({where: {email}});
    if(!usuario){
        return res.render('auth/recovery', {
            pagina: 'Recuperar contraseña',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Uups, parece ser que el correo no está registrado'}],
            usuario: {
                email: email
            }
        })
    }

    //Generar un token y enviar email
    usuario.token = generarId();
    await usuario.save();

    //enviar email
    emailRecovery({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    });

    //Renderizamos mensaje
    res.render('templates/mensaje', {
        pagina: 'Reestablece tu contraseña',
        mensaje: 'Hemos enviado un correo con las instrucciones, por favor revisa tu correo.'
    })
}

const comprobarToken = async (req,res) => {
    const{token} = req.params;
    const usuario = await Usuario.findOne({where: {token}});
    if(!usuario){
        return res.render('auth/confirmarCuenta',{
            pagina: 'Reestablecer contraseña',
            mensaje: 'Hubo un error al validar información, intenta de nuevo',
            error: true
        })
    }
    //Mostrar formulario para modificar la contraseña
    res.render('auth/resetPassword',{
        pagina:'Reestablecer contraseña',
        csrfToken: req.csrfToken()
    })
}

const nuevoPassword = async (req,res) => {
    //validar password
    await check('password').isLength({min: 6}).withMessage('La contraseña debe ser de mínimo 6 caracteres').run(req);
    await check('repetirPassword').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req);
    
    let resultado = validationResult(req);
    //verificar que el resultado este vacio
    if(!resultado.isEmpty()){
        return res.render('auth/resetPassword', {
            pagina: 'Reestablecer contraseña',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    const {token} = req.params;
    const{password} = req.body;

    //identificar quien hace el cambio
    const usuario = await Usuario.findOne({where: {token}});
    //hashear el nuevo password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;

    await usuario.save();
    res.render('auth/confirmarCuenta',{
        pagian: 'Password Reestablecido',
        mensaje: 'El password se guardó correctamente'
    })
    
}
export{
    formularioLogin,
    formularioSignin,
    registrar,
    confirmar,
    formularioOlvideContrasena,
    resetPassword,
    comprobarToken,
    nuevoPassword
}