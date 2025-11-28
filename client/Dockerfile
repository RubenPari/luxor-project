# ============================================
# Dockerfile per Frontend React/Vite (Sviluppo)
# ============================================
# Questo Dockerfile è ottimizzato per lo sviluppo locale con hot reload.
# Per la produzione, usare un build multi-stage con nginx.

FROM node:20-alpine

# Imposta la directory di lavoro nel container
WORKDIR /app

# Copia i file di configurazione delle dipendenze
# Separare questo step permette di cachare le dipendenze se package.json non cambia
COPY package*.json ./

# Installa tutte le dipendenze (incluse devDependencies per Vite)
RUN npm install

# Copia il resto dei file dell'applicazione
# Questo viene eseguito dopo npm install per ottimizzare la cache di Docker
COPY . .

# Esponi la porta 5173 (porta interna Vite)
# Verrà mappata su 3000 dall'host tramite docker-compose
EXPOSE 5173

# Il comando di avvio è definito in docker-compose.yml: npm run dev
