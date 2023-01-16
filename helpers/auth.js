const bcrypt = require('bcrypt');

exports.hashPassword = (password) => new Promise((resolve, reject) => {
        bcrypt.genSalt(12, (err, salt) => {
            if (err) {
                reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
    });

exports.comparePassword = (password, hash) => bcrypt.compare(password, hash);
