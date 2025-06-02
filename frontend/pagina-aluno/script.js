if (typeof API_URL === 'undefined') {
    var API_URL = 'http://localhost:4040';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("modal").style.display = "flex";
    carregarResumoQrcode();
});

function fecharModal() {
    window.location.href = "index.html";
}
