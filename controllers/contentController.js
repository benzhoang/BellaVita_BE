const Content = require('../models/contentModel');

const ContentController = {
  // Get all content
  getAllContents: async (req, res) => {
    try {
      const contents = await Content.findAll();
      res.json(contents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get content by ID
  getContentById: async (req, res) => {
    try {
      const content = await Content.findByPk(req.params.id);
      if (!content) return res.status(404).json({ error: 'Content not found' });
      res.json(content);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Create new content
  createContent: async (req, res) => {
    try {
      const content = await Content.create(req.body);
      res.status(201).json(content);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Update content
  updateContent: async (req, res) => {
    try {
      const content = await Content.findByPk(req.params.id);
      if (!content) return res.status(404).json({ error: 'Content not found' });
      await content.update(req.body);
      res.json(content);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Delete content
  deleteContent: async (req, res) => {
    try {
      const content = await Content.findByPk(req.params.id);
      if (!content) return res.status(404).json({ error: 'Content not found' });
      await content.destroy();
      res.json({ message: 'Content deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = ContentController; 