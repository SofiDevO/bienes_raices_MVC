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
const registrar = (req, res) =>{
    console.log(req.body)
}
const formularioRecuperarPassword = (req, res)=>{
    res.render('auth/forgot-password',{
        pagina: 'Recuperar contraseña'
    })
}

export{
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioRecuperarPassword
}