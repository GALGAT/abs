# AI Job Application Platform

## Overview

This is a full-stack job application platform that leverages AI to automate and optimize the job search process. The application helps users find relevant job opportunities, optimize their resumes for specific positions, and track their application progress. Built with React, Express, and PostgreSQL, it features AI-powered resume tailoring, automated job matching, and comprehensive application analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared code:

- **Frontend**: React with Vite, TypeScript, and Tailwind CSS
- **Backend**: Express.js with TypeScript running on Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI API for resume optimization and job matching
- **UI Components**: Radix UI with shadcn/ui design system
- **State Management**: TanStack Query for server state management

## Key Components

### Frontend Architecture
- **React SPA** with Wouter for routing
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for API state, local storage for user sessions
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Express.js API** with TypeScript
- **Route Organization**: Centralized route registration in `/server/routes.ts`
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **AI Services**: Separate service modules for NLP processing and OpenAI integration
- **Development Setup**: Vite middleware integration for hot reloading

### Database Schema
- **Users**: Authentication and basic user information
- **User Profiles**: Detailed job preferences, skills, and work history
- **Jobs**: Job listings with AI-extracted keywords and skills
- **Applications**: Application tracking with status and AI optimization data

### AI Integration
- **Resume Optimization**: OpenAI GPT-4o for tailoring resumes to specific job requirements
- **Job Matching**: NLP-based skill matching and compatibility scoring
- **Keyword Extraction**: Automated extraction of relevant skills and requirements from job descriptions

## Data Flow

1. **User Onboarding**: Multi-step profile creation with job preferences and skills
2. **Job Discovery**: AI-powered job matching based on user profile and preferences
3. **Application Process**: 
   - Standard application submission
   - AI-optimized resume generation with cover letter
   - Application status tracking
4. **Analytics**: Performance tracking and success rate analysis

## External Dependencies

### Core Framework Dependencies
- **React ecosystem**: React, React DOM, Vite for development
- **Express.js**: Server framework with middleware support
- **Database**: Drizzle ORM with Neon serverless PostgreSQL
- **UI Components**: Extensive Radix UI component library

### AI and Processing
- **OpenAI API**: GPT-4o for resume optimization and content generation
- **Compromise NLP**: Text processing and keyword extraction
- **Date manipulation**: date-fns for time-related operations

### Development Tools
- **TypeScript**: Full-stack type safety
- **Tailwind CSS**: Utility-first styling with PostCSS
- **ESBuild**: Fast bundling for production builds

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite dev server with Express middleware integration
- **Database**: Environment-based PostgreSQL connection via DATABASE_URL
- **API Integration**: Development-friendly error handling and logging

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database Migrations**: Drizzle Kit for schema management
- **Environment Configuration**: Environment variables for database and API keys

### Database Management
- **Schema Definition**: Centralized in `shared/schema.ts` with Zod validation
- **Migrations**: Automatic generation and application via Drizzle Kit
- **Development Data**: In-memory storage with mock data for rapid development

The application is designed for scalability with clear separation of concerns, comprehensive type safety, and modern development practices. The AI integration provides genuine value through resume optimization and intelligent job matching, while the clean architecture supports future enhancements and feature additions.