const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const PortfolioTemplate = require('../models/PortfolioTemplate');

const defaultSections = [
  {
    name: 'hero',
    title: 'Hero Welcome',
    visible: true,
    order: 0,
    content: {
      name: 'Alex Rivera',
      role: 'Full Stack Software Engineer',
      tagline: 'I build high-performance web systems and interactive user experiences.',
      ctaText: 'Explore Projects'
    }
  },
  {
    name: 'about',
    title: 'About Me',
    visible: true,
    order: 1,
    content: {
      bio: 'Passionate software engineer with a strong foundation in algorithms, databases, and modern web frameworks. I enjoy solving complex structural challenges and writing clean, maintainable code.',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    name: 'skills',
    title: 'Core Skills',
    visible: true,
    order: 2,
    content: {
      categories: [
        { name: 'Languages', items: ['JavaScript', 'TypeScript', 'Python', 'Go', 'HTML/CSS'] },
        { name: 'Frameworks & Libs', items: ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS'] },
        { name: 'Tools & Databases', items: ['MongoDB', 'PostgreSQL', 'Docker', 'Git', 'AWS'] }
      ]
    }
  },
  {
    name: 'projects',
    title: 'Featured Projects',
    visible: true,
    order: 3,
    content: {
      items: [
        {
          title: 'DevLaunch Platform',
          description: 'A developer branding platform integrating portfolio builders and AI resume ATS compatibility analyzers.',
          link: 'https://github.com',
          tags: ['React', 'Node.js', 'Express', 'MongoDB']
        },
        {
          title: 'Event Microservices Container',
          description: 'High-throughput event parsing engine utilizing microservices patterns, Docker containerization, and message queues.',
          link: 'https://github.com',
          tags: ['Go', 'RabbitMQ', 'PostgreSQL', 'Docker']
        }
      ]
    }
  },
  {
    name: 'experience',
    title: 'Professional Experience',
    visible: true,
    order: 4,
    content: {
      items: [
        {
          company: 'TechCorp Solutions',
          role: 'Junior Engineer Intern',
          duration: 'May 2025 - Present',
          tasks: [
            'Co-developed RESTful microservices reducing lookup latency by 20%.',
            'Implemented responsive dashboards boosting user accessibility scores.'
          ]
        },
        {
          company: 'Open Source Community',
          role: 'Contributor',
          duration: 'Jan 2024 - Present',
          tasks: [
            'Contributed optimization patches to standard routing libraries.',
            'Authored unit tests improving code coverage indexes by 15%.'
          ]
        }
      ]
    }
  },
  {
    name: 'contact',
    title: 'Contact Details',
    visible: true,
    order: 5,
    content: {
      email: 'alex@devlaunch.com',
      phone: '+1 555-019-2834',
      location: 'San Francisco, CA'
    }
  },
  {
    name: 'footer',
    title: 'Footer Branding',
    visible: true,
    order: 6,
    content: {
      copyright: '© 2026 Alex Rivera. Powered by DevLaunch.'
    }
  }
];

const templates = [
  {
    name: 'modern',
    displayName: 'Modern Minimalist',
    description: 'Clean, elegant grid layout featuring dark glassmorphism gradients and subtle typography headers. Excellent for Frontend, Mobile, and Product Engineers.',
    previewImage: '',
    recommendedRoles: ['frontend', 'fullstack', 'mobile'],
    defaultStructure: defaultSections
  },
  {
    name: 'developer',
    displayName: 'Console Terminal',
    description: 'Retro geek terminal emulator interface featuring neon monospace prompts and system prompt diagnostics outputs. Excellent for Backend, DevOps, and AI/ML Engineers.',
    previewImage: '',
    recommendedRoles: ['backend', 'devops', 'ai-ml'],
    defaultStructure: defaultSections
  },
  {
    name: 'creative',
    displayName: 'Vibrant Gradient',
    description: 'High-vibrancy design featuring mesh gradients, purple-pink glow backdrops, and active micro-animations. Recommends for Creative Frontend, Designers, and Mobile Developers.',
    previewImage: '',
    recommendedRoles: ['frontend', 'mobile'],
    defaultStructure: defaultSections
  },
  {
    name: 'sleek',
    displayName: 'Dark Glassmorphic',
    description: 'Premium dark blue glassmorphism layout, featuring frosted card panels, neon borders, and clean typography. Recommends for AI/ML and Cloud Engineers.',
    previewImage: '',
    recommendedRoles: ['ai-ml', 'devops', 'backend'],
    defaultStructure: defaultSections
  },
  {
    name: 'classic',
    displayName: 'Classic Paper',
    description: 'Elegant light-themed layouts resembling a traditional physical resume card. Uses serif headers and dark charcoal lines. Recommends for formal applications, research, and academia.',
    previewImage: '',
    recommendedRoles: ['backend', 'fullstack'],
    defaultStructure: defaultSections
  }
];

const seedTemplates = async () => {
  try {
    // Connect to database
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected.');

    // Clear templates
    console.log('Clearing existing templates...');
    await PortfolioTemplate.deleteMany();

    // Insert templates
    console.log('Inserting templates...');
    await PortfolioTemplate.insertMany(templates);
    console.log('Templates seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedTemplates();
