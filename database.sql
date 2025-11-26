-- SQL скрипт для создания базы данных
-- Используется MySQL/MariaDB
-- Структура соответствует DB.md

CREATE DATABASE IF NOT EXISTS rfbnext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rfbnext;

-- Таблица users (основная таблица пользователей)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sity VARCHAR(100) NOT NULL COMMENT 'Город участника',
    screen_name VARCHAR(100) NOT NULL COMMENT 'Отображаемое имя пользователя',
    phone_number VARCHAR(20) UNIQUE NOT NULL COMMENT 'Номер участника ака его логин',
    password VARCHAR(255) NOT NULL COMMENT 'хэшированный пароль участника',
    role VARCHAR(50) COMMENT 'Участник, Вип, Вип+, Спонсор, Контролёр, Админка, Организатор',
    availability BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Статус прибытия true, false',
    defile BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Участник дефиле (true, false)',
    merch BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Выдан ли мерч (true, false)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица tikets (билеты)
CREATE TABLE IF NOT EXISTS tikets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) COMMENT 'Участник, Вип, Вип+, Спонсор',
    price INT COMMENT '600, 1000, 2000, 8000',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица ivents (события)
CREATE TABLE IF NOT EXISTS ivents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titile VARCHAR(255) NOT NULL COMMENT 'название ивента',
    time DATETIME DEFAULT (CONCAT('2024-07-30 ', TIME(NOW()))) COMMENT '30 июля дефолтное значение, задаём только время',
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

