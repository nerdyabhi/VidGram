# VidGram - Video Sharing Platform

![VidGram Logo](https://via.placeholder.com/200x60?text=VidGram)

## Overview

**VidGram** is a modern video sharing platform that combines the best features of Instagram and YouTube, allowing users to upload, discover, and engage with short and long-form video content. Built with performance and user experience in mind, VidGram offers a responsive interface that works seamlessly across mobile and desktop devices.

## ✨ Features

- 📱 Responsive design optimized for all devices
- 🎬 Video uploading and processing
- 🔍 Category-based content discovery
- 👤 User profiles and personalized feeds
- 💬 Interactive comments and engagement
- 📊 Creator analytics in Studio dashboard
- 🌙 Dark/Light theme support
- 🔒 Secure authentication

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, TailwindCSS
- **Backend**: tRPC, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **File Storage**: UploadThing
- **Deployment**: Vercel

## 📁 Project Structure

```
vidgram/
├── prisma/
│   └── schema.prisma       # Database schema
├── public/
│   └── assets/             # Static assets
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (home)/         # Home route group
│   │   ├── (auth)/         # Authentication route group
│   │   ├── (studio)/       # Creator studio route group
│   │   └── api/            # API routes
│   ├── components/         # Shared UI components
│   │   ├── ui/             # Core UI components
│   │   └── forms/          # Form components
│   ├── lib/                # Utility functions
│   ├── modules/            # Feature modules
│   │   ├── home/           # Home page module
│   │   ├── studio/         # Studio module
│   │   ├── video/          # Video module
│   │   └── user/           # User module
│   ├── trpc/               # tRPC configuration
│   │   ├── client.ts       # Client-side config
│   │   ├── server.ts       # Server-side config
│   │   └── routers/        # API routers
│   ├── hooks/              # Custom React hooks
│   ├── store/              # State management
│   └── types/              # TypeScript type definitions
├── .env.example            # Example environment variables
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript configuration
```

## 🗄️ Database Schema

![](./readme-assets/er.png)
### Schema Details

```prisma
// Simplified schema.prisma

model User {
  id            String    @id @default(cuid())
  username      String    @unique
  email         String    @unique
  password      String?
  avatar        String?
  bio           String?
  verified      Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  videos        Video[]
  comments      Comment[]
  likes         Like[]
}

model Video {
  id          String    @id @default(cuid())
  title       String
  description String?
  url         String
  thumbnail   String?
  duration    Int
  views       Int       @default(0)
  published   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  categoryId  String
  category    Category  @relation(fields: [categoryId], references: [id])
  comments    Comment[]
  likes       Like[]
}

model Category {
  id        String     @id @default(cuid())
  name      String
  slug      String     @unique
  icon      String?
  parentId  String?
  parent    Category?  @relation("SubCategories", fields: [parentId], references: [id])
  children  Category[] @relation("SubCategories")
  videos    Video[]
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  videoId   String
  video     Video    @relation(fields: [videoId], references: [id])
}

model Like {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  videoId   String
  video     Video    @relation(fields: [videoId], references: [id])

  @@unique([userId, videoId])
}
```

## 🏗️ Architecture

VidGram follows a modular architecture with a clear separation of concerns:

### Client-Server Architecture with tRPC
![alt text](./readme-assets/cs-Architecture.png)

### Frontend Architecture

![alt text](./readme-assets/frontend.png)
### Backend Architecture
![alt text](./readme-assets/backend.png)


## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/bun
- PostgreSQL database
- Git

### Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vidgram.git
   cd vidgram
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database credentials and API keys
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

## 💻 Development Workflow

### Running in Development Mode

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Running Tests

```bash
npm run test
```

## 📱 Mobile Responsiveness

VidGram is built with a mobile-first approach, ensuring an excellent user experience across all device sizes:

- **Small screens (< 640px)**: Optimized for mobile phones with simplified navigation and full-width content
- **Medium screens (640px - 1024px)**: Tablet-friendly layouts with adaptive grids
- **Large screens (> 1024px)**: Enhanced desktop experience with multi-column layouts

## 🔐 Authentication Flow

1. **Registration**: Users can sign up using email/password or OAuth providers
2. **Login**: Secure authentication with JWT tokens
3. **Account Recovery**: Password reset functionality
4. **Session Management**: Automatic token refresh and session persistence

## 🖼️ Content Management

### Video Upload Flow

1. User selects video file(s)
2. Client-side validation (file size, format)
3. Chunked upload to UploadThing
4. Server-side processing (transcoding, thumbnail generation)
5. Metadata addition (title, description, category)
6. Publishing to make video available

### Video Discovery

- Home feed with personalized recommendations
- Category-based browsing
- Search functionality
- Trending videos section

## 📊 Studio Features

The Creator Studio provides content creators with tools to:

- Manage uploaded videos
- Track performance analytics
- Respond to comments
- Schedule content
- Customize channel appearance

## 🌐 Deployment

VidGram is optimized for deployment on Vercel, but can be deployed on any platform that supports Node.js:

1. Connect your Git repository to Vercel
2. Configure environment variables
3. Deploy with one click

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request