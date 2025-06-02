async function profile(req, res) {
    try {
        const user = req.user;
        res.json({ user });
    } catch (err) {
        console.error('Erro ao obter perfil:', err);
        res.status(500).json({ message: 'Erro ao obter perfil' });
    }
}

module.exports = { profile };
