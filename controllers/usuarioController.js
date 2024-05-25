import Usuario from "../models/Usuario.js"
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
const registrar = async(req, res) =>{
    const usuario = await Usuario.create(req.body);
    res.json(usuario);
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