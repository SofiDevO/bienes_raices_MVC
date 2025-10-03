const registerForm = (req, res) => {
    res.render('auth/register', {
        page: 'Crear Cuenta'
    });
}

const register = (req, res) => {
    console.log(req.body);
    res.send('Registro exitoso');
}

const loginForm = (req, res) => {
    res.render('auth/login', {
        page: 'Iniciar Sesión'
    });
}
const forgotPasswordForm = (req, res) => {
    res.render('auth/forgot-password', {
        page: 'Recuperar Contraseña'
    });
}

export {
    loginForm,
    registerForm,
    register,
    forgotPasswordForm
}