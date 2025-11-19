# Global Vacation Rental Platform - Setup Guide

## Prerequisites

- Node.js 22.x or higher
- MySQL 8.0 or compatible database (TiDB, PlanetScale, etc.)
- pnpm package manager
- Stripe account (for payments)

## Environment Variables

This project requires the following environment variables. Configure them through your hosting platform's settings or create a `.env` file locally:

### Required Variables

```bash
# Database
DATABASE_URL=mysql://user:password@host:port/database

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Stripe Payment
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... or pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Application
VITE_APP_TITLE=Global Vacation Rental Platform
VITE_APP_LOGO=/logo.png
```

### Optional Variables (if using Manus infrastructure)

```bash
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=owner-open-id
OWNER_NAME=Owner Name
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-key
```

## Installation Steps

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd vacation-rental-platform
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with all required variables listed above.

### 3. Setup Database

Run the database migration to create all tables:

```bash
pnpm db:push
```

This command will:
- Create all 21 tables defined in `drizzle/schema.ts`
- Set up indexes and relationships
- Prepare the database for data insertion

### 4. Seed Initial Data

Populate the database with sample data:

```bash
pnpm seed
```

This will create:
- 4 countries (USA, Brazil, France, Japan)
- 8 states
- 4 cities (Miami, Los Angeles, Rio de Janeiro, Nice)
- 8 developments with photos and amenities
- 12 sponsored businesses
- i18n translations for 6 languages (PT, EN, ES, FR, IT, JP)

### 5. Configure Stripe Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 6. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Database Schema

The platform uses 21 tables organized in the following groups:

### Core Tables
- `users` - User accounts (customers, cotistas, admins)
- `translations` - i18n translations for 6 languages

### Geography
- `countries`, `states`, `cities` - Location hierarchy

### Developments
- `developments` - Vacation properties
- `development_photos` - Property images
- `development_amenities` - Property features
- `amenities` - Available amenities catalog

### Sponsored Businesses
- `sponsored_businesses` - Local businesses
- `business_developments` - Business-development links
- `business_cities` - Business-city links

### Cotistas (Fractional Owners)
- `cotistas` - Fractional owner profiles
- `cotista_availability` - Available date slots

### Reservations
- `reservations` - Booking records
- `documents` - Customer documents (ID, proof of address)
- `vouchers` - Stay vouchers issued by cotistas
- `payments` - Payment transactions
- `disputes` - Dispute cases

### Admin
- `audit_notes` - Admin action logs
- `fraud_flags` - Fraud detection flags

## Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Database
pnpm db:push          # Push schema changes to database
pnpm db:studio        # Open Drizzle Studio (database GUI)
pnpm seed             # Seed initial data

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode

# Code Quality
pnpm lint             # Run ESLint
pnpm typecheck        # Run TypeScript checks
```

## Project Structure

```
vacation-rental-platform/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page components
│       ├── lib/           # Utilities (trpc, i18n)
│       └── contexts/      # React contexts
├── server/                # Backend tRPC server
│   ├── _core/            # Core server infrastructure
│   ├── routers.ts        # tRPC API routes
│   ├── db.ts             # Database helpers
│   ├── stripe.ts         # Stripe integration
│   └── upload.ts         # File upload handlers
├── drizzle/              # Database schema & migrations
│   └── schema.ts         # Complete database schema
├── scripts/              # Utility scripts
│   └── seed.mjs          # Database seeding script
└── shared/               # Shared types & constants
```

## User Roles

The platform supports three user roles:

1. **Customer** - Books vacation stays
   - Browse developments
   - Make reservations
   - Upload documents
   - Receive vouchers

2. **Cotista** (Fractional Owner) - Manages property availability
   - Register with ownership proof
   - Set availability and pricing
   - View incoming reservations
   - Upload vouchers for approved bookings

3. **Admin** - Platform management
   - Approve customer documents
   - Verify cotista ownership
   - Review and approve vouchers
   - Manage developments
   - Handle disputes

## Multilingual Support

The platform supports 6 languages:
- Portuguese (PT) - Default
- English (EN)
- Spanish (ES)
- French (FR)
- Italian (IT)
- Japanese (JP)

All UI text, error messages, and email templates use i18n keys stored in the `translations` table.

## Troubleshooting

### Database Connection Issues

If you get connection errors:
1. Verify `DATABASE_URL` format: `mysql://user:password@host:port/database`
2. Ensure database server is running
3. Check firewall rules allow connection to database port
4. For SSL connections, add `?ssl={"rejectUnauthorized":true}` to DATABASE_URL

### Stripe Webhook Failures

If webhooks aren't working:
1. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
2. Check endpoint URL is publicly accessible
3. Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### Build Errors

If build fails:
1. Clear node_modules: `rm -rf node_modules && pnpm install`
2. Clear build cache: `rm -rf .next dist`
3. Check Node.js version: `node --version` (should be 22.x)

## Production Deployment

### 1. Build the Application

```bash
pnpm build
```

### 2. Set Environment Variables

Configure all required environment variables in your hosting platform.

### 3. Run Database Migration

```bash
pnpm db:push
```

### 4. Seed Initial Data (Optional)

```bash
pnpm seed
```

### 5. Start Production Server

```bash
pnpm start
```

## Support

For issues or questions:
- Check the [TODO.md](./todo.md) file for known limitations
- Review error logs in the console
- Verify all environment variables are set correctly

## License

[Your License Here]
