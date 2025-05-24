const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido.' });
        }
        console.log('Token decodificado:', user);  // ✅ ADICIONE ISSO!
        req.user = user;
        next();
    });
}


function authorize(roles = []) {
    return [
        authenticate,
        (req, res, next) => {
            console.log('req.user:', req.user);  // ✅ ADICIONE ISSO!
            console.log('roles permitidas:', roles);
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Acesso negado para esta role.' });
            }
            next();
        }
    ];
}



module.exports = { authorize };
