const dbconfig = require('../dbconfig/db.config');

// get phone category from database
exports.findAll = async function() {
    return await dbconfig.select('SELECT * FROM category c order by c.hot');
}
