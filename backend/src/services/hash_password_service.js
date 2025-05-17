const bcrypt = require('bcryptjs');

function hashPasswordService(password){ 
    let salt = bcrypt.genSaltSync(10)
    let passHash = bcrypt.hashSync(password, salt) 
    return passHash 
}

module.exports = hashPasswordService