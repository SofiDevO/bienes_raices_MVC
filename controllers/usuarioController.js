const formularioLogin  = (req, res)=>{
    res.render('auth/login',{
        pagina: 'Iniciar Sesión'
    })
}
const formularioRegistro  = (req, res)=>{
    res.render('auth/register',{
        pagina: 'Crear Cuenta'
    })
}
const formularioRecuperarPassword = (req, res)=>{
    res.render('auth/forgot-password',{
        pagina: 'Recuperar contraseña'
    })
}

export{
    formularioLogin,
    formularioRegistro,
    formularioRecuperarPassword
}