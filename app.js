// app.js – ERJ145 LRC Planner avec correction du menu poids

const altitudeSelect = document.getElementById('altitude');
const weightSelect = document.getElementById('weight');

// Remplir les altitudes
for (const alt of Object.keys(lrcData)) {
  const option = document.createElement('option');
  option.value = alt;
  option.textContent = alt + ' ft';
  altitudeSelect.appendChild(option);
}

// Fonction pour mettre à jour les poids
function updateWeights(selectedAlt) {
  weightSelect.innerHTML = ''; // Vider
  const weights = Object.keys(lrcData[selectedAlt] || {});
  if (weights.length === 0) {
    const opt = document.createElement('option');
    opt.textContent = 'Aucune option';
    weightSelect.appendChild(opt);
    return;
  }

  for (const wt of weights) {
    const option = document.createElement('option');
    option.value = wt;
    option.textContent = wt + ' kg';
    weightSelect.appendChild(option);
  }
}

// Lors du changement d'altitude
altitudeSelect.addEventListener('change', () => {
  const selectedAlt = altitudeSelect.value;
  updateWeights(selectedAlt);
});

// Initialiser le menu Poids si une altitude est déjà sélectionnée
window.addEventListener('DOMContentLoaded', () => {
  if (altitudeSelect.value) {
    updateWeights(altitudeSelect.value);
  } else if (altitudeSelect.options.length > 0) {
    altitudeSelect.selectedIndex = 0;
    updateWeights(altitudeSelect.value);
  }
});

// Calcul des performances
document.getElementById('planner-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const alt = altitudeSelect.value;
  const wt = weightSelect.value;
  const isa = parseInt(document.getElementById('isa').value);
  const antiIce = document.getElementById('antiIce').checked;

  if (!lrcData[alt] || !lrcData[alt][wt]) {
    alert('Données manquantes pour cette combinaison.');
    return;
  }

  const data = { ...lrcData[alt][wt] };

  const tempFactor = isa / 5;
  data.N1 += 1 * tempFactor;
  data.fuelFlow *= 1 + (0.01 * tempFactor);
  data.TAS += 5 * tempFactor;

  if (antiIce) {
    data.N1 += 0.6;
    data.fuelFlow *= 1.08;
    data.SR *= 0.91;
  }

  displayResults(data);
});

function displayResults(data) {
  const results = document.getElementById('results');
  const list = document.getElementById('results-list');
  list.innerHTML = `
    <li><strong style="color: #FF7F00;">N1 % :</strong> <span style="color: white;">${data.N1.toFixed(1)}%</span></li>
    <li><strong style="color: #FF7F00;">Fuel Flow :</strong> ${data.fuelFlow.toFixed(1)} kg/h/moteur</li>
    <li><strong style="color: #FF7F00;">IAS :</strong> ${data.IAS} kt</li>
    <li><strong style="color: #FF7F00;">TAS :</strong> ${data.TAS.toFixed(0)} kt</li>
    <li><strong style="color: #FF7F00;">Mach :</strong> <span style="color: white;">${data.mach.toFixed(3)}</span></li>
    <li><strong style="color: #FF7F00;">Specific Range :</strong> ${data.SR.toFixed(3)} NM/kg</li>
  `;
  results.style.display = 'block';
}
