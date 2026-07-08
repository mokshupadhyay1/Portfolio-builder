const express = require('express');
const { protect } = require('../middleware/auth');
const Portfolio = require('../models/Portfolio');
const PortfolioTemplate = require('../models/PortfolioTemplate');
const User = require('../models/User');
const Report = require('../models/Report');

const router = express.Router();

// @desc    Get all available templates
// @route   GET /api/portfolio/templates
// @access  Private
router.get('/templates', protect, async (req, res, next) => {
  try {
    const templates = await PortfolioTemplate.find({});
    res.status(200).json({
      success: true,
      data: templates
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get user portfolio
// @route   GET /api/portfolio/me
// @access  Private
router.get('/me', protect, async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id })
      .populate('template', 'name displayName description');

    res.status(200).json({
      success: true,
      data: portfolio
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Initialize a new portfolio
// @route   POST /api/portfolio/initialize
// @access  Private
router.post('/initialize', protect, async (req, res, next) => {
  try {
    const { templateId } = req.body;

    if (!templateId) {
      const error = new Error('Please select a template');
      error.statusCode = 400;
      return next(error);
    }

    // Check if user already has a portfolio
    const existingPortfolio = await Portfolio.findOne({ user: req.user.id });
    if (existingPortfolio) {
      const error = new Error('You have already initialized a portfolio');
      error.statusCode = 400;
      return next(error);
    }

    // Fetch the template structure
    const template = await PortfolioTemplate.findById(templateId);
    if (!template) {
      const error = new Error('Template not found');
      error.statusCode = 404;
      return next(error);
    }

    // Set theme defaults depending on template name
    let themeDefaults = {
      primary: '#6366f1',
      secondary: '#a855f7',
      background: '#0b0f19',
      text: '#f3f4f6',
      card: 'rgba(17, 24, 39, 0.7)',
      fontFamily: 'Inter, sans-serif',
      darkMode: true
    };

    if (template.name === 'developer') {
      themeDefaults = {
        primary: '#10b981',
        secondary: '#3b82f6',
        background: '#090d16',
        text: '#34d399',
        card: 'rgba(17, 24, 39, 0.8)',
        fontFamily: 'Fira Code, monospace',
        darkMode: true
      };
    } else if (template.name === 'creative') {
      themeDefaults = {
        primary: '#ec4899',
        secondary: '#8b5cf6',
        background: '#0c0a1c',
        text: '#f8fafc',
        card: 'rgba(30, 27, 75, 0.4)',
        fontFamily: 'Outfit, sans-serif',
        darkMode: true
      };
    } else if (template.name === 'sleek') {
      themeDefaults = {
        primary: '#06b6d4',
        secondary: '#10b981',
        background: '#020617',
        text: '#e2e8f0',
        card: 'rgba(15, 23, 42, 0.6)',
        fontFamily: 'Inter, sans-serif',
        darkMode: true
      };
    } else if (template.name === 'classic') {
      themeDefaults = {
        primary: '#1e293b',
        secondary: '#475569',
        background: '#faf9f6',
        text: '#1e293b',
        card: '#ffffff',
        fontFamily: 'Georgia, serif',
        darkMode: false
      };
    }

    // Generate unique slug: username-templatename
    let slug = `${req.user.username}-${template.name}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
    
    // Ensure slug uniqueness
    let slugExists = await Portfolio.findOne({ slug });
    let counter = 1;
    while (slugExists) {
      slug = `${req.user.username}-${template.name}-${counter}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
      slugExists = await Portfolio.findOne({ slug });
      counter++;
    }

    // Create portfolio
    const portfolio = await Portfolio.create({
      user: req.user.id,
      title: `${req.user.username}'s Portfolio`,
      slug,
      template: templateId,
      theme: themeDefaults,
      sections: template.defaultStructure,
      isPublished: false
    });

    const populatedPortfolio = await Portfolio.findById(portfolio._id)
      .populate('template', 'name displayName description');

    res.status(201).json({
      success: true,
      data: populatedPortfolio
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Save portfolio draft
// @route   PUT /api/portfolio/save
// @access  Private
router.put('/save', protect, async (req, res, next) => {
  try {
    const { portfolioId, title, theme, sections } = req.body;

    if (!portfolioId) {
      const error = new Error('Portfolio ID is required');
      error.statusCode = 400;
      return next(error);
    }

    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) {
      const error = new Error('Portfolio not found');
      error.statusCode = 404;
      return next(error);
    }

    // Verify ownership
    if (portfolio.user.toString() !== req.user.id) {
      const error = new Error('Not authorized to edit this portfolio');
      error.statusCode = 401;
      return next(error);
    }

    // Apply updates
    if (title) portfolio.title = title;
    if (theme) portfolio.theme = { ...portfolio.theme, ...theme };
    if (sections) portfolio.sections = sections;
    if (req.body.templateId) {
      portfolio.template = req.body.templateId;
      const tpl = await PortfolioTemplate.findById(req.body.templateId);
      if (tpl) {
        let newSlug = `${req.user.username}-${tpl.name}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
        let slugExists = await Portfolio.findOne({ slug: newSlug, _id: { $ne: portfolio._id } });
        let counter = 1;
        while (slugExists) {
          newSlug = `${req.user.username}-${tpl.name}-${counter}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
          slugExists = await Portfolio.findOne({ slug: newSlug, _id: { $ne: portfolio._id } });
          counter++;
        }
        portfolio.slug = newSlug;
      }
    }

    await portfolio.save();

    const updatedPortfolio = await Portfolio.findById(portfolio._id)
      .populate('template', 'name displayName description');

    res.status(200).json({
      success: true,
      message: 'Draft saved successfully',
      data: updatedPortfolio
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Toggle publish status & update slug
// @route   PUT /api/portfolio/publish
// @access  Private
router.put('/publish', protect, async (req, res, next) => {
  try {
    const { portfolioId, isPublished, slug } = req.body;

    if (!portfolioId) {
      const error = new Error('Portfolio ID is required');
      error.statusCode = 400;
      return next(error);
    }

    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) {
      const error = new Error('Portfolio not found');
      error.statusCode = 404;
      return next(error);
    }

    // Verify ownership
    if (portfolio.user.toString() !== req.user.id) {
      const error = new Error('Not authorized to publish this portfolio');
      error.statusCode = 401;
      return next(error);
    }

    // Handle slug updates and validation
    if (slug) {
      const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (cleanSlug !== portfolio.slug) {
        // Verify unique slug
        const slugExists = await Portfolio.findOne({ slug: cleanSlug });
        if (slugExists) {
          const error = new Error('Custom url suffix is already taken');
          error.statusCode = 400;
          return next(error);
        }
        portfolio.slug = cleanSlug;
      }
    }

    portfolio.isPublished = isPublished !== undefined ? isPublished : !portfolio.isPublished;
    await portfolio.save();

    res.status(200).json({
      success: true,
      message: portfolio.isPublished ? 'Portfolio published successfully' : 'Portfolio unpublished successfully',
      data: portfolio
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get public portfolio details by slug
// @route   GET /api/portfolio/public/:slug
// @access  Public
router.get('/public/:slug', async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug, isPublished: true })
      .populate('user', 'username email')
      .populate('template', 'name displayName description');

    if (!portfolio) {
      const error = new Error('Portfolio not found or private');
      error.statusCode = 404;
      return next(error);
    }

    // Increment view count
    portfolio.views += 1;
    await portfolio.save();

    res.status(200).json({
      success: true,
      data: portfolio
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get portfolios for showcase
// @route   GET /api/portfolio/showcase
// @access  Public
router.get('/showcase', async (req, res, next) => {
  try {
    const { search, track, skill } = req.query;

    let userQuery = {};
    if (track) {
      userQuery.developerRole = track;
    }

    const users = await User.find(userQuery).select('_id');
    const userIds = users.map(u => u._id);

    let portfolioQuery = { isPublished: true, user: { $in: userIds } };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      portfolioQuery.$or = [
        { title: searchRegex },
        { "sections.content.name": searchRegex },
        { "sections.content.role": searchRegex },
        { "sections.content.bio": searchRegex }
      ];
    }

    if (skill) {
      const skillRegex = new RegExp(skill, 'i');
      if (!portfolioQuery.$or) portfolioQuery.$or = [];
      portfolioQuery.$or.push(
        { "sections.content.categories.items": skillRegex },
        { "sections.content.items.tags": skillRegex }
      );
    }

    const portfolios = await Portfolio.find(portfolioQuery)
      .populate('user', 'username email developerRole')
      .populate('template', 'name displayName description');

    res.status(200).json({
      success: true,
      data: portfolios
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Like a portfolio
// @route   PUT /api/portfolio/like/:portfolioId
// @access  Private
router.put('/like/:portfolioId', protect, async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.portfolioId);
    if (!portfolio) {
      const error = new Error('Portfolio not found');
      error.statusCode = 404;
      return next(error);
    }

    // Check if user already liked
    const alreadyLiked = portfolio.likes.some(id => id.toString() === req.user.id);
    if (!alreadyLiked) {
      portfolio.likes.push(req.user.id);
      await portfolio.save();
    }

    res.status(200).json({
      success: true,
      data: { likes: portfolio.likes }
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Clone another portfolio's layout and styles
// @route   POST /api/portfolio/clone
// @access  Private
router.post('/clone', protect, async (req, res, next) => {
  try {
    const { targetPortfolioId } = req.body;

    if (!targetPortfolioId) {
      const error = new Error('Target portfolio ID is required');
      error.statusCode = 400;
      return next(error);
    }

    const targetPortfolio = await Portfolio.findById(targetPortfolioId);
    if (!targetPortfolio) {
      const error = new Error('Target portfolio not found');
      error.statusCode = 404;
      return next(error);
    }

    // Fetch the template structure to recover default clean placeholders
    const template = await PortfolioTemplate.findById(targetPortfolio.template);
    if (!template) {
      const error = new Error('Template not found');
      error.statusCode = 404;
      return next(error);
    }

    // Map section positions & visibilities from target, but scrub all personal texts
    const clonedSections = targetPortfolio.sections.map(targetSec => {
      const defaultSec = template.defaultStructure.find(s => s.name === targetSec.name);
      let content = defaultSec ? defaultSec.content : {};
      
      // Personalize hero with current user's name
      if (targetSec.name === 'hero') {
        content = { ...content, name: req.user.username };
      }

      return {
        name: targetSec.name,
        title: targetSec.title,
        visible: targetSec.visible,
        order: targetSec.order,
        content
      };
    });

    // Check if user already has a portfolio
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    
    if (portfolio) {
      // Overwrite current portfolio styles/layouts
      portfolio.template = targetPortfolio.template;
      portfolio.theme = targetPortfolio.theme;
      portfolio.sections = clonedSections;
      portfolio.isPublished = false; // set cloned layout as draft initially
      
      // Update slug based on template name
      let newSlug = `${req.user.username}-${template.name}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
      let slugExists = await Portfolio.findOne({ slug: newSlug, _id: { $ne: portfolio._id } });
      let counter = 1;
      while (slugExists) {
        newSlug = `${req.user.username}-${template.name}-${counter}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
        slugExists = await Portfolio.findOne({ slug: newSlug, _id: { $ne: portfolio._id } });
        counter++;
      }
      portfolio.slug = newSlug;
      await portfolio.save();
    } else {
      // Create new portfolio
      let newSlug = `${req.user.username}-${template.name}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
      let slugExists = await Portfolio.findOne({ slug: newSlug });
      let counter = 1;
      while (slugExists) {
        newSlug = `${req.user.username}-${template.name}-${counter}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
        slugExists = await Portfolio.findOne({ slug: newSlug });
        counter++;
      }

      portfolio = await Portfolio.create({
        user: req.user.id,
        title: `${req.user.username}'s Portfolio`,
        slug: newSlug,
        template: targetPortfolio.template,
        theme: targetPortfolio.theme,
        sections: clonedSections,
        isPublished: false
      });
    }

    const populatedPortfolio = await Portfolio.findById(portfolio._id)
      .populate('template', 'name displayName description');

    res.status(200).json({
      success: true,
      message: 'Portfolio cloned successfully',
      data: populatedPortfolio
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get portfolio completeness score
// @route   GET /api/portfolio/score
// @access  Private
router.get('/score', protect, async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) {
      return res.status(200).json({
        success: true,
        data: {
          score: 0,
          checks: {
            hasGithub: false,
            hasLinkedin: false,
            hasContact: false,
            hasProjects: false,
            hasExperience: false,
            hasSkills: false
          }
        }
      });
    }

    const sections = portfolio.sections || [];

    const getSecContent = (name) => {
      const sec = sections.find(s => s.name === name);
      return sec && sec.visible ? sec.content : null;
    };

    const aboutContent = getSecContent('about') || {};
    const skillsContent = getSecContent('skills') || {};
    const projectsContent = getSecContent('projects') || {};
    const experienceContent = getSecContent('experience') || {};
    const contactContent = getSecContent('contact') || {};

    const hasGithub = !!(aboutContent.github && aboutContent.github.trim().startsWith('http'));
    const hasLinkedin = !!(aboutContent.linkedin && aboutContent.linkedin.trim().startsWith('http'));
    
    const hasContact = !!((contactContent.email && contactContent.email.trim()) || (contactContent.phone && contactContent.phone.trim()));

    const projectsCount = Array.isArray(projectsContent.items) ? projectsContent.items.length : 0;
    const hasProjects = projectsCount >= 2;

    const experienceCount = Array.isArray(experienceContent.items) ? experienceContent.items.length : 0;
    const hasExperience = experienceCount >= 1;

    const skillsCats = Array.isArray(skillsContent.categories) ? skillsContent.categories : [];
    const hasSkills = skillsCats.length >= 1 && skillsCats.some(cat => Array.isArray(cat.items) && cat.items.length >= 1);

    let score = 20; // Base score
    if (hasGithub) score += 15;
    if (hasLinkedin) score += 15;
    if (hasContact) score += 15;
    if (projectsCount >= 2) score += 15;
    else if (projectsCount === 1) score += 8;
    if (hasExperience) score += 10;
    if (hasSkills) score += 10;

    res.status(200).json({
      success: true,
      data: {
        score,
        checks: {
          hasGithub,
          hasLinkedin,
          hasContact,
          hasProjects,
          hasExperience,
          hasSkills
        },
        counts: {
          projects: projectsCount,
          experience: experienceCount
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Export portfolio as standalone React project ZIP
// @route   GET /api/portfolio/export
// @access  Private
router.get('/export', protect, async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id })
      .populate('template', 'name displayName description');

    if (!portfolio) {
      const error = new Error('You do not have a portfolio to export. Please build one first!');
      error.statusCode = 404;
      return next(error);
    }

    const fs = require('fs');
    const path = require('path');

    // Read active TemplateRenderer source
    let templateRendererCode = '';
    try {
      templateRendererCode = fs.readFileSync(path.join(__dirname, '../../../frontend/src/components/TemplateRenderer.jsx'), 'utf-8');
    } catch (fsErr) {
      console.error('Failed to read TemplateRenderer.jsx from disk:', fsErr);
      templateRendererCode = `
import React from 'react';
const TemplateRenderer = () => <div>Template Renderer Fallback</div>;
export default TemplateRenderer;
`;
    }

    // Static project configs
    const packageJsonContent = JSON.stringify({
      name: "devlaunch-exported-portfolio",
      private: true,
      version: "1.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview"
      },
      dependencies: {
        react: "^18.3.1",
        "react-dom": "^18.3.1",
        "lucide-react": "^0.468.0"
      },
      devDependencies: {
        "@types/react": "^18.3.3",
        "@types/react-dom": "^18.3.0",
        "@vitejs/vite-plugin-react": "^4.3.0",
        autoprefixer: "^10.4.19",
        postcss: "^8.4.38",
        tailwindcss: "^3.4.4",
        vite: "^5.2.11"
      }
    }, null, 2);

    const viteConfigContent = `import { defineConfig } from 'vite'
import react from '@vitejs/vite-plugin-react'

export default defineConfig({
  plugins: [react()],
})`;

    const postcssConfigContent = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

    const tailwindConfigContent = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

    const indexHtmlContent = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Developer Portfolio</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

    const mainJsxContent = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

    const indexCssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

    const appJsCode = `import React from 'react';
import TemplateRenderer from './components/TemplateRenderer';

const portfolioData = ${JSON.stringify({
      templateName: portfolio.template?.name || 'modern',
      theme: portfolio.theme,
      sections: portfolio.sections
    }, null, 2)};

function App() {
  return (
    <TemplateRenderer
      templateName={portfolioData.templateName}
      theme={portfolioData.theme}
      sections={portfolioData.sections}
      isPreview={false}
    />
  );
}

export default App;`;

    const files = [
      { name: 'package.json', content: packageJsonContent },
      { name: 'vite.config.js', content: viteConfigContent },
      { name: 'postcss.config.js', content: postcssConfigContent },
      { name: 'tailwind.config.js', content: tailwindConfigContent },
      { name: 'index.html', content: indexHtmlContent },
      { name: 'src/main.jsx', content: mainJsxContent },
      { name: 'src/index.css', content: indexCssContent },
      { name: 'src/App.jsx', content: appJsCode },
      { name: 'src/components/TemplateRenderer.jsx', content: templateRendererCode }
    ];

    // Build pure JS STORED zip buffer
    const buffers = [];
    const centralDirs = [];
    let currentOffset = 0;

    const crcTable = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      crcTable[n] = c;
    }

    const getCrc32 = (buf) => {
      let crc = -1;
      for (let i = 0; i < buf.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
      }
      return (crc ^ -1) >>> 0;
    };

    for (const file of files) {
      const nameBuf = Buffer.from(file.name, 'utf-8');
      const dataBuf = Buffer.from(file.content, 'utf-8');
      const crc = getCrc32(dataBuf);
      const size = dataBuf.length;

      // Local Header
      const lfHeader = Buffer.alloc(30);
      lfHeader.writeUInt32LE(0x04034b50, 0); 
      lfHeader.writeUInt16LE(10, 4);         
      lfHeader.writeUInt16LE(0, 6);          
      lfHeader.writeUInt16LE(0, 8);          // Stored
      lfHeader.writeUInt16LE(0, 10);         
      lfHeader.writeUInt16LE(0, 12);         
      lfHeader.writeUInt32LE(crc, 14);       
      lfHeader.writeUInt32LE(size, 18);      
      lfHeader.writeUInt32LE(size, 22);      
      lfHeader.writeUInt16LE(nameBuf.length, 26); 
      lfHeader.writeUInt16LE(0, 28);         

      const localRecord = Buffer.concat([lfHeader, nameBuf, dataBuf]);
      buffers.push(localRecord);

      // Central Dir Header
      const cdHeader = Buffer.alloc(46);
      cdHeader.writeUInt32LE(0x02014b50, 0); 
      cdHeader.writeUInt16LE(20, 4);         
      cdHeader.writeUInt16LE(10, 6);         
      cdHeader.writeUInt16LE(0, 8);          
      cdHeader.writeUInt16LE(0, 10);         
      cdHeader.writeUInt16LE(0, 12);         
      cdHeader.writeUInt16LE(0, 14);         
      cdHeader.writeUInt32LE(crc, 16);       
      cdHeader.writeUInt32LE(size, 20);      
      cdHeader.writeUInt32LE(size, 24);      
      cdHeader.writeUInt16LE(nameBuf.length, 28); 
      cdHeader.writeUInt16LE(0, 30);         
      cdHeader.writeUInt16LE(0, 32);         
      cdHeader.writeUInt16LE(0, 34);         
      cdHeader.writeUInt16LE(0, 36);         
      cdHeader.writeUInt32LE(0, 38);         
      cdHeader.writeUInt32LE(currentOffset, 42); 

      centralDirs.push(Buffer.concat([cdHeader, nameBuf]));
      currentOffset += localRecord.length;
    }

    const cdBuffer = Buffer.concat(centralDirs);
    const cdOffset = currentOffset;
    const cdSize = cdBuffer.length;

    // EOCD
    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0);       
    eocd.writeUInt16LE(0, 4);                
    eocd.writeUInt16LE(0, 6);                
    eocd.writeUInt16LE(files.length, 8);     
    eocd.writeUInt16LE(files.length, 10);    
    eocd.writeUInt32LE(cdSize, 12);          
    eocd.writeUInt32LE(cdOffset, 16);        
    eocd.writeUInt16LE(0, 20);               

    buffers.push(cdBuffer, eocd);
    const zipBuffer = Buffer.concat(buffers);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=devlaunch-portfolio-source.zip');
    res.send(zipBuffer);
  } catch (err) {
    next(err);
  }
});

// @desc    Submit a feedback or spam/inappropriate report
// @route   POST /api/portfolio/report
// @access  Private
router.post('/report', protect, async (req, res, next) => {
  try {
    const { reportedPortfolioId, type, subject, description } = req.body;

    if (!type || !subject || !description) {
      const error = new Error('Please include type, subject, and description');
      error.statusCode = 400;
      return next(error);
    }

    const report = await Report.create({
      reporter: req.user.id,
      reportedPortfolio: reportedPortfolioId || null,
      type,
      subject,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      data: report
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
