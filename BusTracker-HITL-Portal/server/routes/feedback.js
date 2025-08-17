
const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const router = express.Router();

const DATA_DIR = path.join(__dirname, '..', 'data');
const FEEDBACK_PATH = path.join(DATA_DIR, 'feedback.json');

async function ensureDataDir() {
    await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJsonArray(filePath, fallback = []) {
    try {
        const buf = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(buf);
    } catch (e) {
        return fallback;
    }
}

async function writeJson(filePath, data) {
    await ensureDataDir();
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

function newId() {
    return Math.random().toString(36).slice(2, 10);
}

// Anonymize personal data for GDPR compliance
function anonymizeContact(contact) {
    if (!contact || !contact.includes('@')) return contact;
    const [user, domain] = contact.split('@');
    return `${user.slice(0, 2)}***@${domain}`;
}

router.post('/', async (req, res) => {
    try {
        const { type, message, contact, category, priority, gdprConsent } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        if (!gdprConsent) {
            return res.status(400).json({ error: 'GDPR consent is required' });
        }

        const feedback = await readJsonArray(FEEDBACK_PATH);
        
        const newFeedback = {
            id: newId(),
            type: type || 'suggestion',
            message,
            contact: contact ? anonymizeContact(contact) : null,
            category: category || 'general',
            priority: priority || 'low',
            status: 'pending',
            createdAt: new Date().toISOString(),
            ipHash: req.ip ? require('crypto').createHash('sha256').update(req.ip).digest('hex').slice(0, 16) : null,
            gdprConsent: true,
            dataRetentionUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
        };

        feedback.unshift(newFeedback);
        await writeJson(FEEDBACK_PATH, feedback);

        // Auto-categorize and assign priority
        if (type === 'complaint' && priority === 'high') {
            // Trigger notification system for urgent issues
            console.log(`URGENT FEEDBACK: ${message.slice(0, 100)}...`);
        }

        res.status(201).json({ 
            id: newFeedback.id,
            status: 'received',
            estimatedResponse: '24 hours'
        });
    } catch (error) {
        console.error('Feedback submission error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const { type, category, status } = req.query;
        let feedback = await readJsonArray(FEEDBACK_PATH);
        
        // Filter by query parameters
        if (type) feedback = feedback.filter(f => f.type === type);
        if (category) feedback = feedback.filter(f => f.category === category);
        if (status) feedback = feedback.filter(f => f.status === status);
        
        // Remove sensitive data for public endpoints
        const sanitized = feedback.map(f => ({
            id: f.id,
            type: f.type,
            category: f.category,
            priority: f.priority,
            status: f.status,
            createdAt: f.createdAt,
            message: f.message.slice(0, 100) + (f.message.length > 100 ? '...' : '')
        }));
        
        res.json(sanitized);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve feedback' });
    }
});

router.put('/:id/status', async (req, res) => {
    try {
        const { status, response } = req.body;
        const feedback = await readJsonArray(FEEDBACK_PATH);
        const item = feedback.find(f => f.id === req.params.id);
        
        if (!item) return res.status(404).json({ error: 'Feedback not found' });
        
        item.status = status;
        item.adminResponse = response;
        item.updatedAt = new Date().toISOString();
        
        await writeJson(FEEDBACK_PATH, feedback);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update status' });
    }
});

module.exports = router;
