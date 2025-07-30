# Skill Sheet Maker

A modern web application for creating and managing skill sheets, built with Next.js, TypeScript, and Prisma.

## Overview

This project is a migration from a Rust+Tauri desktop application to a Next.js web application optimized for deployment on Vercel. It enables users to create, manage, and export professional skill sheets with features including:

- User profile management
- Skill and qualification tracking
- MBTI personality assessment results
- Career history management
- PDF export functionality (planned)

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS + daisyUI
- **Deployment**: Vercel
- **Architecture**: Bulletproof-React structure

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd skill-sheet-maker-ts
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` and fill in your database connection string and other configuration.

4. Set up the database:
```bash
npm run db:generate
npm run db:migrate
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed the database

## Project Structure

```
src/
├── app/                 # Next.js App Router pages and API routes
├── features/            # Feature-based modules (Bulletproof-React)
│   ├── users/           # User management
│   ├── skills/          # Skill management  
│   └── auth/            # Authentication
├── lib/                 # Shared utilities and configurations
├── components/          # Shared UI components
├── providers/           # Application providers
└── types/               # TypeScript type definitions

prisma/
└── schema.prisma        # Database schema
```

## Database Schema

The application uses PostgreSQL with the following main entities:
- Users
- Skills and UserSkills (many-to-many)
- Qualifications
- MBTI Results
- Career History

## Deployment

This application is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

For database, consider using:
- Vercel Postgres
- Neon
- PlanetScale
- Any PostgreSQL provider

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is private and proprietary.