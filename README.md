# 🎓 Auth Supabase - Online Course Platform

<div align="center">
  <img src="https://via.placeholder.com/600x200/1a1a1a/ffffff?text=Auth+Supabase" alt="Auth Supabase Logo" />
  <p><em>A modern online course platform built with Next.js 15 and Supabase</em></p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?logo=next.js)
  ![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
  ![Supabase](https://img.shields.io/badge/Supabase-Authentication-3ECF8E?logo=supabase)
  ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)
  ![License](https://img.shields.io/badge/License-MIT-green.svg)
</div>

## 📋 Table of Contents

- [🎯 Introduction](#-introduction)
- [🚀 Technologies](#-technologies)
- [🎨 Features](#-features)
- [🛠️ Installation](#️-installation)
- [⚙️ Environment Variables](#️-environment-variables)
- [🏗️ Project Structure](#️-project-structure)
- [📦 Available Scripts](#-available-scripts)
- [🗄️ Database Schema](#️-database-schema)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🎯 Introduction

**Auth Supabase** is a modern online course platform that allows instructors to create and manage courses while students can enroll and access educational content. Built with the latest web technologies, it provides a seamless experience for both instructors and students.

### ✨ Key Features

- 🔐 **Complete authentication** with Supabase Auth
- 👥 **Role management** (Admin, Teacher, Student)
- 📚 **Course creation and management**
- 🎥 **Video lesson support**
- 🏷️ **Categories and subcategories system**
- 🔍 **Advanced search and filtering**
- 📊 **Personalized dashboard**
- 📱 **Responsive design**
- 🌙 **Dark/light mode**
- ⚡ **Turbopack optimization**

## 🚀 Technologies

### Frontend

- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - User interface library
- **TypeScript 5** - Static typing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn/ui** - Reusable UI components
- **Lucide React** - Modern icons

### Backend & Database

- **Supabase** - Backend as a Service (BaaS)
- **Supabase Auth** - Authentication system
- **PostgreSQL** - Relational database

### Development Tools

- **ESLint** - Code linting
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Turbopack** - Optimized bundler

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- pnpm (mandatory)
- Supabase account

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/auth-supabase.git
   cd auth-supabase
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure Supabase**

   - Create a new project on [Supabase](https://supabase.com)
   - Get the project URL and public key
   - Set up the necessary tables (see database schema section)

5. **Run in development mode**

   ```bash
   pnpm dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## ⚙️ Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database (optional, for local development)
DATABASE_URL=your_database_url

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Getting Supabase credentials:

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **URL** and **anon public key**

## 🏗️ Project Structure

```
auth-supabase/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 auth/              # Authentication routes
│   │   ├── 📁 courses/           # Course pages
│   │   ├── 📁 private/           # Protected routes
│   │   └── 📁 api/               # API Routes
│   ├── 📁 components/            # React components
│   │   ├── 📁 ui/                # Shadcn/ui components
│   │   ├── 📁 courses/           # Course-specific components
│   │   ├── 📁 auth/              # Authentication components
│   │   └── 📁 shared/            # Shared components
│   ├── 📁 lib/                   # Utilities and helper functions
│   ├── 📁 hooks/                 # Custom React hooks
│   ├── 📁 types/                 # TypeScript type definitions
│   ├── 📁 utils/                 # General utilities
│   │   └── 📁 supabase/          # Supabase configuration
│   └── 📁 consts/                # Application constants
├── 📁 public/                    # Static files
├── 📄 next.config.ts             # Next.js configuration
├── 📄 tsconfig.json              # TypeScript configuration
└── 📄 package.json               # Dependencies and scripts
```

### Main folder descriptions:

- **`src/app/`** - Contains all pages using Next.js App Router
- **`src/components/`** - Reusable React components organized by functionality
- **`src/lib/`** - Business logic functions and utilities for Supabase interaction
- **`src/types/`** - All TypeScript interfaces and types
- **`src/utils/supabase/`** - Supabase client configuration (browser/server)

## 📦 Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack

# Production
pnpm build        # Build application for production
pnpm start        # Start production server

# Code quality
pnpm lint         # Run ESLint
pnpm lint --fix   # Run ESLint and auto-fix issues
```

## 🗄️ Database Schema

The application uses the following main tables:

- **users** - User information
- **courses** - Course information
- **lessons** - Lessons for each course
- **categories** - Course categories
- **subcategories** - Subcategories
- **enrollments** - Student enrollments
- **user_activities** - Activity logs

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'feat: add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ using Next.js and Supabase</p>
</div>
