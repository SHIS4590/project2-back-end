CREATE DATABASE cart CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER cart_user@localhost IDENTIFIED BY 'password123456';
GRANT ALL PRIVILEGES ON cart.* TO cart_user@localhost;
