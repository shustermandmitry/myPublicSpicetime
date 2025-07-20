# Homeless Church App

A nonprofit platform application that provides a complete website and management system for churches and nonprofit organizations.

## Features

### Website (Gatsby + TinaCMS)
- **Static Site Generation**: Fast, secure, and SEO-optimized
- **Content Management**: Easy-to-use CMS with visual editing
- **Accessibility First**: Full ARIA support and keyboard navigation
- **Mobile Responsive**: Works perfectly on all devices
- **GitHub Integration**: Content stored in Git for version control

### Management System (Telegram Bot)
- **Complete Admin Interface**: Manage everything through Telegram
- **Content Publishing**: Post updates directly from Telegram
- **User Management**: Handle permissions and roles
- **Crisis Support**: 24/7 automated support with escalation
- **Donation Tracking**: Venmo, CashApp, PayPal integration

### Automated Setup
- **One-Click Deployment**: Docker-based automated installation
- **Hidden Setup Route**: Secure initialization process
- **Infrastructure Setup**: Complete Telegram ecosystem creation

## Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- GitHub account
- Telegram Bot Token

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd packages/homelessChurchApp
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Development**
   ```bash
   npm run dev
   ```

4. **Production Deployment**
   ```bash
   npm run docker:build
   npm run docker:up
   ```

## Architecture

### Frontend (Gatsby)
- Static site generation for performance
- TinaCMS for content management
- React components with accessibility focus
- Progressive Web App capabilities

### Backend (Node.js/Express)
- RESTful API for content operations
- Telegram bot for management interface
- Webhook handlers for real-time updates
- Authentication and authorization

### Content Management
- **TinaCMS**: Visual content editing
- **GitHub**: Version control and hosting
- **Telegram**: Quick content publishing
- **Automated Sync**: Real-time content updates

### Deployment
- **Docker**: Containerized deployment
- **GitHub Pages**: Static site hosting
- **Webhook Integration**: Automated builds
- **Crisis Escalation**: Private channel alerts

## Configuration

### Environment Variables
See `.env.example` for all required configuration options.

### Telegram Setup
1. Create bot with @BotFather
2. Set webhook URL
3. Configure channels and groups
4. Set up admin permissions

### GitHub Integration
1. Create GitHub repository
2. Configure TinaCMS GitHub provider
3. Set up GitHub Actions for deployment
4. Configure webhook for content updates

## Usage

### Content Management
- Edit content through TinaCMS interface at `/admin`
- Publish updates via Telegram channels
- Manage pages through drag-and-drop builder
- Handle donations and receipts

### Administration
- Access full admin interface through Telegram bot
- Use `/m` command for navigation menu
- Manage users, permissions, and content
- Monitor site analytics and donations

## Development

### Project Structure
```
packages/homelessChurchApp/
├── src/                    # Gatsby source files
│   ├── components/         # React components
│   ├── pages/             # Static pages
│   ├── templates/         # Page templates
│   └── styles/            # CSS and styling
├── server/                # Backend services
│   ├── api/               # API routes
│   ├── telegram/          # Telegram bot
│   └── webhooks/          # Webhook handlers
├── tina/                  # TinaCMS configuration
├── content/               # Content files
└── scripts/               # Setup and deployment
```

### Testing
```bash
npm test              # Run tests
npm run test:watch    # Watch mode
npm run lint          # Code linting
```

## Support

For technical support, create an issue in the GitHub repository or contact the development team.

## License

MIT License - see LICENSE file for details.
