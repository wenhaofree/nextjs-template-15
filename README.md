# ShipSaas

A modern, full-stack SaaS application template built with Next.js 15, featuring enterprise-grade authentication, payment processing, internationalization, and a comprehensive UI component system. This production-ready template provides everything you need to launch your SaaS product quickly and efficiently.

## 🌟 Key Features

- 🚀 **Modern Tech Stack**: Built on Next.js 15 with React 19 RC and TypeScript
- ⚡️ **Blazing Fast**: Turbopack support for lightning-fast development experience
- 🎨 **Beautiful UI**: Radix UI + Tailwind CSS + Framer Motion animations
- 🌐 **Internationalization**: Complete i18n solution with next-intl (English & Chinese)
- 🔐 **Multi-Auth Support**: NextAuth.js v4 with Google, GitHub, email/password, and Google One Tap
- 💳 **Payment Integration**: Full Stripe integration with subscriptions and one-time payments
- 📊 **Database Management**: Prisma ORM with PostgreSQL/MySQL support
- 🔔 **Enhanced UX**: Sonner notifications and interactive cursor effects
- 📱 **Responsive Design**: Fully optimized for mobile and desktop
- 🧪 **Testing Suite**: Comprehensive automated testing with Jest
- 🎯 **SEO Optimized**: Complete metadata and page optimization
- 🐳 **Docker Ready**: Containerized deployment support

## 🏗️ Architecture Overview

ShipSaas follows modern full-stack architecture patterns:

- **Frontend**: React 19 with Next.js 15 App Router
- **Backend**: Next.js API routes with server actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with multiple providers
- **Payments**: Stripe with webhook handling
- **Styling**: Tailwind CSS with design system
- **State Management**: React Server Components + Client Components
- **Internationalization**: next-intl with dynamic routing

## 🛠️ Technology Stack

### Core Framework
- **Next.js 15.2.3** - Full-stack React framework with App Router
- **React 18.2.0** - Modern React with concurrent features
- **TypeScript 5.x** - Type-safe JavaScript development

### UI & Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
  - Accordion, Dialog, Dropdown Menu, Avatar, Tooltip, etc.
- **Framer Motion 12.6.2** - Production-ready motion library
- **Lucide React** - Beautiful & consistent icon library
- **Shadcn/ui** - Re-usable components built on Radix UI

### Authentication & Security
- **NextAuth.js 4.24.11** - Complete authentication solution
  - Google OAuth integration
  - GitHub OAuth integration
  - Google One Tap login
  - Credentials-based authentication
- **bcryptjs** - Password hashing and verification

### Payment Processing
- **Stripe 17.7.0** - Complete payment infrastructure
  - One-time payments
  - Subscription billing
  - Webhook event handling
  - Order management system

### Database & ORM
- **Prisma 6.6.0** - Next-generation ORM
- **PostgreSQL** - Primary database (MySQL also supported)
- **Prisma Studio** - Visual database management

### Internationalization
- **next-intl 3.26.3** - Type-safe internationalization
- **Multi-language support** - English and Chinese
- **Dynamic routing** - Locale-based URL structure

### Development Tools
- **Turbopack** - Ultra-fast bundler for development
- **ESLint** - Code quality and consistency
- **Jest 29.7.0** - JavaScript testing framework
- **Docker** - Containerization and deployment

## 📋 Prerequisites

- **Node.js 18.17+** - JavaScript runtime environment
- **pnpm 10.10.0+** - Package manager (recommended)
- **PostgreSQL 13+** or **MySQL 8.0+** - Database
- **Docker** - For containerized deployment (optional)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ShipSaas.git
cd ShipSaas
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

```bash
cp .env.example .env.local
```

Configure the following environment variables:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| **Database Configuration** |
| `DATABASE_URL` | Database connection URL | `postgresql://user:pass@host:5432/db` | ✅ |
| **Authentication Configuration** |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | `your-secret-key` | ✅ |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` | ✅ |
| **Google OAuth** |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | `google-oauth-id` | ❌ |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | `google-oauth-secret` | ❌ |
| `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED` | Enable Google login | `true` | ❌ |
| `NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED` | Enable Google One Tap | `true` | ❌ |
| **GitHub OAuth** |
| `AUTH_GITHUB_ID` | GitHub OAuth Client ID | `github-oauth-id` | ❌ |
| `AUTH_GITHUB_SECRET` | GitHub OAuth Client Secret | `github-oauth-secret` | ❌ |
| `NEXT_PUBLIC_AUTH_GITHUB_ENABLED` | Enable GitHub login | `true` | ❌ |
| **Stripe Payment** |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe publishable key | `pk_test_xxx` | ❌ |
| `STRIPE_PRIVATE_KEY` | Stripe secret key | `sk_test_xxx` | ❌ |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_xxx` | ❌ |

