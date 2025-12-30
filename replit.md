# Alon Hosting PH - Recipe Generator

## Overview

This is a full-stack web application for Alon Hosting PH that serves as a "Recipe Generator" - essentially an order/record management system. The application allows users to create and view hosting-related records (called "recipes") with auto-generated public IDs in the format `ALON-XXXXXX`. Built with a React frontend and Express backend, it uses PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (professional Blue/White theme)
- **Animations**: Framer Motion for smooth transitions
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/` (home, history, not-found)
- Reusable components in `client/src/components/`
- Custom hooks in `client/src/hooks/`
- Shared utilities in `client/src/lib/`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Validation**: Zod schemas shared between frontend and backend
- **API Design**: RESTful endpoints defined in `shared/routes.ts`

The server structure:
- `server/index.ts` - Express app setup and middleware
- `server/routes.ts` - API route handlers
- `server/storage.ts` - Database access layer (repository pattern)
- `server/db.ts` - Database connection configuration

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `shared/schema.ts` - Drizzle table definitions and Zod schemas
- `shared/routes.ts` - API route contracts with input/output types

This ensures type safety across the full stack.

### Data Model
Single table `recipes` with fields:
- `id` (serial primary key)
- `publicId` (unique text, format: ALON-XXXXXX)
- `fill` (text - main content)
- `info` (text - additional information)
- `createdAt` (timestamp)

### Build Process
- Development: `tsx` for running TypeScript directly
- Production: Custom build script using esbuild (server) and Vite (client)
- Output: `dist/` directory with bundled server and static client files

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migrations and schema push (`npm run db:push`)

### Third-Party Libraries
- **@tanstack/react-query**: Server state management and caching
- **date-fns**: Date formatting utilities
- **framer-motion**: Animation library
- **nanoid**: Unique ID generation
- **zod**: Schema validation (shared between frontend/backend)

### UI Framework Dependencies
- **Radix UI**: Headless component primitives (dialog, dropdown, toast, etc.)
- **shadcn/ui**: Pre-built component library using Radix primitives
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Tools
- **Vite**: Frontend build tool with HMR
- **esbuild**: Fast JavaScript bundler for server
- **TypeScript**: Type checking across the stack