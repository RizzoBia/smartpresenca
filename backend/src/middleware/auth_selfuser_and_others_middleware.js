require('dotenv').config()

//requerer a biblioteca JWT
const jwt = require('jsonwebtoken')

//método de autenticação para o usuário perfil Adm
module.exports = function(req, res, next) {
    const authToken = req.headers['authorization']
    if(authToken != undefined) {

        const bearer = authToken.split(' ')
        const token = bearer[1]

        try {
            const decoded = jwt.verify(token, process.env.SECRET)
            const targetUserID = parseInt(req.params.id || req.body.id)

            if (decoded.role === 3 && decoded.id !== targetUserID){
                return res.status(403).json({success: false, message:'Você só pode alterar o seu próprio usuário!'})
            }else{
                next()
            }
        } catch (error) {
            return res.status(403).json({success: false, message:'Token inválido!'})    
        }
    }else{
        return res.status(403).json({success: false, message:'Usuário não autenticado!'})
    }
}