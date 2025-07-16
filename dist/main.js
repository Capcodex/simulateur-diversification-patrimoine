"use strict";
const matrice = {
    Prudent: {
        Diversification: [3, 5],
        Transmission: [2, 3],
        Fiscalité: [3, 5],
        Passion: [4, 6],
    },
    Équilibré: {
        Diversification: [5, 10],
        Transmission: [4, 6],
        Fiscalité: [5, 8],
        Passion: [7, 12],
    },
    Dynamique: {
        Diversification: [10, 15],
        Transmission: [6, 8],
        Fiscalité: [8, 12],
        Passion: [10, 20],
    },
};
function estimerPartArt(patrimoine, profil, objectif) {
    const [min, max] = matrice[profil][objectif];
    const minVal = Math.round(patrimoine * min / 100).toLocaleString();
    const maxVal = Math.round(patrimoine * max / 100).toLocaleString();
    return `Vous devriez envisager d’allouer entre ${min}% et ${max}% de votre patrimoine à l’art, soit entre ${minVal} € et ${maxVal} €.`;
}
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("simulateur-form");
    const resultat = document.getElementById("resultat");
    const totalWarning = document.getElementById("total-warning");
    const totalPercent = document.getElementById("total-percent");
    const champsPourcentages = ["immobilier", "liquidites", "financier", "crypto", "tangibles"];
    const updateTotal = () => {
        const total = champsPourcentages
            .map(id => parseFloat(document.getElementById(id).value) || 0)
            .reduce((acc, val) => acc + val, 0);
        totalPercent.textContent = `Total : ${total}%`;
        return total;
    };
    champsPourcentages.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener("input", updateTotal);
    });
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const patrimoine = parseFloat(document.getElementById("patrimoine").value);
        const profil = document.getElementById("profil").value;
        const objectif = document.getElementById("objectif").value;
        const total = updateTotal();
        if (total !== 100) {
            totalWarning.textContent = `⚠️ La répartition actuelle ne totalise pas 100% (actuellement : ${total}%)`;
            resultat.innerHTML = "";
            return;
        }
        totalWarning.textContent = "";
        const texte = estimerPartArt(patrimoine, profil, objectif);
        resultat.innerHTML = `<p><strong>Résultat :</strong><br>${texte}</p>`;
    });
});
