const dbconfig = require('../dbconfig/db.config');

// add item
exports.add = async function(item) {
    return await dbconfig.add('item', item);
}

// count number of item in order
exports.countItemIOrder = async function(order_id) {
    const result = await dbconfig.select('SELECT COUNT(*) as total FROM item ' +
            'where order_id = \'' + order_id + '\'');
    return result[0].total;
}