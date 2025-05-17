//requerer as variaveis de ambiente
require('dotenv').config()

// requerer a biblioteca jwt
const jwt = require('jsonwebtoken')

//método de autenticação para o USER perfil ADMIN
module.exports = function(req,res,next){
	const authToken = req.headers['authorization']
	if(authToken != undefined){
		const bearer = authToken.split(' ')
        let token = bearer [1]
        
        try {
            let decoded = jwt.verify(token, process.env.SECRET)
            return decoded.role === 1
            ? next ()
            : res.status(403).json({success: false, message:'Usuário sem permissão!'})
        } catch (error){
            return res.status(403).json({success: false, message: 'Token Inválido'})
        }
		
	}else{
		return res.status(403).json({success: false, message:'Usuário não autenticado'})
    }
}
