//requerer o bcrypt

const bcrypt = require('bcryptjs')

function comparePasswordService(password, user_password){
    let isPassword = bcrypt.compareSync(password, user_password)
    return isPassword
}

module.exports = comparePasswordService