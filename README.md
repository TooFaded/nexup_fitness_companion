# Nexup Fitness Companion

A modern fitness companion app built with Next.js 13+ App Router, TypeScript, and Tailwind CSS.

## Prerequisites

- Node.js 18+ (recommended: v18.18.0)
- npm package manager

## Quickstart

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the environment example file and configure your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key # server only, never client
```

### 3. Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production

```bash
npm run build
npm run start
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Running CI Locally

To run the same checks as the CI pipeline:

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build
npm run build
```

## Technology Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom brand tokens
- **Environment**: Node.js 18+
- **CI/CD**: GitHub Actions