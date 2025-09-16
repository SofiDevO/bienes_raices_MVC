const registerForm = (req, res) => {
    res.render('auth/register', {
        page: 'Crear Cuenta'
    });
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
    forgotPasswordForm
}