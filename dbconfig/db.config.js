const mysql = require("mysql2");
const config = require("../db.config.json");

const pool = mysql.createPool(config.mysql);

module.exports = {
  select: function (query) {
    return new Promise(function (resolve, reject) {
      pool.query(query, function (error, results, fields) {
        if (error) {
          console.log(error);
          return reject(error);
        }
        resolve(results);
      });
    });
  },

  add: function (table, model) {
    return new Promise(function (resolve, reject) {
      const query = "INSERT INTO " + table + " SET ?";
      pool.query(query, model, function (error, results) {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  },

  update: function (table, model, condition) {
    return new Promise(function (resolve, reject) {
      const query = "UPDATE " + table + " SET ? WHERE ?";
      pool.query(query, [model, condition], function (error, results) {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  },
};
