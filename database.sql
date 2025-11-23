-- SQL скрипт для создания базы данных
-- Используется MySQL/MariaDB

CREATE DATABASE IF NOT EXISTS rfbnext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rfbnext;

-- Таблица users (основная таблица пользователей)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vk_id VARCHAR(255) NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    screen_name VARCHAR(100) NOT NULL,
    photo_url VARCHAR(500) NULL,
    sity VARCHAR(100) NULL,
    role VARCHAR(50) DEFAULT 'Участник',
    tags VARCHAR(100) NULL,
    status VARCHAR(50) NULL,
    availability BOOLEAN DEFAULT FALSE,
    defile BOOLEAN DEFAULT FALSE,
    merch BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone_number),
    INDEX idx_vk_id (vk_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица tikets (билеты)
CREATE TABLE IF NOT EXISTS tikets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vk_id INT NULL,
    user_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_vk_id (vk_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица tags (теги пользователей - альтернативная структура)
-- Примечание: В коде availability, defile, merch используются в таблице users
-- Эта таблица может использоваться для дополнительных тегов
CREATE TABLE IF NOT EXISTS tags (
    vk_id INT PRIMARY KEY,
    availability BOOLEAN NOT NULL DEFAULT FALSE,
    defile BOOLEAN NOT NULL DEFAULT FALSE,
    merch BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

