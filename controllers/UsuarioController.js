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

const formularioOlvideContrasena = (req, res) => {
    res.render('auth/recovery', {
        pagina: 'Recuperar contraseña'
    });
}
export{
    formularioLogin,
    formularioSignin,
    formularioOlvideContrasena
}