### 4. Database Setup

```bash
# Pull database schema
pnpm db:pull

# Push schema changes
pnpm db:push

# Generate Prisma Client
pnpm db:generate

# Or sync everything at once
pnpm db:sync
```

### 5. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application

## 📚 Features Deep Dive

### 🔐 Authentication System

The application supports multiple authentication methods:

1. **Google OAuth Login**
   - Configure `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`
   - Set `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true`

2. **GitHub OAuth Login**
   - Configure `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`
   - Set `NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true`

3. **Google One Tap Login**
   - Set `NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED=true`
   - Provides seamless authentication experience

4. **Email/Password Authentication**
   - Built-in user registration and login
   - Secure password hashing with bcryptjs

### 💳 Payment System

Comprehensive Stripe integration supporting:

- **One-time Payments**: Single purchase transactions
- **Subscription Billing**: Monthly/yearly recurring payments
- **Webhook Processing**: Automatic payment status updates
- **Order Management**: Complete order history and tracking
- **Multi-currency Support**: Global payment processing

### 🌐 Internationalization

- **Multi-language Support**: English (`en`) and Chinese (`zh`)
- **Dynamic Routing**: Locale-based URLs (`/en/...` and `/zh/...`)
- **Automatic Language Detection**: Browser preference detection
- **Type-safe Translations**: Complete translation file management
- **SEO Optimized**: Localized metadata and sitemap generation

### 🎨 UI Components

Rich collection of production-ready components:

- **Header**: Responsive navigation with language switching
- **Hero Section**: Animated landing section with gradient backgrounds
- **Feature Sections**: Bento Grid layout for feature showcases
- **Stats Section**: Animated statistics display
- **Pricing Section**: Dynamic pricing tables with Stripe integration
- **Testimonials**: Customer review carousel
- **FAQ Section**: Collapsible frequently asked questions
- **CTA Section**: Call-to-action areas
- **Footer**: Comprehensive footer with links and information

### 📊 Database Schema

Prisma ORM with the following core models:

- **User**: User profiles with multi-provider authentication support
- **Order**: Order management with payment status tracking
- **Soft Delete**: Built-in soft delete functionality
- **Timestamps**: Automatic created/updated timestamp tracking

## 🛠️ Available Scripts

### Development Commands
```bash
pnpm dev          # Start development server (with Turbopack)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint code quality checks
```

### Database Commands
```bash
pnpm db:push      # Push database schema changes
pnpm db:pull      # Pull database schema
pnpm db:generate  # Generate Prisma Client
pnpm db:studio    # Launch Prisma Studio
pnpm db:sync      # Sync database schema (pull + push + generate)
```

### Testing Commands
```bash
pnpm test:db            # Run database tests
pnpm test:db:docker     # Run database tests with Docker
pnpm test:db:setup      # Setup test database
pnpm docker:up          # Start Docker containers
pnpm docker:down        # Stop Docker containers
```

## 📁 Project Structure

```
ShipSaas/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # Internationalized routes
│   │   │   ├── auth/          # Authentication pages
│   │   │   ├── orders/        # Order management pages
│   │   │   ├── profile/       # User profile pages
│   │   │   └── page.tsx       # Landing page
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth.js endpoints
│   │   │   ├── stripe/        # Stripe payment APIs
│   │   │   ├── orders/        # Order management APIs
│   │   │   └── users/         # User management APIs
│   │   ├── actions.ts         # Server Actions
│   │   ├── globals.css        # Global styles
│   │   └── providers.tsx      # Global providers
│   ├── components/            # React components
│   │   ├── sections/          # Page section components
│   │   │   ├── Hero.tsx       # Landing hero section
│   │   │   ├── Feature2.tsx   # Feature showcase
│   │   │   ├── Pricing.tsx    # Pricing tables
│   │   │   ├── Stats.tsx      # Statistics display
│   │   │   ├── Testimonial.tsx # Customer testimonials
│   │   │   ├── FAQ.tsx        # FAQ accordion
│   │   │   └── CTA.tsx        # Call-to-action
│   │   ├── ui/                # Base UI components
│   │   │   ├── button.tsx     # Button component
│   │   │   ├── bento-grid.tsx # Bento grid layout
│   │   │   ├── footer-section.tsx # Footer component
│   │   │   └── sheet.tsx      # Sheet/drawer component
│   │   ├── Header.tsx         # Navigation header
│   │   ├── ThemeToggle.tsx    # Dark/light mode toggle
│   │   └── GoogleOneTapWrapper.tsx # Google One Tap integration
│   ├── i18n/                  # Internationalization
│   │   ├── locales/           # Locale configurations
│   │   ├── request.ts         # i18n request handler
│   │   └── routing.ts         # Routing configuration
│   ├── lib/                   # Utility functions
│   │   ├── prisma.ts          # Database connection
│   │   └── utils.ts           # Common utilities
│   ├── tests/                 # Test files
│   │   ├── db/                # Database tests
│   │   ├── jest.config.js     # Jest configuration
│   │   └── setup.ts           # Test setup
│   └── types/                 # TypeScript type definitions
├── messages/                  # Translation files
│   ├── en.json                # English translations
│   └── zh.json                # Chinese translations
├── prisma/                    # Prisma configuration
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── .env.example               # Environment variables template
├── docker-compose.yml         # Docker configuration
├── middleware.ts              # Next.js middleware
└── tailwind.config.ts         # Tailwind CSS configuration
```

