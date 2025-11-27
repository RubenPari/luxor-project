# Documentazione Tecnica - Luxor

Documentazione tecnica completa per sviluppatori del progetto Luxor.

## Panoramica del Progetto

Luxor è un'applicazione full-stack per la ricerca e il salvataggio di foto da Unsplash. L'architettura è composta da:

- **Frontend**: React 19 + TypeScript + Tailwind CSS + Vite
- **Backend**: Laravel 12 + PHP 8.2
- **Database**: SQLite

## Struttura del Progetto

```
luxor-project/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/        # Componenti React
│   │   ├── contexts/          # Context API (FavoritesContext)
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # Chiamate API
│   │   ├── types/             # Definizioni TypeScript
│   │   ├── test/              # Utilità per i test
│   │   └── utils/             # Funzioni di utilità
│   ├── package.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   └── tsconfig.json
│
├── server/                    # Backend Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/   # Controller API
│   │   │   ├── Middleware/    # Middleware (CORS)
│   │   │   └── Requests/      # Form Request validation
│   │   ├── Models/            # Eloquent Models
│   │   ├── Providers/         # Service Providers
│   │   └── Services/          # Business logic (UnsplashService)
│   ├── config/                # Configurazioni Laravel
│   ├── database/
│   │   ├── migrations/        # Migrazioni database
│   │   └── database.sqlite    # Database SQLite
│   ├── routes/                # Definizione route API
│   ├── tests/                 # Test PHPUnit
│   ├── Dockerfile
│   └── .env
│
├── docker-compose.yml         # Orchestrazione Docker
├── MANUALE_UTENTE.md         # Guida utente
├── DOCUMENTAZIONE_TECNICA.md  # Questo file
└── README.md                  # Entry point documentazione
```

## Requisiti di Sistema

### Sviluppo Locale (senza Docker)

- **Node.js** 18.x o superiore
- **npm** 9.x o superiore
- **PHP** 8.2 o superiore
- **Composer** 2.x
- **Estensioni PHP richieste**:
  - pdo_sqlite
  - sqlite3
  - mbstring
  - fileinfo
  - openssl
  - curl

### Con Docker

- **Docker Engine** 20.10+
- **Docker Compose** 2.0+

## Configurazione Locale (Senza Docker)

### 1. Clonare il Repository

```bash
git clone <repository-url>
cd luxor-project
```

### 2. Configurare il Backend (Laravel)

```bash
# Entrare nella cartella server
cd server

# Installare le dipendenze PHP
composer install

# Copiare il file di ambiente
cp .env.example .env

# Generare la chiave dell'applicazione
php artisan key:generate

# Configurare il database SQLite
touch database/database.sqlite

# Eseguire le migrazioni
php artisan migrate
```

**Configurazione .env per SQLite:**

```env
APP_NAME=Luxor
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=/percorso/assoluto/al/progetto/server/database/database.sqlite

UNSPLASH_ACCESS_KEY=la_tua_chiave_unsplash
```

**Ottenere la chiave Unsplash:**

