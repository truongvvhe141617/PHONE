const session = require('express-session');

exports.goToOrdered = async function (req, res) {
    if (session.userSession) {
        res.redirect('order')
    } else {
        res.render('login', {
            layout: false,
        })
    }
};
