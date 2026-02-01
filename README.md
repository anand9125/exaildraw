# Excalidraw Clone

A full-stack collaborative whiteboard application inspired by Excalidraw, built with modern web technologies.

## 🏗️ Architecture

This is a monorepo containing three main applications:

```
apps/
├── backend/          # Express.js REST API server
├── frontend/         # Next.js web application
└── ws-backend/       # WebSocket server for real-time collaboration
 packages/
        └── db/       # Shared Prisma database package
```

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: CSS (globals.css)
- **State Management**: Custom StoreProvider
- **Real-time**: WebSocket client

### Backend
- **Runtime**: Bun
- **API Server**: Express.js (REST API)
- **WebSocket Server**: Custom WebSocket implementation
- **Database**: Prisma ORM
- **Language**: TypeScript

### Database Package
- **ORM**: Prisma
- **Shared**: Used by both backend services

## 📋 Prerequisites

- [Bun](https://bun.sh) v1.0 or higher
- Node.js v18+ (for compatibility)
- Database (PostgreSQL/MySQL/SQLite - based on your Prisma config)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd exaildraw
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies across the monorepo
   bun install
   ```

3. **Set up environment variables**

   Create `.env` files in each application:

   **Backend (`apps/backend/.env`)**
   ```env
   PORT=3001
   DATABASE_URL="your-database-url"
   CORS_ORIGIN=http://localhost:3000
   ```

   **Frontend (`apps/frontend/.env`)**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_WS_URL=ws://localhost:3002
   ```

   **WebSocket Backend (`apps/ws-backend/.env`)**
   ```env
   PORT=3002
   DATABASE_URL="your-database-url"
   ```

   **Database Package (`apps/ws-backend/packages/db/.env`)**
   ```env
   DATABASE_URL="your-database-url"
   ```

4. **Set up the database**
   ```bash
   cd apps/ws-backend/packages/db
   bun run prisma generate
   bun run prisma migrate dev
   cd ../../../../
   ```

## 🎯 Running the Application

### Development Mode

You can run all services simultaneously or individually:

**Option 1: Run all services together**
```bash
# From the root directory
bun run dev
```

**Option 2: Run services individually**

In separate terminal windows:

```bash
# Terminal 1 - Frontend
cd apps/frontend
bun run dev

# Terminal 2 - Backend API
cd apps/backend
bun run dev

# Terminal 3 - WebSocket Server
cd apps/ws-backend
bun run dev
```

### Production Mode

```bash
# Build all applications
bun run build

# Start all services
bun run start
```

## 📁 Project Structure

```
exaildraw/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── controller/      # Route handlers
│   │   │   ├── middleware/      # Express middleware
│   │   │   ├── routes/          # API routes
│   │   │   ├── types/           # TypeScript types
│   │   │   └── index.ts         # Entry point
│   │   ├── .env
│   │   ├── .gitignore
│   │   ├── package.json
│   │   ├── README.md
│   │   └── tsconfig.json
│   │
│   ├── frontend/
│   │   ├── .next/               # Next.js build output
│   │   ├── actions/             # Server actions
│   │   ├── app/
│   │   │   ├── (auth)/          # Auth routes group
│   │   │   ├── canvas/          # Canvas page
│   │   │   ├── create-room/     # Room creation
│   │   │   ├── home/            # Home page
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── StoreProvider.tsx
│   │   ├── components/          # React components
│   │   ├── lib/                 # Utilities
│   │   ├── public/              # Static assets
│   │   ├── types/               # TypeScript types
│   │   ├── .env
│   │   ├── .gitignore
│   │   ├── next.config.js
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── ws-backend/
│    
│       ├── src/
│       │   ├── index.ts         # WebSocket server
│       │   └── types.ts
│       ├── .env
│       ├── .gitignore
│       ├── package.json
│       ├── README.md
│       └── tsconfig.json
packages/
│          └── db/
│              ├── prisma/
│              │   └── schema.prisma
│              ├── generated/    # Prisma client
│              ├── src/
│              ├── .env
│              ├── package.json
│              └── prisma.config.ts
│
├── node_modules/
├── .gitignore
├── package.json
├── README.md
└── bun.lockb
```

## 🔧 Available Scripts

### Root Level
```bash
bun install          # Install all dependencies
bun run dev          # Run all apps in development mode
bun run build        # Build all applications
bun run start        # Start all applications in production
```

### Frontend
```bash
bun run dev          # Start Next.js dev server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
```

### Backend
```bash
bun run dev          # Start Express server with hot reload
bun run build        # Build TypeScript
bun run start        # Start production server
```

### WebSocket Backend
```bash
bun run dev          # Start WebSocket server with hot reload
bun run build        # Build TypeScript
bun run start        # Start production server
```

### Database Package
```bash
bun run prisma:generate    # Generate Prisma client
bun run prisma:migrate     # Run database migrations
bun run prisma:studio      # Open Prisma Studio
bun run prisma:push        # Push schema changes to database
```

## 🌐 API Endpoints

### REST API (Backend - Port 3001)

```
GET    /api/health              # Health check
POST   /api/auth/register       # User registration
POST   /api/auth/login          # User login
GET    /api/rooms               # Get all rooms
POST   /api/rooms               # Create a new room
GET    /api/rooms/:id           # Get room details
PUT    /api/rooms/:id           # Update room
DELETE /api/rooms/:id           # Delete room
```

### WebSocket Server (Port 3002)

```
Events:
- connection              # Client connects
- join-room              # Join a drawing room
- draw                   # Send drawing data
- cursor-move            # Update cursor position
- disconnect             # Client disconnects
```

## 🎨 Features

- ✅ Real-time collaborative drawing
- ✅ Multiple drawing tools (pen, shapes, text)
- ✅ User authentication
- ✅ Room-based collaboration
- ✅ Cursor tracking
- ✅ Responsive design
- ✅ TypeScript for type safety
- ✅ Bun for fast development and builds

## 🗄️ Database Schema

The database schema is defined in `apps/ws-backend/packages/db/prisma/schema.prisma`. Key models include:

- **User**: User authentication and profiles
- **Room**: Drawing rooms/canvases
- **Drawing**: Saved drawing data
- (Add more based on your actual schema)

## 🔐 Authentication

The application uses authentication for securing routes and identifying users. Auth routes are grouped under `(auth)` in the frontend.

## 🚢 Deployment

### Frontend (Next.js)
Deploy to Vercel, Netlify, or any platform supporting Next.js:
```bash
cd apps/frontend
bun run build
```

### Backend & WebSocket
Deploy to any Node.js hosting platform (Railway, Render, DigitalOcean):
```bash
# Backend
cd apps/backend
bun run build

# WebSocket
cd apps/ws-backend
bun run build
```

### Environment Variables
Make sure to set all environment variables in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Test your changes before submitting PRs
- Update documentation for new features

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill the process using the port
lsof -ti:3001 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:3002 | xargs kill -9  # WebSocket
```

**Database connection issues**
```bash
# Reset the database
cd apps/ws-backend/packages/db
bun run prisma migrate reset
bun run prisma generate
```

**Dependencies issues**
```bash
# Clear cache and reinstall
rm -rf node_modules bun.lockb
bun install
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Inspired by [Excalidraw](https://excalidraw.com)
- Built with [Bun](https://bun.sh)
- Powered by [Next.js](https://nextjs.org)

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

**Built with ❤️ using Bun and modern web technologies**