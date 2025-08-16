const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// Path to store security events
const eventsFilePath = path.join(__dirname, '..', 'data', 'security-events.json');

async function readEvents() {
  try {
    const data = await fs.readFile(eventsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // If file does not exist or is invalid, return empty array
    return [];
  }
}

async function writeEvents(events) {
  // ensure directory exists
  await fs.mkdir(path.dirname(eventsFilePath), { recursive: true });
  await fs.writeFile(eventsFilePath, JSON.stringify(events, null, 2));
}

// GET /api/security - retrieve all events
router.get('/', async (req, res) => {
  const events = await readEvents();
  res.json({ events });
});

// POST /api/security - create a new event
router.post('/', async (req, res) => {
  const { severity, message, meta } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  const newEvent = {
    id: Date.now().toString(),
    severity: severity || 'low',
    message,
    meta: meta || {},
    createdAt: new Date().toISOString()
  };
  const events = await readEvents();
  events.push(newEvent);
  await writeEvents(events);
  res.status(201).json({ event: newEvent });
});

// DELETE /api/security/:id - remove event by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  let events = await readEvents();
  const index = events.findIndex(e => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  const [removed] = events.splice(index, 1);
  await writeEvents(events);
  res.json({ event: removed });
});

module.exports = router;
