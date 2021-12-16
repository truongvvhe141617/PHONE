const session = require('express-session');

exports.logout = async function (req, res) {
    session.userSession = null;
    res.redirect('login');
};
