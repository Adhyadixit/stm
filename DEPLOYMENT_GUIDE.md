# STM Events - Deployment Guide

## Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

Access the site at: http://localhost:3000

## Environment Variables

Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=https://ukzpuykdgmysgtotdblo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrenB1eWtkZ215c2d0b3RkYmxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjM5NTksImV4cCI6MjA4ODk5OTk1OX0.40DyOKgAgQqLX1zZL8Op-VGZx9PVYZzez7-S9QmY-dU
```

## Supabase Database

### Connection Details
- **Project ID**: ukzpuykdgmysgtotdblo
- **Region**: us-east-1
- **Database**: PostgreSQL 17.6.1
- **API URL**: https://ukzpuykdgmysgtotdblo.supabase.co

### Database Schema
All tables created with migrations:
- events
- gallery
- equipment
- resident_djs
- services
- content_pages
- contact_submissions

### Sample Data
Sample data has been inserted for testing:
- 3 events
- 4 gallery items
- 4 equipment items
- 3 resident DJs
- 4 services

## Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

### Option 3: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Production Checklist

### Before Deployment
- [ ] Update environment variables for production
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Add real event images
- [ ] Configure email service for contact forms
- [ ] Set up analytics (Google Analytics, Plausible, etc.)
- [ ] Add SEO meta tags
- [ ] Configure CDN for media assets
- [ ] Set up error monitoring (Sentry)
- [ ] Configure backup strategy

### Security
- [ ] Review RLS policies in Supabase
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set up CSP headers
- [ ] Enable HTTPS only
- [ ] Add security headers

### Performance
- [ ] Enable image optimization
- [ ] Configure caching headers
- [ ] Minify assets
- [ ] Enable compression
- [ ] Set up CDN

## Admin Panel Setup

To add admin functionality:

1. Install Supabase Auth UI:
```bash
npm install @supabase/auth-ui-react @supabase/auth-ui-shared
```

2. Create admin routes in `app/admin/`
3. Implement authentication guards
4. Add CRUD interfaces for:
   - Events management
   - Gallery uploads
   - Equipment management
   - DJ profiles
   - Content editing

## Monitoring

### Recommended Tools
- **Uptime**: UptimeRobot, Pingdom
- **Analytics**: Plausible, Google Analytics
- **Errors**: Sentry
- **Performance**: Vercel Analytics, Lighthouse CI

## Backup Strategy

### Database Backups
Supabase provides automatic daily backups. For additional safety:
- Set up weekly manual backups
- Export critical data regularly
- Store backups in separate location

### Code Backups
- Push to GitHub/GitLab
- Tag releases
- Maintain changelog

## Support & Maintenance

### Regular Tasks
- Monitor error logs
- Review contact form submissions
- Update event listings
- Add new gallery content
- Check site performance
- Update dependencies monthly

### Emergency Contacts
- Supabase Support: https://supabase.com/support
- Vercel Support: https://vercel.com/support

## Troubleshooting

### Common Issues

**Build Failures**
- Check Node.js version (18+)
- Clear `.next` folder
- Verify environment variables

**Database Connection**
- Verify Supabase URL and key
- Check RLS policies
- Ensure tables exist

**Styling Issues**
- Clear Tailwind cache
- Rebuild CSS
- Check PostCSS config

## Performance Targets

- **Lighthouse Score**: 90+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Largest Contentful Paint**: < 2.5s

## SEO Optimization

Add to each page:
```tsx
export const metadata: Metadata = {
  title: 'Page Title - STM Events',
  description: 'Page description',
  openGraph: {
    title: 'Page Title',
    description: 'Page description',
    images: ['/og-image.jpg'],
  },
}
```

## Analytics Setup

### Google Analytics
```tsx
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

## Contact Form Email Notifications

Set up with Supabase Edge Functions or third-party service:
- SendGrid
- Resend
- AWS SES

## Multilingual Implementation

To enable German language:

1. Install next-intl (already in dependencies)
2. Create locale files
3. Add language switcher
4. Update content queries to use locale

---

**Need Help?** Refer to PROJECT_SUMMARY.md for complete feature documentation.
