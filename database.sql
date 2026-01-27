-- 1. Создание базы данных
CREATE DATABASE IF NOT EXISTS rfbnext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rfbnext;

-- 2. Настройка пользователя (kifirchik)
-- Создаем пользователя, если он не существует, и обновляем права
CREATE USER IF NOT EXISTS 'kifirchik'@'localhost' IDENTIFIED BY 'RD!c*zueHm7^WJ&MPZa2M0E4WFJKVp&A^r@Z8MmhhFUQaujJrE#Y3^FqZKDTN$JN5bgu^C&TKaREX*7Vs$&TGLcHKE4Mkg9i@I5b7dAC4jIOIJHjf0lWpUrR^OLwnda6';
GRANT ALL PRIVILEGES ON rfbnext.* TO 'kifirchik'@'localhost';
FLUSH PRIVILEGES;
-- 3. Создание таблиц

-- Таблица tickets (исправлено название)
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL COMMENT 'Тип: Участник, Вип, Вип+, Спонсор',
    price INT NOT NULL COMMENT 'Цена в рублях',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Заполняем типы билетов (безопасно, без дубликатов)
INSERT IGNORE INTO tickets (id, type, price) VALUES 
(1, 'Участник', 600),
(2, 'Вип', 1000),
(3, 'Вип+', 2000),
(4, 'Спонсор', 8000);

-- Таблица users (исправлено city)
CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  city VARCHAR(100) NOT NULL COMMENT 'Город участника',
  screen_name VARCHAR(100) NOT NULL COMMENT 'Отображаемое имя',
  phone_number VARCHAR(20) NOT NULL COMMENT 'Номер телефона (логин)',
  password VARCHAR(255) NOT NULL COMMENT 'Хэшированный пароль',
  ticket_id INT NULL COMMENT 'Тип билета',
  role VARCHAR(50) DEFAULT NULL COMMENT 'Роль в системе',
  avatar_url VARCHAR(500) DEFAULT NULL,
  description TEXT,
  availability TINYINT(1) DEFAULT 0 COMMENT 'Прибыл на мероприятие',
  defile TINYINT(1) DEFAULT 0 COMMENT 'Участвует в дефиле',
  merch TINYINT(1) DEFAULT 0 COMMENT 'Мерч выдан',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY phone_number (phone_number),
  KEY idx_phone (phone_number),
  FOREIGN KEY (ticket_id) REFERENCES tickets(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица events
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT 'Название события',
    event_time DATETIME DEFAULT NULL COMMENT 'Время проведения',
    status VARCHAR(50) DEFAULT 'planned' COMMENT 'Статус: planned, active, completed, cancelled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;