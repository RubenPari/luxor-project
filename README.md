# Luxor Project

A full-stack web application built with React (TypeScript) frontend and Laravel (PHP) backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PHP 8.2+
- Composer
- MySQL/PostgreSQL

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd luxor-project

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
```

## 📂 Project Structure

```
luxor-project/
├── client/          # React + TypeScript frontend
├── server/          # Laravel PHP backend
├── WARP.md         # Warp development guide
├── TESTING.md      # Testing documentation
└── README.md       # This file
```

## 🛠️ Development

### Start Development Servers

**Client:**
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

**Server:**
```bash
cd server
php artisan serve
# Runs on http://localhost:8000
```

## ✅ Testing

The project includes comprehensive test coverage for both frontend and backend.

### Run Tests

**Client (Vitest):**
```bash
cd client
npm test                  # Run tests
npm run test:coverage     # With coverage report
npm run test:ui          # With UI
```

**Server (PHPUnit):**
```bash
cd server
php artisan test              # Run tests
php artisan test --coverage   # With coverage
```

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## 🐳 Docker

The project includes Docker support for easy deployment and development.

```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f server

# Run migrations
docker-compose exec server php artisan migrate
```

See [DOCKER.md](./DOCKER.md) for complete Docker documentation.

## 📚 Documentation

- **[WARP.md](./WARP.md)** - Complete development guide with setup, commands, and workflows
- **[TESTING.md](./TESTING.md)** - Testing guide with examples and best practices
- **[DOCKER.md](./DOCKER.md)** - Docker setup and deployment guide

## 🏗️ Tech Stack

### Frontend (Client)
- React 19.2
- TypeScript
- Vite 7.x
- Tailwind CSS 4.x
- Vitest + React Testing Library

### Backend (Server)
- Laravel 12
- PHP 8.2
- PHPUnit
- MySQL/PostgreSQL

## 📝 Available Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Server
- `php artisan serve` - Start development server
- `php artisan test` - Run tests
- `php artisan migrate` - Run database migrations
- `composer test` - Run tests via composer

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Run tests to ensure they pass
5. Submit a pull request

## 📄 License

[Your License Here]
