# Luxor - Documentazione Completa

Applicazione web full-stack per la ricerca e il salvataggio di foto da Unsplash.

## 📋 Indice

- [Panoramica](#panoramica)
- [Stack Tecnologico](#stack-tecnologico)
- [Avvio Rapido](#avvio-rapido)
- [Configurazione Dettagliata](#configurazione-dettagliata)
- [Struttura del Progetto](#struttura-del-progetto)
- [Architettura](#architettura)
- [API REST](#api-rest)
- [Database](#database)
- [Testing](#testing)
- [Comandi Utili](#comandi-utili)
- [Troubleshooting](#troubleshooting)

## Panoramica

Luxor è un'applicazione full-stack che permette di:

✨ **Funzionalità Principali:**
- 🔍 Cercare foto dalla libreria Unsplash
- ❤️ Salvare foto preferite in una collezione personale
- 🎨 Interfaccia moderna e responsive con dark mode
- 🚀 Feedback visivo immediato con spinner di caricamento
- 📱 Design responsive per mobile, tablet e desktop
- 🔄 Aggiornamenti ottimistici per UX fluida
- 🎯 Identificazione utente tramite UUID (senza autenticazione)

## Stack Tecnologico

### Frontend
- **React** 19 - UI library
- **TypeScript** 5.x - Type safety
- **Tailwind CSS** 3.x - Styling
- **Vite** 6.x - Build tool
- **Vitest** - Testing framework
- **React Router** 7.x - Routing

### Backend
- **Laravel** 12 - PHP framework
- **PHP** 8.2+ - Linguaggio
- **SQLite** - Database (colonne separate)
- **PHPUnit** - Testing
- **PHPStan** - Analisi statica
- **Unsplash API** - Fonte foto

### DevOps
- **Docker** & Docker Compose
- **Nginx** - Web server (Docker)
- **Git** - Version control

## Avvio Rapido

### Prerequisiti

**Sviluppo Locale:**
- Node.js 18+
- PHP 8.2+
- Composer 2.x
- Estensioni PHP: pdo_sqlite, sqlite3, mbstring, fileinfo, openssl, curl

**Con Docker:**
- Docker Engine 20.10+
- Docker Compose 2.0+

### Installazione Rapida

```bash
# 1. Clonare il repository
git clone <repository-url>
cd luxor-project

# 2. Backend
cd server
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate

# 3. Frontend
cd ../client
npm install
cp .env.example .env

# 4. Configurare chiave Unsplash
# Editare server/.env e aggiungere:
# UNSPLASH_ACCESS_KEY=la_tua_chiave
```

**Ottenere la chiave Unsplash:**
1. Vai su [Unsplash Developers](https://unsplash.com/developers)
2. Crea un account o accedi
3. Crea una nuova applicazione
4. Copia l'Access Key e inseriscila nel file `.env`

### Avvio Applicazione

**Terminale 1 - Backend:**
```bash
cd server
php artisan serve
# Disponibile su http://localhost:8000
```

**Terminale 2 - Frontend:**
```bash
cd client
npm run dev
# Disponibile su http://localhost:3000
```

**Con Docker:**
```bash
docker compose up -d
# Frontend: http://localhost:3000
# Backend: http://localhost:80
```

## Configurazione Dettagliata

### Setup Locale (Senza Docker)

#### 1. Configurare Backend

```bash
cd server

# Installare dipendenze
composer install

# Configurare environment
cp .env.example .env
php artisan key:generate

# Creare database SQLite
touch database/database.sqlite

# Eseguire migrazioni
php artisan migrate:fresh
```

**Configurazione `.env` per sviluppo locale:**

```env
APP_NAME=Luxor
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=/percorso/assoluto/server/database/database.sqlite

CACHE_DRIVER=database

UNSPLASH_ACCESS_KEY=la_tua_chiave_unsplash
```

#### 2. Configurare Frontend

```bash
cd client

# Installare dipendenze
npm install

# Configurare environment
cp .env.example .env
```

**File `client/.env` per sviluppo locale:**

```env
# Per sviluppo locale senza Docker
VITE_API_URL=http://localhost:8000/api
```

### Setup con Docker

#### 1. Preparazione

```bash
# Clonare e configurare
git clone <repository-url>
cd luxor-project
cp server/.env.example server/.env
```

**Configurare `server/.env` per Docker:**

```env
APP_NAME=Luxor
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost

DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite

CACHE_DRIVER=database

UNSPLASH_ACCESS_KEY=la_tua_chiave_unsplash
```

**File `client/.env` per Docker:**

```env
# Per Docker
VITE_API_URL=http://localhost/api
```

#### 2. Avviare con Docker Compose

```bash
# Costruire e avviare
docker compose up -d --build

# Verificare container attivi
docker compose ps

# Vedere i log
docker compose logs -f

# Eseguire migrazioni
docker compose exec php php artisan migrate
```

#### 3. Fermare Docker

```bash
# Fermare container
docker compose down

# Fermare e rimuovere volumi
docker compose down -v
```

## Struttura del Progetto

```
luxor-project/
├── client/                      # Frontend React
│   ├── src/
│   │   ├── components/          # Componenti React
│   │   │   ├── icons/          # Icone SVG
│   │   │   ├── App.tsx         # Componente root
│   │   │   ├── Navigation.tsx  # Navbar
│   │   │   ├── SearchPage.tsx  # Pagina ricerca
│   │   │   ├── FavoritesPage.tsx
│   │   │   ├── PhotoGrid.tsx   # Griglia foto
│   │   │   ├── PhotoCard.tsx   # Card foto
│   │   │   ├── Pagination.tsx
│   │   │   ├── Toast.tsx       # Notifiche
│   │   │   └── ErrorBoundary.tsx
│   │   ├── contexts/
│   │   │   └── FavoritesContext.tsx  # State management preferiti
│   │   ├── hooks/
│   │   │   ├── useUnsplashSearch.ts  # Hook ricerca
│   │   │   └── useUserId.ts          # UUID utente
│   │   ├── services/
│   │   │   ├── favorites.ts    # API preferiti
│   │   │   └── unsplash.ts     # API ricerca
│   │   ├── types/
│   │   │   └── unsplash.ts     # TypeScript types
│   │   ├── test/               # Utilities testing
│   │   ├── utils/              # Funzioni utility
│   │   └── constants.ts        # Costanti
│   ├── package.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   └── tsconfig.json
│
├── server/                      # Backend Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── FavoriteController.php
│   │   │   │   └── UnsplashController.php
│   │   │   ├── Middleware/
│   │   │   │   └── UserIdentifierMiddleware.php
│   │   │   └── Requests/
│   │   │       ├── StoreFavoriteRequest.php
│   │   │       └── UnsplashSearchRequest.php
│   │   ├── Models/
│   │   │   └── Favorite.php
│   │   ├── Services/
│   │   │   └── UnsplashService.php
│   │   ├── Repositories/
│   │   │   └── FavoriteRepository.php
│   │   ├── DataTransferObjects/
│   │   │   ├── PhotoData.php
│   │   │   ├── PhotoUrls.php
│   │   │   ├── PhotoLinks.php
│   │   │   └── PhotoUser.php
│   │   └── Constants/
│   │       └── ApiConstants.php
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   └── database.sqlite
│   ├── routes/
│   │   └── api.php
│   ├── tests/
│   │   ├── Feature/
│   │   └── Unit/
│   ├── phpstan.neon
│   └── .env
│
├── docker-compose.yml
├── .gitignore
├── MANUALE_UTENTE.md
└── README.md                    # Questo file
```

## Architettura

### Architettura Frontend

#### Componenti Principali

- **App.tsx**: Componente root, gestisce routing e layout
- **Navigation.tsx**: Barra navigazione con contatore preferiti e spinner
- **SearchPage.tsx**: Pagina ricerca con form e griglia risultati
- **FavoritesPage.tsx**: Pagina preferiti salvati
- **PhotoGrid.tsx**: Griglia responsive di foto con skeleton loading
- **PhotoCard.tsx**: Card singola foto con toggle preferiti e spinner
- **Toast.tsx**: Notifiche temporanee per operazioni
- **ErrorBoundary.tsx**: Gestione errori React

#### Context API

**FavoritesContext** - State management globale preferiti

```typescript
interface FavoritesContextValue {
  favorites: Favorite[]              // Array completo preferiti
  favoriteIds: Set<string>           // Set ID per lookup O(1)
  isLoading: boolean                 // Caricamento iniziale
  savingPhotoIds: Set<string>        // ID in fase di salvataggio
  error: string | null               // Errore corrente
  toasts: ToastMessage[]             // Notifiche
  toggleFavorite: (photo) => Promise<void>
  reloadFavorites: () => Promise<void>
  clearError: () => void
  removeToast: (id: string) => void
}
```

**Caratteristiche:**
- Aggiornamento ottimistico con rollback automatico
- Tracking stato salvataggio per feedback visivo
- Toast notifications per operazioni
- Gestione errori centralizzata

#### Custom Hooks

**useUnsplashSearch** - Gestione ricerca foto

```typescript
const {
  photos,           // Risultati ricerca
  isLoading,        // Stato caricamento
  error,            // Errore
  currentPage,      // Pagina corrente
  totalPages,       // Totale pagine
  currentQuery,     // Query attiva
  search,           // Funzione ricerca
  goToPage,         // Cambio pagina
  clearError        // Pulisci errore
} = useUnsplashSearch({ perPage: 12 })
```

**useUserId** - Identificazione utente

```typescript
const userId = useUserId()  // Genera e salva UUID in localStorage
```

### Architettura Backend

#### Layered Architecture

```
HTTP Request → Middleware → Controller → Service/Repository → Model → Database
                     ↓
              Response JSON
```

#### Controllers

**UnsplashController** - Proxy API Unsplash
- Delega logica a `UnsplashService`
- Validazione via `UnsplashSearchRequest`
- Cache responses (TTL 1h)

**FavoriteController** - CRUD Preferiti
- Utilizza `FavoriteRepository` per persistenza
- Validazione via `StoreFavoriteRequest`
- Supporto identificazione utente UUID

#### Services

**UnsplashService** - Business logic ricerca

```php
class UnsplashService {
    public function searchPhotos(
        string $query,
        int $page = 1,
        int $perPage = 12
    ): array
}
```

**Caratteristiche:**
- Caching risultati (1 ora TTL)
- Formattazione DTO standardizzato
- Gestione errori API Unsplash

#### Repositories

**FavoriteRepository** - Persistenza preferiti

```php
interface FavoriteRepositoryInterface {
    public function all(string $userId): Collection
    public function save(string $photoId, array $photoData, string $userId): Favorite
    public function findByPhotoId(string $photoId, string $userId): ?Favorite
    public function delete(Favorite $favorite): bool
}
```

#### Middleware

**UserIdentifierMiddleware** - Validazione UUID utente

```php
// Valida header X-User-ID
// Pattern: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
// Restituisce 400 se mancante o invalido
```

#### Data Transfer Objects

```php
readonly class PhotoData {
    public function __construct(
        public string $id,
        public ?int $width,
        public ?int $height,
        public ?string $description,
        public ?string $altDescription,
        public PhotoUrls $urls,
        public PhotoLinks $links,
        public PhotoUser $user,
        public ?string $createdAt,
    ) {}
}
```

## API REST

### Headers Richiesti

Tutte le richieste API richiedono:

```
X-User-ID: <uuid-v4>
Content-Type: application/json
```

### Endpoint Disponibili

#### Ricerca Foto

```http
GET /api/unsplash/search?query={term}&page={n}&per_page={n}
```

**Parametri:**
- `query` (required): termine ricerca
- `page` (optional): numero pagina, default 1
- `per_page` (optional): risultati per pagina, default 12, max 30

**Headers:**
```
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

**Risposta:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "abc123",
        "width": 4000,
        "height": 3000,
        "description": "Beautiful landscape",
        "alt_description": "Mountain view",
        "urls": {
          "raw": "https://...",
          "full": "https://...",
          "regular": "https://...",
          "small": "https://...",
          "thumb": "https://..."
        },
        "links": {
          "self": "https://api.unsplash.com/photos/...",
          "html": "https://unsplash.com/photos/...",
          "download": "https://unsplash.com/photos/.../download"
        },
        "user": {
          "id": "user123",
          "username": "photographer",
          "name": "John Doe",
          "portfolio_url": "https://...",
          "profile_image": "https://..."
        },
        "created_at": "2025-01-01T00:00:00Z"
      }
    ],
    "total": 10000,
    "total_pages": 834
  }
}
```

#### Lista Preferiti

```http
GET /api/favorites
```

**Headers:**
```
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

**Risposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "photo_id": "abc123",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "photo_data": { /* oggetto foto completo */ },
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### Aggiungi Preferito

```http
POST /api/favorites
```

**Headers:**
```
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
```

**Body:**
```json
{
  "photo_id": "abc123",
  "photo_data": {
    "id": "abc123",
    "width": 4000,
    "height": 3000,
    "urls": { /* ... */ },
    "links": { /* ... */ },
    "user": { /* ... */ }
  }
}
```

**Risposta:**
```json
{
  "success": true,
  "data": { /* favorite creato */ },
  "message": "Photo added to favorites"
}
```

#### Rimuovi Preferito

```http
DELETE /api/favorites/{photoId}
```

**Headers:**
```
X-User-ID: 550e8400-e29b-41d4-a716-446655440000
```

**Risposta:**
```json
{
  "success": true,
  "data": null,
  "message": "Photo removed from favorites"
}
```

## Database

### Schema SQLite

#### Tabella: `favorites`

| Colonna | Tipo | Descrizione |
|---------|------|-------------|
| id | BIGINT | Primary key auto-increment |
| photo_id | VARCHAR(255) | ID foto Unsplash |
| user_id | VARCHAR(36) | UUID utente |
| width | INTEGER | Larghezza foto |
| height | INTEGER | Altezza foto |
| description | TEXT | Descrizione foto |
| alt_description | TEXT | Testo alternativo |
| url_raw | TEXT | URL originale |
| url_full | TEXT | URL full resolution |
| url_regular | TEXT | URL regular (1080px) |
| url_small | TEXT | URL small (400px) |
| url_thumb | TEXT | URL thumbnail (200px) |
| link_self | TEXT | API endpoint foto |
| link_html | TEXT | Pagina Unsplash |
| link_download | TEXT | Link download |
| user_unsplash_id | VARCHAR | ID fotografo |
| user_username | VARCHAR | Username fotografo |
| user_name | VARCHAR | Nome fotografo |
| user_portfolio_url | TEXT | Portfolio fotografo |
| user_profile_image | TEXT | Avatar fotografo |
| photo_created_at | TIMESTAMP | Data creazione foto |
| created_at | TIMESTAMP | Data inserimento |
| updated_at | TIMESTAMP | Ultimo aggiornamento |

**Indici:**
- PRIMARY KEY (`id`)
- INDEX (`user_id`)
- UNIQUE (`photo_id`, `user_id`)

#### Tabella: `cache`

| Colonna | Tipo | Descrizione |
|---------|------|-------------|
| key | VARCHAR(255) | Cache key (PRIMARY) |
| value | TEXT | Valore serializzato |
| expiration | INTEGER | Timestamp scadenza |

**Migrazione da JSON a Colonne Separate:**

La struttura è stata migrata da un unico campo JSON `photo_data` a colonne separate per:
- ✅ Migliori performance query
- ✅ Possibilità di indicizzazione
- ✅ Type safety a livello DB
- ✅ Query più semplici e leggibili

Il modello Eloquent include un accessor `photo_data` per retrocompatibilità con il frontend.

## Testing

### Test Frontend (Vitest)

```bash
cd client

# Eseguire tutti i test
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# UI interattiva
npm run test:ui
```

**File di test:**
- `src/App.test.tsx` - Test componente App
- `src/components/PhotoGrid.test.tsx` - Test griglia
- `src/utils/math.test.ts` - Test utilities
- `src/test/integration.example.test.tsx` - Test integrazione

**Esempio test:**
```typescript
describe('PhotoGrid', () => {
  it('mostra skeleton durante caricamento', () => {
    render(<PhotoGrid photos={[]} isLoading={true} />)
    expect(screen.getAllByTestId('photo-skeleton')).toHaveLength(12)
  })
})
```

### Test Backend (PHPUnit)

```bash
cd server

# Tutti i test
php artisan test

# Con coverage
php artisan test --coverage

# Test specifico
php artisan test --filter=FavoriteTest
```

**File di test:**
- `tests/Feature/ExampleTest.php` - Test base API
- `tests/Feature/FavoriteTest.php` - Test CRUD preferiti
- `tests/Feature/UnsplashSearchTest.php` - Test ricerca

**Esempio test:**
```php
public function test_store_saves_favorite(): void
{
    $response = $this->withHeaders([
        'X-User-ID' => '550e8400-e29b-41d4-a716-446655440000',
    ])->postJson('/api/favorites', [
        'photo_id' => 'test123',
        'photo_data' => ['id' => 'test123', ...]
    ]);

    $response->assertStatus(201);
    $this->assertDatabaseHas('favorites', [
        'photo_id' => 'test123'
    ]);
}
```

### Analisi Statica (PHPStan)

```bash
cd server
./vendor/bin/phpstan analyse
```

Configurazione in `phpstan.neon` - Level 5.

## Comandi Utili

### Frontend

```bash
# Sviluppo
npm run dev              # Server dev con HMR
npm run build            # Build produzione
npm run preview          # Preview build

# Qualità codice
npm run lint             # ESLint
npm run lint:fix         # Fix automatico

# Testing
npm test                 # Run test
npm run test:watch       # Watch mode
npm run test:coverage    # Con coverage
npm run test:ui          # UI interattiva
```

### Backend

```bash
# Sviluppo
php artisan serve                    # Server sviluppo
php artisan migrate                  # Esegui migrazioni
php artisan migrate:fresh            # Reset DB
php artisan migrate:fresh --seed     # Reset + seed

# Cache
php artisan cache:clear              # Pulisci cache
php artisan cache:table              # Crea migrazione cache
php artisan config:cache             # Cache configurazione
php artisan config:clear             # Pulisci cache config

# Utilità
php artisan route:list               # Lista route
php artisan tinker                   # REPL interattivo

# Testing
php artisan test                     # Tutti i test
php artisan test --coverage          # Con coverage
./vendor/bin/phpstan analyse         # Analisi statica
```

### Docker

```bash
# Container
docker compose up -d                 # Avvia in background
docker compose up --build            # Rebuild + avvia
docker compose down                  # Ferma container
docker compose down -v               # Ferma + rimuovi volumi
docker compose ps                    # Status container

# Logs
docker compose logs -f               # Tutti i log (follow)
docker compose logs -f php           # Log specifico servizio
docker compose logs --tail=50 react  # Ultimi 50 log

# Exec comandi
docker compose exec php php artisan migrate
docker compose exec php php artisan test
docker compose exec react npm test

# Pulizia
docker compose down --rmi all        # Rimuovi anche immagini
docker system prune -a               # Pulizia completa Docker
```

## Troubleshooting

### Frontend

#### Errore "Connection Refused"

**Problema:** `GET http://localhost/api/favorites net::ERR_CONNECTION_REFUSED`

**Soluzione:**
```bash
# Verifica che il backend sia in esecuzione
cd server
php artisan serve

# Verifica configurazione .env
# client/.env deve contenere:
VITE_API_URL=http://localhost:8000/api
```

#### Spinner non visibile

**Problema:** Lo spinner di caricamento non appare

**Soluzione:**
- Verifica che il componente importi `SpinnerIcon` da `./icons`
- Controlla che Tailwind includa l'animazione `animate-spin`
- Rebuild del frontend: `npm run build`

### Backend

#### Database non trovato

**Problema:** `Database file does not exist`

**Soluzione:**
```bash
# Windows (PowerShell)
New-Item -Path database/database.sqlite -ItemType File -Force

# Linux/Mac
touch database/database.sqlite

# Esegui migrazioni
php artisan migrate:fresh
```

#### Tabella cache mancante

**Problema:** `no such table: cache`

**Soluzione:**
```bash
php artisan cache:table
php artisan migrate
```

#### Errore CORS

**Problema:** Errori CORS in console browser

**Soluzione:**

Laravel 11+ usa CORS nativo. Verifica `config/cors.php`:

```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

Assicurati che il middleware sia attivo in `bootstrap/app.php`.

#### Chiave Unsplash non funziona

**Problema:** Ricerca foto non restituisce risultati

**Soluzioni:**
1. Verifica chiave in `.env`: `UNSPLASH_ACCESS_KEY=...`
2. Pulisci cache config: `php artisan config:clear`
3. Controlla limiti rate Unsplash (50 req/h per app demo)
4. Verifica che l'app sia approvata su Unsplash
5. Test chiave con curl:
```bash
curl "https://api.unsplash.com/search/photos?query=test&client_id=TUA_CHIAVE"
```

#### Header X-User-ID mancante

**Problema:** `Missing X-User-ID header`

**Soluzione:**

Il middleware richiede l'header in tutte le richieste API. Verifica che:
1. Il frontend invii l'header (controllare `favorites.ts` e `unsplash.ts`)
2. L'UUID sia valido (formato UUID v4)
3. localStorage contenga `luxor_user_id`

Per test manuali:
```bash
curl -H "X-User-ID: 550e8400-e29b-41d4-a716-446655440000" \
     http://localhost:8000/api/favorites
```

### Docker

#### Port già in uso

**Problema:** `Bind for 0.0.0.0:8000 failed: port is already allocated`

**Soluzione:**
```bash
# Trova processo sulla porta
# Windows
netstat -ano | findstr :8000
taskkill /PID <pid> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9

# Oppure modifica porta in docker-compose.yml
ports:
  - "8001:80"  # Usa porta 8001 invece di 8000
```

#### Container non parte

**Problema:** Container in stato "Exited"

**Soluzione:**
```bash
# Vedi log errori
docker compose logs php
docker compose logs react

# Rebuild forzato
docker compose down
docker compose up --build --force-recreate
```

### Dipendenze PHP Mancanti

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install php8.2 php8.2-sqlite3 php8.2-mbstring \
                 php8.2-xml php8.2-curl php8.2-zip
```

**Windows:**

Abilita estensioni in `php.ini`:
```ini
extension=pdo_sqlite
extension=sqlite3
extension=mbstring
extension=fileinfo
extension=openssl
extension=curl
```

## Licenza

MIT License - Vedi file LICENSE per dettagli.

## Manuale Utente

Per istruzioni d'uso dell'applicazione, consulta [MANUALE_UTENTE.md](./MANUALE_UTENTE.md).

---

**Versione:** 1.0.0  
**Ultimo aggiornamento:** Novembre 2025
