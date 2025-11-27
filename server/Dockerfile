# ============================================
# Dockerfile Multi-stage per Applicazione Laravel
# ============================================

# ============================================
# Stage 1: Build degli Asset Node
# ============================================
FROM node:20-alpine AS node-builder

WORKDIR /app

# Copia i file package
COPY package*.json ./

# Installa le dipendenze
RUN npm ci --only=production

# Copia i file sorgente per il build
COPY . .

# Compila gli asset
RUN npm run build

# ============================================
# Stage 2: Immagine Base PHP
# ============================================
FROM php:8.2-fpm-alpine AS base

# Installa le dipendenze di sistema
RUN apk add --no-cache \
    bash \
    curl \
    git \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    zip \
    unzip \
    icu-dev \
    oniguruma-dev \
    postgresql-dev \
    mysql-client \
    supervisor \
    nginx

# Installa le estensioni PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    gd \
    pdo \
    pdo_mysql \
    pdo_pgsql \
    zip \
    intl \
    mbstring \
    opcache \
    bcmath

# Installa Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Configura PHP
COPY docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# ============================================
# Stage 3: Immagine di Sviluppo
# ============================================
FROM base AS development

# Installa Xdebug per lo sviluppo
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && apk del .build-deps

# Configurazione Xdebug
COPY docker/php/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

WORKDIR /var/www/html

# Copia i file dell'applicazione
COPY --chown=www-data:www-data . .

# Installa le dipendenze PHP (incluse quelle di sviluppo)
RUN composer install --no-interaction --no-progress

# Espone la porta
EXPOSE 9000

CMD ["php-fpm"]

# ============================================
# Stage 4: Immagine di Produzione
# ============================================
FROM base AS production

# Imposta la directory di lavoro
WORKDIR /var/www/html

# Copia i file composer
COPY composer.json composer.lock ./

# Installa le dipendenze PHP di produzione
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --optimize-autoloader \
    --no-scripts

# Copia i file dell'applicazione
COPY --chown=www-data:www-data . .

# Copia gli asset compilati da node-builder
COPY --from=node-builder --chown=www-data:www-data /app/public/build ./public/build

# Esegue i comandi di ottimizzazione Laravel
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Configura Nginx
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf

# Configura Supervisor
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Imposta i permessi corretti
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Crea la directory dei log
RUN mkdir -p /var/log/supervisor

# Espone la porta
EXPOSE 80

# Avvia supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