1. Vai su [Unsplash Developers](https://unsplash.com/developers)
2. Crea un account o accedi
3. Crea una nuova applicazione
4. Copia l'Access Key e inseriscila nel file `.env`

### 3. Configurare il Frontend (React)

```bash
# Dalla root del progetto, entrare nella cartella client
cd ../client

# Installare le dipendenze npm
npm install
```

**Configurazione variabili d'ambiente (opzionale):**

Crea un file `.env` nella cartella `client/`:

```env
VITE_API_URL=http://localhost:8000/api
```

### 4. Avviare i Server di Sviluppo

**Terminale 1 - Backend:**

```bash
cd server
php artisan serve
# Server disponibile su http://localhost:8000
```

**Terminale 2 - Frontend:**

```bash
cd client
npm run dev
# Server disponibile su http://localhost:5173
```

### 5. Verificare l'Installazione

- Apri http://localhost:5173 nel browser
- Prova a cercare "nature" nella barra di ricerca
- Verifica che le foto vengano caricate
- Prova ad aggiungere una foto ai preferiti

## Configurazione con Docker

### 1. Preparazione

```bash
# Clonare il repository
git clone <repository-url>
cd luxor-project

# Creare il file .env per il server
cp server/.env.example server/.env
```

**Configurare server/.env per Docker:**

```env
APP_NAME=Luxor
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost:8000

# Per Docker con SQLite (più semplice)
DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite

# Oppure per MySQL (come nel docker-compose.yml di default)
# DB_CONNECTION=mysql
# DB_HOST=mysql
# DB_PORT=3306
# DB_DATABASE=luxor
# DB_USERNAME=luxor
# DB_PASSWORD=secret

UNSPLASH_ACCESS_KEY=la_tua_chiave_unsplash
```

### 2. Configurazione docker-compose.yml per SQLite

Per usare SQLite (consigliato per semplicità), modifica `docker-compose.yml`:

```yaml
version: '3.8'

services:
  server:
    build:
      context: ./server
      dockerfile: Dockerfile
      target: production
    container_name: luxor-server
    restart: unless-stopped
    ports:
      - "8000:80"
    environment:
      - APP_ENV=production
      - APP_DEBUG=false
      - DB_CONNECTION=sqlite
      - DB_DATABASE=/var/www/html/database/database.sqlite
    volumes:
      - ./server/storage:/var/www/html/storage
      - ./server/database:/var/www/html/database
      - ./server/.env:/var/www/html/.env:ro
    networks:
      - luxor-network

  client:
    build:
      context: ./client
      dockerfile: Dockerfile.dev
    container_name: luxor-client
    restart: unless-stopped
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:8000/api
    volumes:
      - ./client:/app
      - /app/node_modules
    networks:
      - luxor-network
    depends_on:
      - server

networks:
  luxor-network:
    driver: bridge
```

### 3. Creare Dockerfile per il Client

Crea il file `client/Dockerfile.dev`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### 4. Avviare con Docker Compose

```bash
# Costruire e avviare i container
docker-compose up -d --build

# Verificare che i container siano attivi
docker-compose ps

# Vedere i log
docker-compose logs -f

# Eseguire le migrazioni (se necessario)
docker-compose exec server php artisan migrate
```

### 5. Fermare i Container

```bash
# Fermare i container
docker-compose down

# Fermare e rimuovere anche i volumi
docker-compose down -v
```

## API REST

### Endpoint Disponibili

#### Ricerca Foto Unsplash

```
GET /api/unsplash/search
```

**Parametri Query:**
- `query` (required): termine di ricerca
- `page` (optional): numero pagina, default 1
- `per_page` (optional): risultati per pagina, default 12, max 30

**Esempio:**
```bash
curl "http://localhost:8000/api/unsplash/search?query=nature&page=1&per_page=12"
```

**Risposta:**
```json
{
  "success": true,
  "data": {
    "results": [...],
    "total": 10000,
    "total_pages": 834
  }
}
```

#### Lista Preferiti

```
GET /api/favorites
```

**Risposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "photo_id": "abc123",
      "photo_data": {...},
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### Aggiungere ai Preferiti

```
POST /api/favorites
Content-Type: application/json

{
  "photo_id": "abc123",
  "photo_data": {
    "id": "abc123",
    "urls": {...},
    "user": {...},
    ...
  }
}
```

**Risposta:**
```json
{
  "success": true,
  "data": {...},
  "message": "Photo added to favorites"
}
```

#### Rimuovere dai Preferiti

```
DELETE /api/favorites/{photoId}
```

**Risposta:**
```json
{
  "success": true,
  "data": null,
  "message": "Photo removed from favorites"
}
```

## Architettura Frontend

### Componenti Principali

- **App.tsx**: Componente root, gestisce routing e layout
- **Navigation.tsx**: Barra di navigazione con link e contatore preferiti
- **SearchPage.tsx**: Pagina ricerca con form e griglia risultati
- **FavoritesPage.tsx**: Pagina preferiti salvati
- **PhotoGrid.tsx**: Griglia responsive di foto
- **PhotoCard.tsx**: Card singola foto con toggle preferiti
- **Toast.tsx**: Notifiche temporanee

### Context API

**FavoritesContext**: Gestisce lo stato globale dei preferiti

```typescript
interface FavoritesContextValue {
  favorites: Favorite[]
  favoriteIds: Set<string>
  isLoading: boolean
  error: string | null
  toasts: ToastMessage[]
  toggleFavorite: (photo: UnsplashPhoto) => Promise<void>
  reloadFavorites: () => Promise<void>
  clearError: () => void
  removeToast: (id: string) => void
}
```

### Custom Hooks

**useUnsplashSearch**: Gestisce la logica di ricerca

```typescript
const {
  photos,
  isLoading,
  error,
  currentPage,
  totalPages,
  search,
  goToPage,
} = useUnsplashSearch({ perPage: 12 })
```

## Architettura Backend

### Controller

- **UnsplashController**: Proxy verso le API Unsplash
- **FavoriteController**: CRUD per i preferiti

### Services

- **UnsplashService**: Logica di comunicazione con Unsplash API

### Models

- **Favorite**: Model Eloquent per i preferiti

```php
protected $fillable = ['photo_id', 'photo_data'];
protected $casts = ['photo_data' => 'array'];
```

### Database Schema

**Tabella: favorites**

| Colonna | Tipo | Descrizione |
|---------|------|-------------|
| id | BIGINT | Primary key auto-increment |
| photo_id | VARCHAR | ID univoco foto Unsplash |
| photo_data | JSON | Metadati completi della foto |
| created_at | TIMESTAMP | Data creazione |
| updated_at | TIMESTAMP | Data ultimo aggiornamento |

## Testing

### Test Frontend (Vitest)

```bash
cd client

# Eseguire tutti i test
npm test

# Test con watch mode
npm run test:watch

# Test con coverage
npm run test:coverage

# Test con UI
npm run test:ui
```

**File di test:**
- `src/App.test.tsx` - Test componente principale
- `src/components/PhotoGrid.test.tsx` - Test griglia foto
- `src/utils/math.test.ts` - Test utility
- `src/test/integration.example.test.tsx` - Test integrazione

### Test Backend (PHPUnit)

```bash
cd server

# Eseguire tutti i test
php artisan test

# Test con coverage
php artisan test --coverage

# Test specifico
php artisan test --filter=UnsplashSearchTest
```

**File di test:**
- `tests/Feature/ExampleTest.php` - Test base API
- `tests/Feature/UnsplashSearchTest.php` - Test ricerca
- `tests/Unit/ExampleTest.php` - Test unitari

## Comandi Utili

### Frontend

```bash
npm run dev          # Server sviluppo
npm run build        # Build produzione
npm run preview      # Preview build
npm run lint         # Linting ESLint
npm run lint:fix     # Fix automatico lint
npm test             # Esegui test
```

### Backend

```bash
php artisan serve              # Server sviluppo
php artisan migrate            # Esegui migrazioni
php artisan migrate:fresh      # Reset database
php artisan test               # Esegui test
php artisan cache:clear        # Pulisci cache
php artisan config:cache       # Cache configurazione
php artisan route:list         # Lista route
```

## Troubleshooting

### Errore CORS

Se ricevi errori CORS, verifica che il middleware `Cors` sia registrato in `bootstrap/app.php` e che il frontend usi l'URL corretto per le API.

### Database non trovato

```bash
# Crea il file database
touch server/database/database.sqlite

# Esegui le migrazioni
php artisan migrate
```

### Chiave Unsplash non funziona

1. Verifica che la chiave sia corretta nel file `.env`
2. Controlla che l'applicazione Unsplash sia approvata
3. Verifica i limiti di rate dell'API (50 richieste/ora per le app demo)

### Dipendenze PHP mancanti

```bash
# Su Ubuntu/Debian
sudo apt install php-sqlite3 php-mbstring php-xml php-curl

# Su Windows (abilitare in php.ini)
extension=pdo_sqlite
extension=sqlite3
extension=mbstring
extension=fileinfo
```

## Licenza

Questo progetto è rilasciato sotto licenza MIT.

---

Per ulteriori informazioni, consulta il [Manuale Utente](./MANUALE_UTENTE.md).