## ⚙️ Configuration

### Database Configuration
- **PostgreSQL** (primary) and **MySQL** support
- Secure connections with SSL support
- **Prisma ORM** for type-safe database operations
- Built-in connection pooling and optimization

### Authentication Configuration
- **NextAuth.js** with multiple provider support
- **JWT** and **session** strategies
- **CSRF** protection enabled
- **Secure cookie** configuration

## 🔌 API Routes

### Authentication APIs
- `GET/POST /api/auth/*` - NextAuth.js authentication endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/sync-user` - User synchronization

### Payment APIs
- `POST /api/stripe` - Create Stripe checkout session
- `POST /api/stripe/webhook` - Stripe webhook handler
- `GET /api/orders` - Retrieve user orders

### User Management APIs
- `GET /api/users` - User management endpoints
- `GET /api/posts` - Content management (if applicable)

## 🎯 Development Guide

### 1. Adding New Features
1. Create new page sections in `src/components/sections/`
2. Add translations in `messages/en.json` and `messages/zh.json`
3. Create new pages in `src/app/[locale]/`
4. Utilize utility functions from `src/lib/`

### 2. Creating UI Components
1. Add base components in `src/components/ui/`
2. Follow Radix UI + Tailwind CSS design patterns
3. Ensure dark mode compatibility
4. Include proper TypeScript types

### 3. Database Operations
1. Define models in `prisma/schema.prisma`
2. Run `pnpm db:push` to sync database
3. Use `src/lib/prisma.ts` for database operations
4. Generate types with `pnpm db:generate`

### 4. Adding Authentication Providers
1. Configure provider in `src/auth.config.ts`
2. Add environment variables
3. Update UI components for new provider
4. Test authentication flow

## 🔧 Authentication Setup Guide

### GitHub OAuth Configuration

When setting up GitHub OAuth authentication, follow these important steps:

1. **GitHub OAuth App Setup**
   - Visit GitHub Developer Settings (https://github.com/settings/developers)
   - Create a new OAuth App with your project name (e.g., "ShipSaas")
   - Set Homepage URL to match your `NEXTAUTH_URL` environment variable

2. **Callback URL Configuration**
   - Callback URL format: `{your-domain}/api/auth/callback/github`
   - Local development example: `http://localhost:3000/api/auth/callback/github`
   - **Important**: `localhost` and `127.0.0.1` are treated as different domains

