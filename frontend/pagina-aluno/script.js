document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("modal").style.display = "flex";
    carregarResumoQrcode();
});

function fecharModal() {
    window.location.href = "index.html";
}
