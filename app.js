
// app.js – ERJ145 LRC Planner avec chargement dynamique

// Remplir le menu déroulant des altitudes
const altitudeSelect = document.getElementById('altitude');
const weightSelect = document.getElementById('weight');

for (const alt of Object.keys(lrcData)) {
  const option = document.createElement('option');
  option.value = alt;
  option.textContent = alt + ' ft';
  altitudeSelect.appendChild(option);
}

// Mettre à jour le poids en fonction de l'altitude sélectionnée
altitudeSelect.addEventListener('change', () => {
  const selectedAlt = altitudeSelect.value;
  weightSelect.innerHTML = ''; // Réinitialiser
  const weights = Object.keys(lrcData[selectedAlt] || {});
  for (const wt of weights) {
    const option = document.createElement('option');
    option.value = wt;
    option.textContent = wt + ' kg';
    weightSelect.appendChild(option);
  }
});

// Formulaire de calcul
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

  // Ajustement ISA : +1% N1/fuel par +5°C, +5kt TAS/5°C
  const tempFactor = isa / 5;
  data.N1 += 1 * tempFactor;
  data.fuelFlow *= 1 + (0.01 * tempFactor);
  data.TAS += 5 * tempFactor;

  // Ajustement Anti-ice
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
    <li><strong>N1 % :</strong> ${data.N1.toFixed(1)}%</li>
    <li><strong>Fuel Flow :</strong> ${data.fuelFlow.toFixed(1)} kg/h/moteur</li>
    <li><strong>IAS :</strong> ${data.IAS} kt</li>
    <li><strong>TAS :</strong> ${data.TAS.toFixed(0)} kt</li>
    <li><strong>Mach :</strong> ${data.mach.toFixed(3)}</li>
    <li><strong>Specific Range :</strong> ${data.SR.toFixed(3)} NM/kg</li>
  `;
  results.style.display = 'block';
}
