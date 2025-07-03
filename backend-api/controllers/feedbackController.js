// backend-api/controllers/feedbackController.js

const Feedback = require('../models/Feedback');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

// ➕ Ajouter une réclamation
exports.createFeedback = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 📋 Lister toutes les réclamations
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Mettre à jour le statut (ex: "en cours", "résolu")
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ success: false, message: "Réclamation introuvable" });
    }

    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.createFeedback = async (req, res) => {
  try {
    const feedbackData = req.body;

    // Analyse de sentiment sur la description
    const result = sentiment.analyze(feedbackData.description || '');
    let sentimentLabel = 'neutre';
    if (result.score > 1) sentimentLabel = 'positif';
    else if (result.score < -1) sentimentLabel = 'negatif';

    feedbackData.sentiment = sentimentLabel;

    const feedback = new Feedback(feedbackData);
    await feedback.save();

    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
