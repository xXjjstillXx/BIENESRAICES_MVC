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
    const usuario = await Usuario.create(req.body);
    res.json(usuario);
}

const formularioOlvideContrasena = (req, res) => {
    res.render('auth/recovery', {
        pagina: 'Recuperar contraseña'
    });
}
export{
    formularioLogin,
    formularioSignin,
    formularioOlvideContrasena,
    registrar
}