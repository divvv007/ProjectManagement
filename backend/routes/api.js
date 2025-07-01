const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Mongoose models
const Project = require('../models/Project.js');
const Client = require('../models/Client.js');
const Contact = require('../models/Contact.js');
const Subscriber = require('../models/subscriber.js');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Multer - memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper: Save and resize image
async function saveImage(buffer, filename, width, height) {
  const filepath = path.join(uploadsDir, filename);
  await sharp(buffer).resize(width, height).toFile(filepath);
  return filename;
}

// Helper: Delete image from uploads folder
function deleteImageFile(filename) {
  const filePath = path.join(uploadsDir, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

// ===================== ROUTES =====================

// GET: Projects
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    console.error('❌ Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET: Clients
router.get('/clients', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    console.error('❌ Error fetching clients:', err);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// GET: Contacts
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    console.error('❌ Error fetching contacts:', err);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// GET: Subscribers
router.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err) {
    console.error('❌ Error fetching subscribers:', err);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// POST: Add Project
router.post('/projects', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    const ext = path.extname(req.file.originalname) || '.jpg';
    const img = Date.now() + ext;

    await saveImage(req.file.buffer, img, 600, 400);

    const project = new Project({
      name: req.body.name,
      description: req.body.description,
      image: img
    });

    await project.save();
    res.json({ message: '✅ Project added successfully' });
  } catch (err) {
    console.error('❌ Error adding project:', err);
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// POST: Add Client
router.post('/clients', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image is required' });

    const ext = path.extname(req.file.originalname) || '.jpg';
    const img = Date.now() + ext;

    await saveImage(req.file.buffer, img, 300, 300);

    const client = new Client({
      name: req.body.name,
      designation: req.body.designation,
      description: req.body.description,
      image: img
    });

    await client.save();
    res.json({ message: '✅ Client added successfully' });
  } catch (err) {
    console.error('❌ Error adding client:', err);
    res.status(500).json({ error: 'Failed to add client' });
  }
});

// POST: Save Contact
router.post('/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.json({ message: '📬 Contact form submitted' });
  } catch (err) {
    console.error('❌ Error saving contact:', err);
    res.status(500).json({ error: 'Failed to save contact' });
  }
});

// POST: Subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const subscriber = new Subscriber(req.body);
    await subscriber.save();
    res.json({ message: '📩 Subscribed to newsletter' });
  } catch (err) {
    console.error('❌ Error subscribing:', err);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// ===================== DELETE ROUTES =====================

// DELETE: Project by ID
router.delete('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    deleteImageFile(project.image);
    await project.deleteOne();

    res.json({ message: '🗑️ Project deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting project:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// DELETE: Client by ID
router.delete('/clients/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });

    deleteImageFile(client.image);
    await client.deleteOne();

    res.json({ message: '🗑️ Client deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting client:', err);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

// DELETE: Contact by ID
router.delete('/contacts/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    res.json({ message: '🗑️ Contact deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting contact:', err);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// DELETE: Subscriber by ID
router.delete('/subscribers/:id', async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) return res.status(404).json({ error: 'Subscriber not found' });

    res.json({ message: '🗑️ Subscriber deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting subscriber:', err);
    res.status(500).json({ error: 'Failed to delete subscriber' });
  }
});

module.exports = router;
