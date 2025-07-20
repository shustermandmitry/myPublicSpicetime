# Role-Based Documentation Subdomain Specification

## Overview

The nonprofit platform will include a comprehensive documentation subdomain (`docs.homelesschurch.org`) that provides role-specific onboarding, reference materials, and operational guides. This documentation system adapts content visibility and navigation based on user roles and permissions.

## Architecture

### Subdomain Structure
```
docs.homelesschurch.org/
├── /                          # Public documentation (visitors, volunteers)
├── /admin/                    # Administrative documentation
├── /staff/                    # Staff-specific guides
├── /volunteer/                # Volunteer onboarding and guides
├── /donor/                    # Donor information and transparency
├── /technical/                # Technical documentation for developers
└── /api/                      # API documentation
```

### Role-Based Access Control

#### **Public Access (No Authentication)**
- General information about the organization
- Volunteer signup process
- Basic service information
- Contact information
- Accessibility guidelines

#### **Volunteer Role**
- Volunteer onboarding checklist
- Service schedules and procedures
- Safety protocols
- Communication guidelines
- Resource locations

#### **Staff Role**
- All volunteer documentation
- Administrative procedures
- Crisis response protocols
- Content management guides
- Reporting procedures

#### **Admin Role**
- All staff documentation
- System administration guides
- User management procedures
- Technical configuration
- Security protocols

#### **Donor Role**
- Financial transparency reports
- Impact documentation
- Donation tracking
- Tax receipt information
- Stewardship materials

#### **Technical Role**
- API documentation
- System architecture
- Deployment guides
- Troubleshooting
- Development workflows

## Content Categories

### 1. **Onboarding Documentation**

#### New Volunteer Onboarding
```markdown
# Welcome to The Homeless Church - Volunteer Guide

## Getting Started Checklist
- [ ] Complete volunteer application
- [ ] Attend orientation session
- [ ] Review safety protocols
- [ ] Get Telegram access
- [ ] Shadow experienced volunteer

## Your First Day
- Arrival procedures
- Check-in process
- Key contacts
- Emergency procedures
```

#### Staff Onboarding
```markdown
# Staff Onboarding Guide

## Week 1: System Access
- [ ] Telegram admin access
- [ ] Website CMS access
- [ ] Documentation access
- [ ] Crisis response training

## Week 2: Operational Training
- [ ] Content management
- [ ] Volunteer coordination
- [ ] Reporting procedures
```

### 2. **Operational Documentation**

#### Content Management Guide
```markdown
# Content Management via Telegram

## Publishing Content
1. Post to appropriate channel
2. Use hashtag system
3. Website auto-updates
4. Verify publication

## Content Types
- #SERVICE - Service announcements
- #EVENT - Special events
- #VOLUNTEER - Volunteer opportunities
- #CRISIS - Emergency situations
```

#### Crisis Response Protocols
```markdown
# Crisis Response Documentation

## Immediate Response (Staff Only)
1. Assess situation severity
2. Contact emergency services if needed
3. Notify crisis team via private channel
4. Document incident

## Escalation Procedures
- Level 1: On-site staff
- Level 2: Crisis team
- Level 3: External services
```

### 3. **Technical Documentation**

#### API Reference
```markdown
# Homeless Church API Documentation

## Authentication
All API requests require authentication via JWT token.

## Endpoints

### Content Management
- GET /api/content/services
- POST /api/content/publish
- PUT /api/content/update/:id

### User Management
- GET /api/users/volunteers
- POST /api/users/register
```

#### System Architecture
```markdown
# System Architecture Overview

## Components
- Gatsby Static Site
- TinaCMS Content Management
- Telegram Bot Integration
- Express.js API Server
- MongoDB Database

## Data Flow
Telegram → API → Database → CMS → Static Site
```

## Implementation Plan

### Phase 1: Core Documentation Structure
1. **Create Gatsby documentation site**
   - Separate subdomain configuration
   - Role-based routing
   - Authentication integration

2. **Content Organization**
   - Markdown-based content
   - Role-based content filtering
   - Search functionality

3. **Navigation System**
   - Role-aware navigation menus
   - Breadcrumb navigation
   - Cross-references between sections

### Phase 2: Interactive Features
1. **Onboarding Checklists**
   - Progress tracking
   - Interactive checkboxes
   - Completion notifications

2. **Search and Discovery**
   - Full-text search
   - Tag-based filtering
   - Related content suggestions

3. **Feedback System**
   - Documentation improvement suggestions
   - User feedback collection
   - Content rating system

