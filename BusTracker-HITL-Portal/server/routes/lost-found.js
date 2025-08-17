
const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const router = express.Router();

const DATA_DIR = path.join(__dirname, '..', 'data');
const LOST_FOUND_PATH = path.join(DATA_DIR, 'lost-found.json');

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

function hashEmail(email) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(email).digest('hex').slice(0, 16);
}

router.get('/', async (req, res) => {
    try {
        const { type, category, status } = req.query;
        let items = await readJsonArray(LOST_FOUND_PATH);
        
        // Filter items
        if (type) items = items.filter(item => item.type === type);
        if (category) items = items.filter(item => item.category === category);
        if (status) items = items.filter(item => item.status === status);
        
        // Remove sensitive data for public view
        const publicItems = items.map(item => ({
            ...item,
            contact: hashEmail(item.contact || ''),
            verification: undefined, // Hide verification details
            claims: item.claims ? item.claims.length : 0
        }));
        
        res.json(publicItems);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve items' });
    }
});

router.post('/', async (req, res) => {
    try {
        const {
            type,
            title,
            description,
            category,
            location,
            date,
            contact,
            reward,
            verification,
            gdprConsent
        } = req.body;
        
        if (!gdprConsent) {
            return res.status(400).json({ error: 'GDPR consent required' });
        }
        
        if (!title || !description || !location || !contact) {
            return res.status(400).json({ error: 'Required fields missing' });
        }
        
        const items = await readJsonArray(LOST_FOUND_PATH);
        
        const newItem = {
            id: newId(),
            type: type || 'lost',
            title,
            description,
            category: category || 'personal',
            location,
            date,
            contact,
            contactHash: hashEmail(contact),
            reward: reward || 0,
            verification,
            status: 'active',
            claims: [],
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
            gdprConsent: true
        };
        
        items.unshift(newItem);
        await writeJson(LOST_FOUND_PATH, items);
        
        res.status(201).json({
            id: newItem.id,
            status: 'created',
            expiresAt: newItem.expiresAt
        });
    } catch (error) {
        console.error('Lost-found creation error:', error);
        res.status(500).json({ error: 'Failed to create item' });
    }
});

router.post('/:id/claim', async (req, res) => {
    try {
        const { verification, contact } = req.body;
        
        if (!verification || !contact) {
            return res.status(400).json({ error: 'Verification and contact required' });
        }
        
        const items = await readJsonArray(LOST_FOUND_PATH);
        const item = items.find(i => i.id === req.params.id);
        
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        if (item.status !== 'active') {
            return res.status(400).json({ error: 'Item is no longer available' });
        }
        
        const claim = {
            id: newId(),
            contact,
            contactHash: hashEmail(contact),
            verification,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        if (!item.claims) item.claims = [];
        item.claims.push(claim);
        
        await writeJson(LOST_FOUND_PATH, items);
        
        // In a real system, notify the item owner via email
        console.log(`New claim for item ${item.title} from ${hashEmail(contact)}`);
        
        res.json({
            success: true,
            message: 'Claim submitted successfully. The owner will be notified.',
            claimId: claim.id
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit claim' });
    }
});

router.put('/:id/verify-claim/:claimId', async (req, res) => {
    try {
        const { verified, meetingDetails } = req.body;
        const items = await readJsonArray(LOST_FOUND_PATH);
        const item = items.find(i => i.id === req.params.id);
        
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        const claim = item.claims?.find(c => c.id === req.params.claimId);
        if (!claim) {
            return res.status(404).json({ error: 'Claim not found' });
        }
        
        claim.status = verified ? 'verified' : 'rejected';
        claim.verifiedAt = new Date().toISOString();
        
        if (verified && meetingDetails) {
            claim.meetingDetails = meetingDetails;
            item.status = 'claimed';
        }
        
        await writeJson(LOST_FOUND_PATH, items);
        
        res.json({
            success: true,
            status: claim.status,
            meetingDetails: claim.meetingDetails
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to verify claim' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const items = await readJsonArray(LOST_FOUND_PATH);
        const filteredItems = items.filter(item => item.id !== req.params.id);
        
        if (filteredItems.length === items.length) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        await writeJson(LOST_FOUND_PATH, filteredItems);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

module.exports = router;
