// requerer variaveis de ambiente
require('dotenv').config()
//requerer o jwt para o desenvolvimento
const jwt = require('jsonwebtoken')

//iniciar middleware
module.exports = function(req, res, next) {
    const auth = req.headers['authorization']
    if(auth != undefined) {
        try {
            const bearer = auth.split(' ')
            let token = bearer[1]
            jwt.verify(token, process.env.SECRET)
            return next()
        } catch (error) {
            return res.status(403).json({success: false, Erro: error, message:'Usuário não autenticado!'})    
        }

    }else{
        return res.status(403).json({success: false, message:'Usuário não autenticado!'})
    }
}