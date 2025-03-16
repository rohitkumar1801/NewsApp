const express = require('express');
const { getTopHeadlines, searchNews, saveArticle, getSavedArticles, deleteSavedArticle } = require('../controllers/newsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/top-headlines', getTopHeadlines);
router.get('/search', searchNews);
router.post('/save', authMiddleware, saveArticle);

// Get all saved news articles for the user
router.get('/saved', authMiddleware, getSavedArticles);

// Delete a saved article
router.delete('/saved/:id', authMiddleware, deleteSavedArticle);

module.exports = router;
