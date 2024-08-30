FROM php:8.2-fpm-alpine
LABEL maintainer="HieuMinh"

# Set working directory
WORKDIR /var/www/html

# Install Additional dependencies
RUN apk update && apk add --no-cache \
    build-base openssl-dev autoconf shadow supervisor \
    zip libzip-dev \
    imagemagick \
    libmcrypt \
    imagemagick-dev \
    libmcrypt-dev \
    php-common \
    php-pdo \
    php-pdo_mysql \
    php-mysqli \
    php-xml \
    php-openssl \
    php-json \
    php-phar \
    php-zip \
    php-gd \
    php-dom \
    php-session \
    php-zlib \
    php-intl \
    php-zip \
    php-cli \
    php-curl\
    \
    # Install imagick
    && pecl install imagick \
    && docker-php-ext-enable imagick \
    && true \
    # Install kafka
    && apk add --no-cache librdkafka-dev \
    && pecl install rdkafka \
    && true \
    \
    # Install mcrypt
    && pecl install mcrypt \
    && docker-php-ext-enable mcrypt \
    && true \
    \
    && docker-php-ext-configure zip \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb \
    && rm -rf /var/cache/apk/* \
    \
    # Add and Enable PHP-PDO Extenstions for PHP connect Mysql
    && docker-php-ext-install pdo pdo_mysql zip \
    && docker-php-ext-enable pdo_mysql

# Install PHP Extensions (igbinary & memcached)
RUN apk add --no-cache --update libmemcached-libs zlib
RUN set -xe && \
    cd /tmp/ && \
    apk add --no-cache --update --virtual .phpize-deps $PHPIZE_DEPS && \
    apk add --no-cache --update --virtual .memcached-deps zlib-dev libmemcached-dev cyrus-sasl-dev && \
    pecl install igbinary && \
    ( \
    pecl install --nobuild memcached && \
    cd "$(pecl config-get temp_dir)/memcached" && \
    phpize && \
    ./configure --enable-memcached-igbinary && \
    make -j$(nproc) && \
    make install && \
    cd /tmp/ \
    ) && \
    docker-php-ext-enable igbinary memcached && \
    rm -rf /tmp/* && \
    apk del .memcached-deps .phpize-deps

# Setup GD extension
RUN apk add --no-cache \
    freetype \
    libjpeg-turbo \
    libpng \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    && docker-php-ext-configure gd \
    --with-freetype=/usr/include/ \
    --with-jpeg=/usr/include/ \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-enable gd \
    && apk del --no-cache \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    && rm -rf /tmp/*

# This extension required for Laravel Horizon
RUN docker-php-ext-install pcntl
COPY .docker/php/php.ini /usr/local/etc/php/conf.d/docker-php.ini

# Remove Cache
RUN rm -rf /var/cache/apk/*

# COPY .docker/supervisor/supervisord.conf /etc/supervisord.conf
# COPY .docker/supervisor/supervisor.d /etc/supervisor.d

# Add UID '1000' to www-data
RUN usermod -u 1000 www-data

# Copy existing application directory
COPY . .

# Chang app directory permission
RUN chown -R www-data:www-data .

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer

# ENTRYPOINT ["sh", "/var/www/html/.docker/docker-entrypoint.sh"]

# CMD supervisord -n -c /etc/supervisord.conf