### Phase 3: Advanced Features
1. **Personalized Dashboards**
   - Role-specific landing pages
   - Recent updates
   - Relevant announcements

2. **Integration Features**
   - Telegram deep links
   - CMS integration
   - API documentation with live examples

## Technical Implementation

### Gatsby Configuration
```javascript
// docs-gatsby-config.js
module.exports = {
  siteMetadata: {
    title: 'Homeless Church Documentation',
    siteUrl: 'https://docs.homelesschurch.org',
  },
  
  plugins: [
    // Role-based content filtering
    {
      resolve: './plugins/gatsby-plugin-role-based-content',
      options: {
        roles: ['public', 'volunteer', 'staff', 'admin', 'donor', 'technical'],
        authProvider: 'telegram',
      },
    },
    
    // Documentation-specific plugins
    'gatsby-plugin-mdx',
    'gatsby-remark-autolink-headers',
    'gatsby-remark-prismjs',
    
    // Search functionality
    {
      resolve: 'gatsby-plugin-local-search',
      options: {
        name: 'docs',
        engine: 'flexsearch',
        query: `
          query {
            allMdx {
              nodes {
                id
                frontmatter {
                  title
                  role
                  category
                }
                excerpt
                slug
              }
            }
          }
        `,
      },
    },
  ],
};
```

### Role-Based Content Plugin
```javascript
// plugins/gatsby-plugin-role-based-content/gatsby-node.js
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;
  
  const result = await graphql(`
    query {
      allMdx {
        nodes {
          id
          slug
          frontmatter {
            title
            role
            category
          }
        }
      }
    }
  `);
  
  result.data.allMdx.nodes.forEach(node => {
    const { role, category } = node.frontmatter;
    
    createPage({
      path: `/${role}/${category}/${node.slug}`,
      component: require.resolve('./src/templates/doc-page.js'),
      context: {
        id: node.id,
        role,
        category,
      },
    });
  });
};
```

### Authentication Integration
```javascript
// src/components/AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('public');
  
  useEffect(() => {
    // Check Telegram authentication
    const telegramAuth = window.Telegram?.WebApp?.initDataUnsafe;
    if (telegramAuth?.user) {
      setUser(telegramAuth.user);
      // Determine role based on user permissions
      determineUserRole(telegramAuth.user).then(setRole);
    }
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

## Content Structure

### Directory Organization
```
content/
├── public/                    # Public documentation
│   ├── about/
│   ├── services/
│   └── volunteer-signup/
├── volunteer/                 # Volunteer-specific content
│   ├── onboarding/
│   ├── procedures/
│   └── resources/
├── staff/                     # Staff documentation
│   ├── onboarding/
│   ├── crisis-response/
│   └── content-management/
├── admin/                     # Administrative guides
│   ├── system-admin/
│   ├── user-management/
│   └── security/
├── donor/                     # Donor information
│   ├── transparency/
│   ├── impact-reports/
│   └── stewardship/
└── technical/                 # Technical documentation
    ├── api/
    ├── architecture/
    └── deployment/
```

### Content Frontmatter
```yaml
---
title: "Volunteer Onboarding Checklist"
role: "volunteer"
category: "onboarding"
order: 1
lastUpdated: "2024-01-15"
tags: ["onboarding", "checklist", "new-volunteer"]
relatedDocs:
  - "/volunteer/procedures/safety-protocols"
  - "/volunteer/resources/contact-list"
---
```

## Benefits

### For Organizations
- **Streamlined Onboarding**: Role-specific guides reduce confusion
- **Consistent Procedures**: Documented processes ensure consistency
- **Knowledge Retention**: Institutional knowledge is preserved
- **Compliance**: Documentation supports regulatory requirements

### For Users
- **Relevant Content**: Only see documentation relevant to their role
- **Easy Navigation**: Role-based menus and search
- **Progress Tracking**: Onboarding checklists and completion tracking
- **Always Updated**: Integration with live systems ensures accuracy

### For Administrators
- **Centralized Management**: Single source of truth for all documentation
- **Version Control**: Git-based content management
- **Analytics**: Track documentation usage and effectiveness
- **Feedback Loop**: Collect and act on user feedback

## Success Metrics

### Usage Metrics
- Documentation page views by role
- Search query analysis
- Onboarding completion rates
- User feedback scores

### Operational Metrics
- Reduced support requests
- Faster volunteer onboarding
- Improved procedure compliance
- Enhanced crisis response times

This role-based documentation system will significantly improve the nonprofit platform by providing structured, accessible, and relevant information to all stakeholders while maintaining appropriate access controls and security.
