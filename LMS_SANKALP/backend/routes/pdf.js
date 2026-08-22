const express = require('express');
const router = express.Router();
const { proxyPDF, getPDFInfo } = require('../controllers/pdfController');

// PDF proxy endpoint (no auth required for public PDFs)
router.get('/proxy', proxyPDF);

// PDF info endpoint (no auth required for public PDFs)
router.get('/info', getPDFInfo);

module.exports = router;
