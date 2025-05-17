//requerer as variaveis de ambiente
require('dotenv').config()
//requerer o jwt para o desenvolvimento
const jwt = require('jsonwebtoken')

//middleware para autenticação de usuários com perfil Gerente (role_id = 2) ou Admin (role_id = 1)
module.exports = function(req, res, next){
    const authToken = req.headers['authorization']
    if(authToken != undefined){
        const bearer = authToken.split(' ')
        let token = bearer[1]
        try {
            let decoded = jwt.verify(token, process.env.SECRET)
            return (decoded.role_id === 1 || decoded.role_id === 2)
            ? next()
            : res.status(403).json({success: false, message: 'Usuário sem permissão! (Apenas Admins e Gerentes)'});
        } catch (error){
            return res.status(403).json({success: false, message: 'Token Inválido'})
        }
    }else{
        return res.status(403).json({success: false, message:'Usuário não autenticado'})
    }
}