3. **Environment Variables**
   ```bash
   # GitHub authentication credentials
   AUTH_GITHUB_ID=your-github-client-id
   AUTH_GITHUB_SECRET=your-github-client-secret
   NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true

   # Ensure NEXTAUTH_URL matches your GitHub OAuth app domain
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Common Issues & Solutions**
   - **`redirect_uri is not associated with this application`**:
     - Verify callback URL in GitHub OAuth app matches exactly
     - Ensure consistent domain format (localhost vs 127.0.0.1)
     - Check port number matches

   - **`Missing GitHub client ID or secret`**:
     - Verify environment variables are correctly set
     - Ensure credentials match GitHub OAuth app settings

   - **Request timeout errors**:
     - Usually network connectivity issues
     - Try disabling proxy/VPN temporarily
     - GitHub API may be temporarily unavailable
     - Consider increasing timeout in `auth.config.ts`

5. **Multi-Environment Setup**
   - Create separate OAuth apps for development/production
   - Or update callback URLs when deploying to different environments

## 🧪 Testing

The project includes comprehensive automated testing for database operations and application logic.

### Test Coverage

- **Database Connection Tests**: Verify database connectivity
- **Schema Validation Tests**: Validate table structure and relationships
- **Field Type Tests**: Check data types and constraints
- **Relationship Tests**: Test model associations
- **Soft Delete Tests**: Verify soft delete functionality

### Running Tests

**Local Database Testing:**
```bash
pnpm test:db
```

**Docker Environment Testing (Recommended):**
```bash
pnpm test:db:docker
```

This will:
1. Start PostgreSQL in Docker container
2. Execute database migrations
3. Run all test suites
4. Automatically clean up test environment

### Test Configuration

- **Jest** for test framework
- **TypeScript** support with ts-jest
- **Isolated test database** for safe testing
- **Automatic setup/teardown** for clean test runs

## 🚀 Deployment

### Vercel Deployment (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2FShipSaas&env=DATABASE_URL,NEXTAUTH_SECRET,AUTH_GOOGLE_ID,AUTH_GOOGLE_SECRET,AUTH_GITHUB_ID,AUTH_GITHUB_SECRET,NEXT_PUBLIC_STRIPE_PUBLIC_KEY,STRIPE_PRIVATE_KEY,STRIPE_WEBHOOK_SECRET&project-name=shipsaas&repository-name=shipsaas)

**Deployment Steps:**

1. **Preparation**
   ```bash
   # Fork this repository to your GitHub account
   git clone https://github.com/your-username/ShipSaas.git
   ```

2. **Deploy to Vercel**
   - Visit [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables (see list below)
   - Click "Deploy"

3. **Required Environment Variables**
   ```bash
   # Database
   DATABASE_URL=your_database_url

   # Authentication
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=https://your-domain.vercel.app

   # OAuth (optional)
   AUTH_GOOGLE_ID=your_google_client_id
   AUTH_GOOGLE_SECRET=your_google_client_secret
   AUTH_GITHUB_ID=your_github_client_id
   AUTH_GITHUB_SECRET=your_github_client_secret

   # Stripe (optional)
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_xxx
   STRIPE_PRIVATE_KEY=sk_live_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

### Docker Deployment

```bash
# Build the image
docker build -t shipsaas .

# Run the container
docker run -p 3000:3000 --env-file .env shipsaas
```

### Self-Hosted Deployment

```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

### Database Setup for Production

1. **Set up PostgreSQL database** (recommended providers: Supabase, Railway, PlanetScale)
2. **Configure DATABASE_URL** in your environment variables
3. **Run database migrations**:
   ```bash
   pnpm db:push
   ```

## 🤝 Contributing

We welcome all forms of contributions to make ShipSaas better!

### Contributing Workflow

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/ShipSaas.git
   cd ShipSaas
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Development & Testing**
   ```bash
   pnpm dev          # Start development server
   pnpm test:db      # Run tests
   pnpm lint         # Check code quality
   ```

4. **Commit Changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```

5. **Push & Create PR**
   ```bash
   git push origin feature/amazing-feature
   ```

### Code Standards

- **TypeScript**: Use TypeScript for type-safe development
- **ESLint**: Follow configured linting rules
- **Testing**: Add tests for new features
- **Documentation**: Update relevant documentation
- **Commit Messages**: Use conventional commit format

### Development Best Practices

- **Component Structure**: Follow established component patterns
- **State Management**: Use React Server Components where possible
- **Performance**: Optimize for Core Web Vitals
- **Accessibility**: Ensure components are accessible
- **Internationalization**: Add translations for new text content

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Project Author**: WenHaoFree
- **Email**: fuwenhao945@gmail.com
- **GitHub**: [https://github.com/wenhaofree](https://github.com/wenhaofree)

## 🙏 Acknowledgments

Special thanks to these amazing open-source projects:

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [NextAuth.js](https://next-auth.js.org/) - Complete authentication solution
- [Stripe](https://stripe.com/) - Payment processing platform
- [Framer Motion](https://www.framer.com/motion/) - Production-ready motion library

## 🎯 Roadmap

- [x] ✅ Multi-provider authentication system
- [x] ✅ Stripe payment integration
- [x] ✅ Comprehensive testing suite
- [x] ✅ Internationalization support
- [x] ✅ Responsive UI design
- [x] ✅ Dark/light theme support
- [ ] 🔄 Admin dashboard
- [ ] 🔄 Email notification system
- [ ] 🔄 Additional payment providers
- [ ] 🔄 Mobile application
- [ ] 🔄 Advanced analytics
- [ ] 🔄 Multi-tenant support

## 🌟 Show Your Support

If this project helped you, please consider:
- ⭐ **Starring** the repository
- 🐛 **Reporting** bugs and issues
- 💡 **Suggesting** new features
- 🤝 **Contributing** to the codebase

---

**Built with ❤️ by the ShipSaas team**
