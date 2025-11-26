# Docker Guide - Luxor Project

This document provides information about running the Luxor Project with Docker.

## 📦 Docker Setup

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+

### Quick Start

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 🏗️ Architecture

The Docker setup includes:

- **server**: Laravel API (Nginx + PHP-FPM + Supervisor)
- **mysql**: MySQL 8.0 database
- **redis**: Redis cache and queue backend
- **client**: React development server (optional)
- **phpmyadmin**: Database management UI (optional)
- **redis-commander**: Redis management UI (optional)

## 🚀 Building Images

### Production Build (Server)

```bash
# Build production image
docker build -t luxor-server:latest ./server

# Build with specific target
docker build --target production -t luxor-server:prod ./server
docker build --target development -t luxor-server:dev ./server
```

### Multi-stage Build

The Dockerfile uses multi-stage builds:

1. **node-builder**: Builds frontend assets with Vite
2. **base**: Base PHP image with extensions
3. **development**: Development image with Xdebug
4. **production**: Optimized production image

## 🔧 Docker Compose Commands

### Starting Services

```bash
# Start all services in background
docker-compose up -d

# Start specific service
docker-compose up -d server

# Start with optional tools (phpMyAdmin, Redis Commander)
docker-compose --profile tools up -d

# Build and start
docker-compose up -d --build
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f mysql

# Last 100 lines
docker-compose logs --tail=100 server
```

### Managing Services

```bash
# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers, volumes, images
docker-compose down -v --rmi all

# Restart specific service
docker-compose restart server

# View running containers
docker-compose ps
```

## 🛠️ Development Workflow

### Running Artisan Commands

```bash
# Execute artisan commands
docker-compose exec server php artisan migrate
docker-compose exec server php artisan db:seed
docker-compose exec server php artisan cache:clear
docker-compose exec server php artisan config:cache

# Create new model/controller
docker-compose exec server php artisan make:model Product -m
docker-compose exec server php artisan make:controller ProductController
```

### Running Composer Commands

```bash
# Install dependencies
docker-compose exec server composer install

# Update dependencies
docker-compose exec server composer update

# Add package
docker-compose exec server composer require vendor/package
```

### Database Access

```bash
# Access MySQL CLI
docker-compose exec mysql mysql -u luxor -psecret luxor

# Execute SQL file
docker-compose exec -T mysql mysql -u luxor -psecret luxor < backup.sql

# Create database backup
docker-compose exec mysql mysqldump -u luxor -psecret luxor > backup.sql
```

### Access Redis CLI

```bash
docker-compose exec redis redis-cli

# Inside Redis CLI:
# PING
# KEYS *
# FLUSHALL
```

### Shell Access

```bash
# Access server container
docker-compose exec server sh

# Access as root
docker-compose exec -u root server sh

# Access MySQL container
docker-compose exec mysql bash
```

## 📊 Monitoring

### Health Checks

```bash
# Check health status
docker-compose ps

# Inspect health check
docker inspect luxor-server | grep -A 10 Health
```

### Resource Usage

```bash
# View resource usage
docker stats

# View logs size
docker-compose exec server du -sh /var/log/*
```

## 🔐 Environment Variables

### Server (.env)

Create `server/.env` with:

```env
APP_NAME=Luxor
APP_ENV=production
APP_KEY=base64:YOUR_KEY_HERE
APP_DEBUG=false
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=luxor
DB_USERNAME=luxor
DB_PASSWORD=secret

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

Generate app key:
```bash
docker-compose exec server php artisan key:generate
```

## 🧪 Testing in Docker

```bash
# Run PHPUnit tests
docker-compose exec server php artisan test

# Run with coverage
docker-compose exec server php artisan test --coverage

# Run specific test
docker-compose exec server php artisan test --filter HealthControllerTest
```

## 📦 Production Deployment

### Building for Production

```bash
# Build production image
docker build -t luxor-server:1.0.0 --target production ./server

# Tag for registry
docker tag luxor-server:1.0.0 registry.example.com/luxor-server:1.0.0

# Push to registry
docker push registry.example.com/luxor-server:1.0.0
```

### Running in Production

```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d

# Scale queue workers
docker-compose -f docker-compose.prod.yml up -d --scale server=3
```

## 🔍 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs server

# Check container status
docker-compose ps

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Permission Issues

```bash
# Fix storage permissions
docker-compose exec -u root server chown -R www-data:www-data /var/www/html/storage
docker-compose exec -u root server chmod -R 775 /var/www/html/storage
```

### Database Connection Issues

```bash
# Verify MySQL is running
docker-compose ps mysql

# Test connection
docker-compose exec server php artisan db:monitor

# Check MySQL logs
docker-compose logs mysql
```

### Clear All Caches

```bash
docker-compose exec server php artisan optimize:clear
docker-compose exec redis redis-cli FLUSHALL
```

## 🔧 Customization

### Custom PHP Configuration

Edit `server/docker/php/php.ini`:
```ini
memory_limit = 512M
max_execution_time = 120
```

Then rebuild:
```bash
docker-compose build server
docker-compose up -d server
```

### Custom Nginx Configuration

Edit `server/docker/nginx/default.conf` and restart:
```bash
docker-compose restart server
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Laravel Documentation](https://laravel.com/docs)
- [Nginx Documentation](https://nginx.org/en/docs/)

## 🚨 Security Notes

1. Change default passwords in production
2. Use secrets management for sensitive data
3. Keep base images updated
4. Run security scans on images
5. Use non-root users when possible
6. Enable HTTPS in production
7. Implement rate limiting
8. Configure firewall rules

## 📝 Service URLs

When running with docker-compose:

- **Server API**: http://localhost:8000
- **Client**: http://localhost:5173
- **phpMyAdmin**: http://localhost:8080
- **Redis Commander**: http://localhost:8081
- **Health Check**: http://localhost:8000/api/health
