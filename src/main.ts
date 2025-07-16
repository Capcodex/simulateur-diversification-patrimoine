type ProfilInvestisseur = 'Prudent' | 'Équilibré' | 'Dynamique';
type Objectif = 'Diversification' | 'Transmission' | 'Fiscalité' | 'Passion';

const matrice: Record<ProfilInvestisseur, Record<Objectif, [number, number]>> = {
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

function estimerPartArt(
  profil: ProfilInvestisseur,
  objectif: Objectif,
  repartition: number[]
): { texte: string; range: [number, number] } {
  const [min, max] = matrice[profil][objectif];
  const concentration = Math.max(...repartition);
  let ajustement = 0;

  if (concentration >= 80) ajustement = 2;
  else if (concentration >= 60) ajustement = 1;

  const minAj = min + ajustement;
  const maxAj = max + ajustement;

  const texte = `🖼️ Sur la base de votre profil et de la concentration actuelle de votre patrimoine, nous vous recommandons d’allouer entre <strong>${minAj}%</strong> et <strong>${maxAj}%</strong> de votre patrimoine à l’art.`;

  return { texte, range: [minAj, maxAj] };
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("simulateur-form") as HTMLFormElement;
  const resultat = document.getElementById("resultat")!;
  const totalPercent = document.getElementById("total-percent")!;
  const totalWarning = document.getElementById("total-warning");

  const champsPourcentages = ["immobilier", "liquidites", "financier", "crypto", "tangibles"];

  const updateTotal = () => {
    const total = champsPourcentages
      .map(id => parseFloat((document.getElementById(id) as HTMLInputElement).value) || 0)
      .reduce((acc, val) => acc + val, 0);
    totalPercent.textContent = `Total : ${total}%`;
    return total;
  };

  champsPourcentages.forEach(id => {
    const input = document.getElementById(id) as HTMLInputElement;
    input.addEventListener("input", updateTotal);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const profil = (document.getElementById("profil") as HTMLSelectElement)?.value as ProfilInvestisseur;
    const objectif = (document.getElementById("objectif") as HTMLSelectElement)?.value as Objectif;

    const repartition = champsPourcentages.map(id =>
      parseFloat((document.getElementById(id) as HTMLInputElement).value) || 0
    );

    const total = updateTotal();

    if (total !== 100) {
      totalWarning!.textContent = `⚠️ La répartition actuelle ne totalise pas 100% (actuellement : ${total}%)`;
      resultat.innerHTML = "";
      return;
    }

    totalWarning!.textContent = "";
    const estimation = estimerPartArt(profil, objectif, repartition);
    const texte = estimation.texte;

    const labels = ["Immobilier", "Liquidités", "Financier", "Crypto", "Tangibles"];

    resultat.innerHTML = `
      <p><strong>Résultat :</strong><br>${texte}</p>
      <canvas id="graphique" width="400" height="400"></canvas>
    `;

    const ctx = (document.getElementById("graphique") as HTMLCanvasElement).getContext("2d");
    if (ctx) {
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [{
            label: "Répartition",
            data: repartition,
            backgroundColor: ["#7E57C2", "#42A5F5", "#66BB6A", "#FFA726", "#EF5350"],
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
