# Luxor

Applicazione web full-stack per la ricerca e il salvataggio di foto da Unsplash.

## Descrizione

Luxor permette di:
- Cercare foto dalla libreria Unsplash
- Salvare le foto preferite in una collezione personale
- Gestire i preferiti con un'interfaccia semplice e intuitiva

## Stack Tecnologico

- **Frontend**: React 19 + TypeScript + Tailwind CSS + Vite
- **Backend**: Laravel 12 + PHP 8.2
- **Database**: SQLite
- **Testing**: Vitest (frontend) + PHPUnit (backend)

## Avvio Rapido

### Prerequisiti

- Node.js 18+
- PHP 8.2+
- Composer 2.x

### Installazione

```bash
# Clonare il repository
git clone <repository-url>
cd luxor-project

# Backend
cd server
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate

# Frontend
cd ../client
npm install
```

### Avviare l'Applicazione

**Terminale 1 - Backend:**
```bash
cd server
php artisan serve
# http://localhost:8000
```

**Terminale 2 - Frontend:**
```bash
cd client
npm run dev
# http://localhost:5173
```

## Documentazione

- **[Manuale Utente](./MANUALE_UTENTE.md)** - Guida per gli utenti finali
- **[Documentazione Tecnica](./DOCUMENTAZIONE_TECNICA.md)** - Guida per sviluppatori con setup locale e Docker

## Struttura del Progetto

```
luxor-project/
├── client/                    # Frontend React
├── server/                    # Backend Laravel
├── docker-compose.yml         # Orchestrazione Docker
├── MANUALE_UTENTE.md          # Guida utente
├── DOCUMENTAZIONE_TECNICA.md  # Documentazione tecnica
└── README.md                  # Questo file
```

## Test

```bash
# Test frontend
cd client && npm test

# Test backend
cd server && php artisan test
```

## Licenza

MIT License
