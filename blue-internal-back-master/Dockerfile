# Use an official PHP image as the base image
FROM php:8.2-apache

# Install PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libpq-dev \
    libcurl4-gnutls-dev \
    && docker-php-ext-install pdo pdo_mysql bcmath

# Set the working directory to /app
WORKDIR /var/www/html

# Copy PHP application to the container
COPY . .

# Enable the ext-zip extension
RUN apt-get install -y libzip-dev && docker-php-ext-install zip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Expose port 80  
EXPOSE 80

# start Apache
CMD ["apache2-foreground"]