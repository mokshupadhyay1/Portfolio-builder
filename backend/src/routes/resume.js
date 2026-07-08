const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { protect } = require('../middleware/auth');
const Resume = require('../models/Resume');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Multer in-memory storage config
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF format resumes are supported'), false);
    }
  }
});

// @desc    Upload and Analyze Resume
// @route   POST /api/resume/analyze
// @access  Private
router.post('/analyze', protect, upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('Please upload a resume PDF file');
      error.statusCode = 400;
      return next(error);
    }

    // 1. Parse PDF Buffer to Text
    let parsedData;
    try {
      parsedData = await pdfParse(req.file.buffer);
    } catch (parseErr) {
      const error = new Error('Failed to parse PDF file text content');
      error.statusCode = 400;
      return next(error);
    }

    const text = parsedData.text || '';
    if (!text.trim()) {
      const error = new Error('Uploaded PDF appears to be empty or contains scanned images only');
      error.statusCode = 400;
      return next(error);
    }

    // 2. Perform Rule-Based Checks
    const hasContactInfo = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
    const hasEducation = /education|degree|university|college|academy/i.test(text);
    const hasProjects = /project|projects|repository|github/i.test(text);
    const hasSkills = /skills|languages|technologies|tools/i.test(text);

    const missingSections = [];
    if (!hasContactInfo) missingSections.push('Contact Information (Email)');
    if (!hasEducation) missingSections.push('Education Section');
    if (!hasProjects) missingSections.push('Projects Section');
    if (!hasSkills) missingSections.push('Skills Section');

    // Action verbs matching
    const strongVerbs = ['developed', 'built', 'implemented', 'optimized', 'managed', 'designed', 'architected', 'spearheaded', 'automated', 'engineered'];
    const weakVerbsList = ['worked', 'helped', 'assisted', 'made', 'did', 'tried'];
    
    const weakVerbsFound = [];
    weakVerbsList.forEach(verb => {
      const regex = new RegExp(`\\b${verb}\\b`, 'gi');
      if (regex.test(text)) {
        weakVerbsFound.push(verb);
      }
    });

    // Score Calculation
    let score = 100;
    if (!hasContactInfo) score -= 20;
    if (!hasEducation) score -= 15;
    if (!hasProjects) score -= 15;
    if (!hasSkills) score -= 15;
    score -= (weakVerbsFound.length * 5); // Deduct 5 pts per weak verb
    if (score < 0) score = 0;

    // Length check
    let lengthCheck = 'Optimal (1-2 pages)';
    if (text.length < 1000) {
      lengthCheck = 'Too Short (Less than 1 page)';
    } else if (text.length > 7000) {
      lengthCheck = 'Too Long (Exceeds 2 pages)';
    }

    // 3. AI Suggestions via Gemini GenAI
    let aiSuggestions = '';
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey && geminiKey.trim()) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const prompt = `Analyze the following developer resume for ATS compatibility and impact. Provide exactly three concrete, professional suggestions (e.g. missing technical keywords, quantitative impact metrics, structure formatting). Output your response in a clean, human-readable bullet points format.\n\nResume Text:\n${text}`;
        
        const result = await model.generateContent(prompt);
        aiSuggestions = result.response.text();
      } catch (aiErr) {
        console.error('Gemini AI API Call failed:', aiErr);
        aiSuggestions = generateFallbackSuggestions(missingSections, weakVerbsFound);
      }
    } else {
      console.warn('GEMINI_API_KEY missing in environment variables. Falling back to local rules engine.');
      aiSuggestions = generateFallbackSuggestions(missingSections, weakVerbsFound);
    }

    // 4. Save to database
    const analysis = await Resume.create({
      user: req.user.id,
      fileName: req.file.originalname,
      filePath: '', // in-memory upload, no local filePath needed
      extractedText: text,
      ruleBasedResults: {
        score,
        missingSections,
        weakActionVerbs: weakVerbsFound,
        lengthCheck,
        hasContactInfo,
        hasEducation,
        hasProjects,
        hasSkills
      },
      aiSuggestions
    });

    res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully',
      data: analysis
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get user's past resume analysis history
// @route   GET /api/resume/history
// @access  Private
router.get('/history', protect, async (req, res, next) => {
  try {
    const history = await Resume.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: history
    });
  } catch (err) {
    next(err);
  }
});

// Helper fallback generator
function generateFallbackSuggestions(missingSections, weakVerbs) {
  let suggestions = '### Local Engine Recommendations:\n\n';
  
  if (missingSections.length > 0) {
    suggestions += `* **Structure Improvements**: Add the following missing sections to qualify for ATS parsing filters: ${missingSections.join(', ')}.\n`;
  }
  
  if (weakVerbs.length > 0) {
    suggestions += `* **Action Verb Impact**: Replace passive verbs like *"${weakVerbs.join(', ')}"* with strong technical action verbs such as *engineered, spearheaded, automated, or optimized*.\n`;
  }

  suggestions += '* **Metrics Check**: Quantify accomplishments. E.g. replace "worked on database queries" with "optimized database lookup indexing, decreasing search latency by 35%".\n';
  suggestions += '* **GitHub Integrations**: Add direct links to your GitHub code projects to showcase active placement readiness.';
  
  return suggestions;
}

module.exports = router;
