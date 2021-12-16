const dbconfig = require('../dbconfig/db.config');

// Find all product => return home page
exports.findAll = async function() {
    return await dbconfig.select('SELECT distinct * FROM product p ' +
        'join product_detail pd on p.product_id = pd.product_id ' +
        'join specifications spec on pd.specifications_id = spec.specifications_id ' +
        'group by p.product_id');
}

// Find all product by product id=> return home page
exports.findAllByCategory = async function(category_id, isSale, isCredit, isMonopoly, isNew) {

    let query = 'SELECT distinct * FROM product p ' +
        'join category c on c.category_id = p.category_id ' +
        'join product_detail pd on p.product_id = pd.product_id ' +
        'join specifications spec on pd.specifications_id = spec.specifications_id ' +
        'where c.category_id like \'%' + category_id + '%\' ';
    if (isSale === 'true') {
        query += 'and pd.sale > 0 ';
    }
    if (isCredit === 'true') {
        query += 'and p.is_credit = true ';
    }

    if (isMonopoly === 'true') {
        query += 'and p.is_monopoly = true ';
    }

    if (isNew === 'true') {
        query += 'and p.MFYear = 2021 '
    }

    query += 'group by p.product_id'

    return await dbconfig.select(query);
}

// Find product detail by color and version => return product detail page
exports.findProductDetail = async function(product_id, version, color) {
    return await dbconfig.select('SELECT * FROM product p ' +
        'join product_detail pd on p.product_id = pd.product_id ' +
        'join specifications spec on pd.specifications_id = spec.specifications_id ' +
        'join category c on p.category_id = c.category_id ' +
        'where p.product_id = \'' + product_id + '\' and pd.color = \'' + color + '\' and pd.version = \'' + version + '\'');
}

// Find all version of product by product id => return product detail page
exports.findAllVersion = async function(product_id) {
    return await dbconfig.select('SELECT distinct pd.product_detail_id, pd.version, pd.color, pd.product_id ' + 
        'FROM product_detail pd ' +
        'where pd.product_id = \'' + product_id + '\'' +
        'group by pd.version ' +
        'order by convert(pd.version, decimal) DESC');
}

// Find all color of product by id (distinct by color) => return product detail page
exports.findAllColor = async function(product_id) {
    return await dbconfig.select('SELECT distinct pd.product_detail_id, pd.image_intro, pd.color, pd.version, pd.product_id ' +
        'FROM product_detail pd ' +
        'where pd.product_id = \'' + product_id + '\'' +
        'group by pd.image_intro');
}

// Find product detail by color and version => return product detail page
exports.findProductDetailById = async function(product_detail_id) {
    return await dbconfig.select('SELECT * FROM product p ' +
        'join product_detail pd on p.product_id = pd.product_id ' +
        'join specifications spec on pd.specifications_id = spec.specifications_id ' +
        'join category c on p.category_id = c.category_id ' +
        'where pd.product_detail_id = \'' + product_detail_id + '\'');
}

exports.count = async function() {
    const result = await dbconfig.select('SELECT COUNT(*) AS total FROM product');
    return result[0].total;
}