const dateFormat = require('dateformat');

exports.formatPrice = function (price) {
    let price_formated = undefined;
    if (parseInt(price % 1000) >= parseInt(100)) {
        price_formated = parseInt(price / 1000) + '.' + price % 1000;
    } else {
        price_formated = parseInt(price / 1000) + '.0' + price % 1000;
    }
    return price_formated;
}

exports.formatDate = function (date) {
    var dateFormat = require('dateformat');
    return dateFormat(date, "dd/mm/yyyy");
}