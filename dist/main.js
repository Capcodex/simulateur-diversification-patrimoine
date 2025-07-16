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
function estimerPartArt(profil, objectif, repartition) {
    const [min, max] = matrice[profil][objectif];
    const concentration = Math.max(...repartition);
    let ajustement = 0;
    if (concentration >= 80)
        ajustement = 2;
    else if (concentration >= 60)
        ajustement = 1;
    const minAj = min + ajustement;
    const maxAj = max + ajustement;
    const texte = `🖼️ Sur la base de votre profil et de la concentration actuelle de votre patrimoine, nous vous recommandons d’allouer entre <strong>${minAj}%</strong> et <strong>${maxAj}%</strong> de votre patrimoine à l’art.`;
    return { texte, minAj, maxAj };
}
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("simulateur-form");
    const resultat = document.getElementById("resultat");
    const totalPercent = document.getElementById("total-percent");
    const totalWarning = document.getElementById("total-warning");
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
        var _a, _b;
        e.preventDefault();
        const profil = (_a = document.getElementById("profil")) === null || _a === void 0 ? void 0 : _a.value;
        const objectif = (_b = document.getElementById("objectif")) === null || _b === void 0 ? void 0 : _b.value;
        const repartition = champsPourcentages.map(id => parseFloat(document.getElementById(id).value) || 0);
        const total = updateTotal();
        if (total !== 100) {
            totalWarning.textContent = `⚠️ La répartition actuelle ne totalise pas 100% (actuellement : ${total}%)`;
            resultat.innerHTML = "";
            return;
        }
        totalWarning.textContent = "";
        const estimation = estimerPartArt(profil, objectif, repartition);
        const { texte, minAj, maxAj } = estimation;
        const artMoyenne = Math.round((minAj + maxAj) / 2); // 🔥 moyenne en %
        const totalSansArt = 100 - artMoyenne;
        // 🔁 Répartition ajustée des 5 classes
        const repartitionAjustee = repartition.map(val => Math.round((val * totalSansArt) / 100));
        // ➕ Ajout de la part "Art recommandé"
        repartitionAjustee.push(artMoyenne);
        const labels = ["Immobilier", "Liquidités", "Financier", "Crypto", "Tangibles", "Art recommandé"];
        const colors = ["#7E57C2", "#42A5F5", "#66BB6A", "#FFA726", "#EF5350", "#FFD54F"];
        resultat.innerHTML = `
      <p><strong>Résultat :</strong><br>${texte}</p>
      <canvas id="graphique" width="400" height="400"></canvas>
    `;
        const ctx = document.getElementById("graphique").getContext("2d");
        if (ctx) {
            new Chart(ctx, {
                type: "pie",
                data: {
                    labels: labels,
                    datasets: [{
                            label: "Répartition ajustée",
                            data: repartitionAjustee,
                            backgroundColor: colors,
                            borderWidth: 1
                        }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            });
        }
    });
});
