const newsapi = require("../config/newsAPI");
const SavedNews = require("../models/SavedNews");

// Get top headlines
exports.getTopHeadlines = async (req, res) => {
  try {
    const { category, q, country = "us" } = req.query;
    const response = await newsapi.v2.topHeadlines({
      category: category,
      country: "us",
    });

    // console.log("response", response);

    res.json(response.articles);
  } catch (error) {
    res.status(500).json({ error: "Error fetching news" });
  }
};

// Get news by search
exports.searchNews = async (req, res) => {
  try {
    const { q } = req.query;
    const response = await newsapi.v2.everything({
      q,
      language: "en",
      sortBy: "relevancy",
    });

    res.json(response.articles);
  } catch (error) {
    res.status(500).json({ error: "Error searching news" });
  }
};

exports.saveArticle = async (req, res) => {
  try {
    console.log("req.user, ", req.body);

    const { title, description, url, source, urlToImage, publishedAt } =
      req.body;

    const userId = req.user.userId; // Extract userId from token

    // Check if the article is already saved
    const existingArticle = await SavedNews.findOne({ user: userId, url });
    if (existingArticle) {
      return res.status(400).json({ error: "Article already saved" });
    }

    const savedNews = new SavedNews({
      user: userId,
      title,
      description,
      url,
      imageUrl: urlToImage,
      publishedAt,
      source: source.name,
    });

    await savedNews.save();
    res.json({ message: "Article saved successfully", savedNews });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error !!, Article is not saved", error: error });
  }
};

exports.getSavedArticles = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract userId from token

    const savedArticles = await SavedNews.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.json({ savedArticles });
  } catch (error) {
    res.status(500).json({ error: "Error fetching saved articles" });
  }
};

exports.deleteSavedArticle = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract userId from token
    const { id } = req.params; // Get article ID from request params

    const article = await SavedNews.findOne({ _id: id, user: userId });

    if (!article) {
      return res
        .status(404)
        .json({ error: "Article not found or not authorized" });
    }

    await SavedNews.findByIdAndDelete(id);
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting article" });
  }
};
