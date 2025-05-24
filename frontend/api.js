const API_URL = 'http://localhost:4040';

async function getFrequencia(ra, token) {
    const response = await fetch(`${API_URL}/frequencia/${ra}`, {  // 👈 ajustado!
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Erro ao buscar frequência');
    return response.json();

}
console.log('Token enviado:', token);
