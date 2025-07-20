require('dotenv').config();

module.exports = {
  siteMetadata: {
    title: process.env.SITE_NAME || 'The Homeless Church',
    description: process.env.SITE_DESCRIPTION || 'A community of faith serving those in need',
    siteUrl: process.env.SITE_URL || 'https://homelesschurch.org',
    author: 'The Homeless Church Team',
  },
  
  plugins: [
    // Core Gatsby plugins
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    
    // File system sources
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    
    // TinaCMS integration
    {
      resolve: 'tinacms',
      options: {
        enabled: process.env.NODE_ENV !== 'production',
        sidebar: {
          hidden: process.env.NODE_ENV === 'production',
        },
        toolbar: {
          hidden: process.env.NODE_ENV === 'production',
        },
      },
    },
    
    // PWA and performance
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: process.env.SITE_NAME || 'The Homeless Church',
        short_name: 'Homeless Church',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#2c3e50',
        display: 'standalone',
        icon: 'src/images/church-icon.png',
        icons: [
          {
            src: 'src/images/church-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'src/images/church-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    },
    'gatsby-plugin-offline',
    
    // SEO and accessibility
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: process.env.SITE_URL || 'https://homelesschurch.org',
        sitemap: `${process.env.SITE_URL || 'https://homelesschurch.org'}/sitemap.xml`,
        policy: [{ userAgent: '*', allow: '/' }],
      },
    },
    
    // Styling
    'gatsby-plugin-styled-components',
    
    // Analytics (if configured)
    process.env.GA_TRACKING_ID && {
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: [process.env.GA_TRACKING_ID],
        pluginConfig: {
          head: true,
          respectDNT: true,
        },
      },
    },
    
    // Custom Telegram CMS source plugin
    {
      resolve: './plugins/gatsby-source-telegram-cms',
      options: {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        channels: {
          content: process.env.TELEGRAM_CONTENT_CHANNEL,
          gallery: process.env.TELEGRAM_GALLERY_CHANNEL,
          events: process.env.TELEGRAM_EVENTS_CHANNEL,
          volunteers: process.env.TELEGRAM_VOLUNTEERS_CHANNEL,
        },
        refreshInterval: 300000, // 5 minutes
      },
    },
    
    // Error tracking (if configured)
    process.env.SENTRY_DSN && {
      resolve: 'gatsby-plugin-sentry',
      options: {
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
      },
    },
  ].filter(Boolean), // Remove falsy plugins
  
  // Development server configuration
  developMiddleware: (app) => {
    // CORS for development
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
  },
  
  // Build configuration
  flags: {
    PRESERVE_WEBPACK_CACHE: true,
    PRESERVE_FILE_DOWNLOAD_CACHE: true,
    PARALLEL_SOURCING: true,
    DEV_SSR: false,
  },
  
  // GraphQL type generation
  graphqlTypegen: true,
};
