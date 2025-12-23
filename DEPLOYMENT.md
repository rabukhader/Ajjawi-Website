# Deployment Guide

## Option 1: Vercel (Recommended - Easiest)

Vercel is made by the Next.js team and offers the best Next.js deployment experience.

### Steps:

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with your Git provider
   - Click "Add New Project"
   - Import your repository
   - Vercel will auto-detect Next.js settings
   - Add environment variable if needed:
     - `NEXT_PUBLIC_API_BASE_URL` = `http://3.239.1.159:8089`
   - Click "Deploy"
   - Your site will be live in ~2 minutes!

3. **Custom Domain (Optional):**
   - Go to Project Settings → Domains
   - Add your custom domain

---

## Option 2: Netlify

### Steps:

1. **Push code to Git** (same as above)

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Add environment variable:
     - `NEXT_PUBLIC_API_BASE_URL` = `http://3.239.1.159:8089`
   - Click "Deploy site"

---

## Option 3: Self-Hosting (VPS/Server)

### Prerequisites:
- Node.js 18+ installed
- PM2 (process manager) recommended

### Steps:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Install PM2 globally:**
   ```bash
   npm install -g pm2
   ```

3. **Start the application:**
   ```bash
   pm2 start npm --name "ajjawi-website" -- start
   ```

4. **Save PM2 configuration:**
   ```bash
   pm2 save
   pm2 startup
   ```

5. **Set up Nginx reverse proxy (recommended):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Set environment variable:**
   ```bash
   export NEXT_PUBLIC_API_BASE_URL=http://3.239.1.159:8089
   ```

---

## Option 4: Docker Deployment

### Create Dockerfile:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_PUBLIC_API_BASE_URL=http://3.239.1.159:8089

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Update next.config.js for standalone output:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
}

module.exports = nextConfig
```

### Build and run:

```bash
docker build -t ajjawi-website .
docker run -p 3000:3000 ajjawi-website
```

---

## Environment Variables

For all deployment options, make sure to set:

- `NEXT_PUBLIC_API_BASE_URL` = `http://3.239.1.159:8089`

**Note:** If your API URL might change, consider using environment variables instead of hardcoding.

---

## Pre-Deployment Checklist

- [ ] Test build locally: `npm run build`
- [ ] Test production build: `npm start`
- [ ] Check all environment variables are set
- [ ] Verify API endpoints are accessible
- [ ] Test all pages and functionality
- [ ] Ensure images/assets are loading correctly
- [ ] Check mobile responsiveness

---

## Quick Deploy Commands

### Vercel CLI:
```bash
npm i -g vercel
vercel
```

### Netlify CLI:
```bash
npm i -g netlify-cli
netlify deploy --prod
```

