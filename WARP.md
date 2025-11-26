# WARP.md - Luxor Project

## Project Overview
Luxor Project is a full-stack web application with a monorepo structure containing:
- **Client**: React + TypeScript + Vite frontend with Tailwind CSS
- **Server**: Laravel (PHP) backend with Vite integration

## Project Structure
```
luxor-project/
├── client/          # Frontend application
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── server/          # Backend application
│   ├── app/
│   ├── routes/
│   ├── database/
│   ├── package.json
│   └── composer.json
└── .warp/          # Warp configuration
```

## Development Setup

### Prerequisites
- Node.js (for frontend and build tools)
- PHP 8.x
- Composer
- MySQL/PostgreSQL (database)

### Installation

#### Client Setup
```bash
cd client
npm install
```

#### Server Setup
```bash
cd server
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

## Common Commands

### Client (React + Vite)
```bash
# Start development server
cd client && npm run dev

# Build for production
cd client && npm run build

# Run linter
cd client && npm run lint

# Preview production build
cd client && npm run preview

# Run tests
cd client && npm test

# Run tests with coverage
cd client && npm run test:coverage

# Run tests with UI
cd client && npm run test:ui
```

### Server (Laravel)
```bash
# Start Laravel development server
cd server && php artisan serve

# Run Vite dev server (for assets)
cd server && npm run dev

# Run database migrations
cd server && php artisan migrate

# Seed database
cd server && php artisan db:seed

# Clear cache
cd server && php artisan cache:clear

# Run tests
cd server && php artisan test

# Run tests with coverage
cd server && php artisan test --coverage

# Run specific test
cd server && php artisan test --filter TestName
```

### Concurrent Development
```bash
# Run both client and server simultaneously
# From client:
npm run dev

# In another terminal, from server:
php artisan serve
npm run dev
```

## Technology Stack

### Frontend (Client)
- **Framework**: React 19.2
- **Language**: TypeScript
- **Build Tool**: Vite 7.x
- **Styling**: Tailwind CSS 4.x
- **Linting**: ESLint
- **Testing**: Vitest + React Testing Library

### Backend (Server)
- **Framework**: Laravel
- **Language**: PHP
- **Build Tool**: Vite (for assets)
- **API**: RESTful/Laravel routes
- **Testing**: PHPUnit

## Environment Variables

### Client (.env)
Create a `.env` file in the `client/` directory:
```
VITE_API_URL=http://localhost:8000/api
```

### Server (.env)
Create a `.env` file in the `server/` directory (copy from `.env.example`):
```
APP_NAME=Luxor
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=luxor
DB_USERNAME=root
DB_PASSWORD=
```

## Development Workflow

1. **Start Backend**: `cd server && php artisan serve`
2. **Start Backend Assets**: `cd server && npm run dev`
3. **Start Frontend**: `cd client && npm run dev`
4. **Access Application**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000

## Useful Tips

- Use `php artisan list` to see all available Artisan commands
- Use `php artisan route:list` to see all registered routes
- Frontend hot-reload is enabled by default with Vite
- Laravel uses `.env` for environment configuration
- TypeScript strict mode is enabled on the client

## Project-Specific Notes

- The server includes React integration via Vite (check `server/package.json`)
- Both client and server use Tailwind CSS 4.x
- Client uses ESLint for code quality
- Remember to run migrations after pulling database changes

## Testing

The project has comprehensive test coverage for both frontend and backend:

- **Client**: Unit and integration tests with Vitest
- **Server**: Unit and feature tests with PHPUnit

See [TESTING.md](./TESTING.md) for detailed testing documentation.

### Quick Test Commands
```bash
# Client tests
cd client && npm test

# Server tests
cd server && php artisan test
```

## Docker

The project includes Docker support for containerized deployment:

- **Multi-stage Dockerfile** for optimized production builds
- **Docker Compose** for orchestrating all services
- **Development and production** configurations
- **Nginx + PHP-FPM + Supervisor** in a single container
- **MySQL and Redis** services included

See [DOCKER.md](./DOCKER.md) for complete Docker documentation.

### Quick Docker Commands
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f server

# Run artisan commands
docker-compose exec server php artisan migrate

# Access container shell
docker-compose exec server sh
```

## Links & Resources

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
