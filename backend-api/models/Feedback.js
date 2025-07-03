// backend-api/models/Feedback.js

const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  type: { type: String, enum: ['panne', 'facture', 'service', 'autre'], required: true },
  description: { type: String, required: true },
  sentiment: { type: String, enum: ['positif', 'neutre', 'negatif'], default: 'neutre' },
  region: { type: String }, // exemple: Dakar, Thiès
  media: {
    imageUrl: String,
    audioUrl: String
  },
  source: { type: String, enum: ['app', 'twitter', 'facebook', 'poste-de-controle', 'call'], default: 'app' },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['reçu', 'en cours', 'résolu'], default: 'reçu' },
  resolutionTime: { type: Number }, // en heures
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
