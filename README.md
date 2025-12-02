# Luxor - Documentazione Completa

Applicazione web full-stack per la ricerca e il salvataggio di foto da Unsplash.

## 📋 Indice

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

## Stack Tecnologico

### Frontend
- **React** 19 - UI library
- **TypeScript** 5.x - Type safety
- **Tailwind CSS** 4.x - Styling
- **Vite** 7.x - Build tool
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

CACHE_STORE=database

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
VITE_API_TARGET=http://localhost:8000
```

**Nota sul Proxy:**
La variabile `VITE_API_TARGET` permette di configurare il target del proxy API.
- Se non definita, il default è `http://nginx:80` (per Docker).
- Per sviluppo locale, impostarla a `http://localhost:8000`.

### Setup con Docker

#### 1. Preparazione

```bash
# 1. Clonare il repository
git clone <repository-url>
cd luxor-project

# 2. Configurare Backend
cd server
cp .env.example .env
touch database/database.sqlite
# Modificare .env inserendo la UNSPLASH_ACCESS_KEY
cd ..
```

**Configurazione Environment:**

- **Backend (`server/.env`)**:
  È necessario impostare solo `UNSPLASH_ACCESS_KEY`.
  Le variabili per il database (`DB_CONNECTION`, `DB_DATABASE`) vengono iniettate automaticamente da Docker Compose.

- **Frontend**:
  Non è necessario configurare nulla. Docker Compose imposta automaticamente `VITE_API_URL=http://localhost/api`.

#### 2. Avviare e Installare Dipendenze

```bash
# 1. Avviare i container
docker compose up -d --build

# 2. Installare dipendenze PHP (Backend)
docker compose exec php composer install

# 3. Generare Application Key
docker compose exec php php artisan key:generate

# 4. Eseguire migrazioni Database
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
└── README.md                    # Questo file
```

## Architettura

### Scelte Progettuali Chiave

#### Backend: DTO e Type Safety
L'applicazione utilizza **Data Transfer Objects (DTO)** (es. `PhotoData`) per incapsulare i dati provenienti da Unsplash.
- **Perché?**: Evita l'uso di array associativi non tipizzati ("array hell"), garantisce che la struttura interna sia indipendente dalle modifiche dell'API esterna e fornisce autocompletamento nell'IDE.
- **Implementazione**: Classi PHP 8.2 `readonly` con property promotion.

#### Backend: Caching Intelligente
Le richieste verso Unsplash sono cachate per 1 ora.
- **Perché?**: Riduce drasticamente la latenza per ricerche frequenti e preserva il rate limit dell'API Unsplash.
- **Logica**: La chiave di cache è univoca per query e paginazione (`unsplash_search_{query}_{page}`).

#### Identificazione Utente "Frictionless"
Il sistema non richiede registrazione classica ma identifica l'utente tramite UUID.
- **Frontend**: L'hook `useUserId` genera un UUID v4 al primo accesso e lo persiste nel `localStorage`.
- **Backend**: Il middleware `UserIdentifierMiddleware` valida l'header `X-User-ID` su ogni richiesta API (regex check).
- **Vantaggio**: Esperienza utente immediata senza barriere all'ingresso, mantenendo la persistenza dei dati.

#### Pattern Repository
L'accesso ai dati è astratto tramite il pattern Repository (`FavoriteRepository`).
- **Implementazione**: Il controller non usa mai direttamente il modello Eloquent, ma passa attraverso un'interfaccia.
- **Vantaggio**: Disaccoppia la logica di business dall'accesso ai dati, facilitando il testing (mocking dell'interfaccia) e future migrazioni dello storage.

#### Strategia di Error Handling
- **Frontend**: Un `ErrorBoundary` globale cattura crash imprevisti di React, mentre il Context gestisce errori API specifici con notifiche Toast non intrusive.
- **Backend**: Logging contestuale nel Service layer (es. parametri query falliti) prima di rilanciare le eccezioni al gestore globale.

#### Validazione Robusta
Ogni richiesta in ingresso è validata tramite **Form Requests** dedicate (es. `StoreFavoriteRequest`).
- **Sicurezza**: Previene injection e dati malformati prima che raggiungano il controller.
- **Feedback**: Restituisce messaggi di errore dettagliati e localizzati (422 Unprocessable Entity).
- **Struttura**: Valida anche oggetti JSON annidati (es. `photo_data.urls.regular`).

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
