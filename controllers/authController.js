module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.login_post = (req, res) => {
    res.send('Login Post Request');
}
module.exports.signup_get = (req, res) => {
    res.render('signup');
}
module.exports.signup_post = (req, res) => {
    res.send('Sign Up Request');
}