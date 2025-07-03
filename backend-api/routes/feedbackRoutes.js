// backend-api/routes/feedbackRoutes.js

const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// ➕ Ajouter une réclamation
router.post('/', feedbackController.createFeedback);

// 📋 Lister toutes les réclamations
router.get('/', feedbackController.getAllFeedbacks);

// ✅ Mettre à jour le statut d’une réclamation
router.put('/:id/status', feedbackController.updateStatus);

module.exports = router;
