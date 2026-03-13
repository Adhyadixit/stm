# STM Events - Deployment Guide

## 🚀 Production Deployment on Vercel

This guide covers deploying the STM Events website to Vercel.

### 📋 Prerequisites

- Node.js 18+ installed
- Vercel account
- Supabase project configured
- GitHub repository

### 🔧 Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Adhyadixit/stm.git
   cd stm
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local` with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

### 🌐 Vercel Deployment

#### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

#### Option 2: GitHub Integration

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard
   - Deploy

### 🗂️ Project Structure

```
stm-events/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel routes
│   ├── user/              # User panel routes
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API routes
│   └── [...pages]         # Public pages
├── components/            # Reusable components
├── lib/                   # Utilities and configurations
├── public/               # Static assets
├── vercel.json           # Vercel configuration
├── .env.example          # Environment variables template
└── package.json          # Dependencies and scripts
```

### 🛣️ Routes Overview

#### Public Routes
- `/` - Homepage
- `/events` - Events listing
- `/events/[slug]` - Event details
- `/equipment` - Equipment rental
- `/equipment/[id]` - Equipment details
- `/gallery` - Media gallery
- `/about` - About page
- `/contact` - Contact page
- `/services` - Services page
- `/djs` - DJ listings
- `/privacy` - Privacy policy

#### Authentication Routes
- `/login` - User login/signup
- `/admin/login` - Admin login

#### Admin Routes (`/admin/*`)
- `/admin/dashboard` - Admin dashboard
- `/admin/events` - Event management
- `/admin/equipment` - Equipment management
- `/admin/gallery` - Gallery management
- `/admin/djs` - DJ management
- `/admin/contacts` - Contact management

#### User Routes (`/user/*`)
- `/user/dashboard` - User dashboard
- `/user/events` - User's events
- `/user/gallery` - User's gallery
- `/user/profile` - User profile
- `/user/settings` - User settings

### 🔒 Security Considerations

1. **Environment Variables:**
   - Never commit `.env.local` to version control
   - Use Vercel's environment variables for production

2. **Supabase Security:**
   - Enable Row Level Security (RLS) on all tables
   - Use service role key only in server-side code
   - Implement proper authentication checks

3. **Headers:**
   - Security headers are configured in `vercel.json`
   - CSP, XSS protection, and other security measures

### 📊 Performance Optimization

1. **Image Optimization:**
   - Use Next.js Image component
   - Implement lazy loading
   - Use WebP format when possible

2. **Code Splitting:**
   - Automatic with Next.js App Router
   - Dynamic imports for large components

3. **Caching:**
   - Static assets cached for 1 year
   - API responses cached appropriately
   - ISR for dynamic content

### 🔍 Monitoring and Analytics

1. **Vercel Analytics:**
   - Built-in performance monitoring
   - User analytics and insights

2. **Error Tracking:**
   - Implement error boundaries
   - Log errors to monitoring service

### 🚨 Troubleshooting

#### Common Issues

1. **Build Errors:**
   - Check TypeScript types: `npm run type-check`
   - Verify environment variables
   - Ensure all dependencies are installed

2. **Runtime Errors:**
   - Check Supabase connection
   - Verify API endpoints
   - Check browser console for errors

3. **Performance Issues:**
   - Analyze bundle size: `npm run build:analyze`
   - Check Core Web Vitals
   - Optimize images and assets

#### Debug Commands

```bash
# Local development
npm run dev

# Build check
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm run test
```

### 🔄 CI/CD Pipeline

The deployment process includes:

1. **Pre-deployment:**
   - Type checking
   - Linting
   - Build verification

2. **Deployment:**
   - Automatic build on Vercel
   - Environment variable injection
   - Asset optimization

3. **Post-deployment:**
   - Health checks
   - Performance monitoring
   - Error tracking

### 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly navigation
- Optimized images for mobile
- Fast loading times

### 🌍 Internationalization

Ready for multi-language support with:
- next-intl configuration
- Dynamic routing for languages
- Localized content management

### 📈 Scaling Considerations

- Database optimization
- CDN usage
- Load balancing
- Caching strategies

---

## 🎯 Deployment Checklist

Before deploying to production:

- [ ] Environment variables configured
- [ ] Supabase RLS policies enabled
- [ ] All tests passing
- [ ] Build successful locally
- [ ] Performance metrics acceptable
- [ ] Security measures in place
- [ ] Monitoring configured
- [ ] Backup strategies implemented

---

**Happy Deploying! 🚀**
