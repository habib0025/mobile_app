// backend-api/scripts/importFromExcel.js

const xlsx = require('xlsx');
const mongoose = require('mongoose');
const Sentiment = require('sentiment');
const dotenv = require('dotenv');
dotenv.config();

const Feedback = require('../models/Feedback');
const sentiment = new Sentiment();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connecté');
    importExcel();
  })
  .catch(console.error);

// Mapping des types
function detectType(raw) {
  const code = raw?.toUpperCase().trim();
  const types = {
    'S/C': 'sans courant',
    'SURTE': 'surtension',
    'FILDEC': 'fil décroché',
    'C/I': 'courant intermittent',
    'ACCIO': 'accident poteau',
    'CHUTU': 'chute de tension',
    'FIL A TERRE': 'fil à terre',
    'POTPEN': 'poteau penché',
  };
  return types[code] || 'autre';
}

// Parsing robuste de la date
function parseDate(dateString, timeString) {
  try {
    const [day, month, year] = dateString.split('/');
    const isoString = `${year}-${month}-${day}T${timeString || '00:00'}:00Z`;
    const date = new Date(isoString);
    return isNaN(date.getTime()) ? new Date() : date;
  } catch {
    return new Date();
  }
}

// Analyse de sentiment
function detectSentiment(text) {
  const result = sentiment.analyze(text || '');
  if (result.score > 1) return 'positif';
  if (result.score < -1) return 'negatif';
  return 'neutre';
}

// Fonction principale
function importExcel() {
  const workbook = xlsx.readFile('data/global_senelec.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

  const feedbacks = rows.map(row => {
    const values = Object.values(row);
    let description = values[values.length - 1];
    if (typeof description !== 'string') description = 'Pas de description';
    description = description.trim() || 'Pas de description';

    return {
      type: detectType(row[8]),
      description,
      region: row[11]?.trim() || 'non spécifiée',
      sentiment: detectSentiment(description),
      source: 'app', // ⚠️ changer ici pour éviter l'erreur de validation
      createdAt: parseDate(row[1], row[2]),
      status: 'reçu'
    };
  });

  Feedback.insertMany(feedbacks)
    .then(() => {
      console.log(`✅ ${feedbacks.length} réclamations importées.`);
      process.exit();
    })
    .catch(err => {
      console.error('❌ Erreur d’import :', err);
      process.exit(1);
    });
}
