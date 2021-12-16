const dbconfig = require('../dbconfig/db.config');
// add ordered
exports.add = async function(order) {
    return await dbconfig.add('ordered', order);
}

// get order id of last inserted
exports.getOrderIdLastInserted  = async function() {
    const result = await dbconfig.select('SELECT order_id as order_id FROM ordered ' +
            'order by order_id desc LIMIT 1 ');
    return result[0].order_id;
}

// get all ordered by user
exports.getAllByUser = async function(email) {
    return await dbconfig.select('SELECT distinct * FROM ordered o ' +
        'join item i on o.order_id = i.order_id ' +
        'join product_detail pd on i.product_detail_id = pd.product_detail_id ' +
        'join product p on p.product_id = pd.product_id ' +
        'where o.email = \'' + email + '\' ' +
        'group by o.order_id ' + 
        'order by o.order_id asc');
}

// get order by id
exports.getOrderById  = async function(order_id) {
    return await dbconfig.select('SELECT * FROM ordered o ' +
            'where o.order_id = \'' + order_id + '\'');
}

// get all item by order id
exports.getAllItemByOrderId  = async function(order_id) {
    return await dbconfig.select('SELECT * FROM item i ' +
        'join product_detail pd on pd.product_detail_id = i.product_detail_id ' +
        'join product p on p.product_id = pd.product_id ' +
        'where i.order_id = \'' + order_id + '\'');
}



