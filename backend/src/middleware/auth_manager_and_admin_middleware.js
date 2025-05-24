require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
    const authToken = req.headers['authorization']
    if (authToken != undefined) {
        const bearer = authToken.split(' ')
        let token = bearer[1]

        try {
            let decoded = jwt.verify(token, process.env.SECRET)
            if (decoded.role === 1 || decoded.role === 2) {
                next()
            }else {
                res.status(403).json({ success: false, message: 'Usuário sem permissão!' })
            }
        } catch (error) {
            return res.status(403).json({ success: false, message: 'Token Inválido' })
        }
    } else {
        return res.status(403).json({ success: false, message: 'Usuário não autenticado' })
    }
    // const authToken = req.headers['authorization']
    //     try {
    //         let decoded = jwt.verify(token, process.env.SECRET)
    //         return decoded.role === 1 || decoded.role === 2
    //             ? next()
    //             : res.status(403).json({ success: false, message: 'Usuário sem permissão!' })
    //     } catch (error) {
    //         return res.status(403).json({ success: false, message: 'Token Inválido' })
    //     }

    // } else {
    //     return res.status(403).json({ success: false, message: 'Usuário não autenticado' })
    // }
}