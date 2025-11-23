# RusFurBal-4 Site

Сайт фестиваля RusFurBal-4 на Next.js с авторизацией через логин и пароль.

## Настройка базы данных MySQL

### 1. Установка MySQL

Убедитесь, что MySQL установлен и запущен на вашем сервере.

### 2. Создание базы данных

Выполните SQL скрипт из файла `database/init.sql`:

```bash
mysql -u root -p < database/init.sql
```

Или выполните команды вручную в MySQL клиенте:

```sql
CREATE DATABASE IF NOT EXISTS rfb_site CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rfb_site;
-- Затем выполните остальные команды из database/init.sql
```

### 3. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=rfb_site

# Node Environment
NODE_ENV=development
```

Замените значения на ваши реальные данные для подключения к MySQL.

## Установка зависимостей

```bash
npm install
```

## Запуск проекта

### Режим разработки

```bash
npm run dev
```

Откройте [http://127.0.0.1:3000](http://127.0.0.1:3000) в браузере.

### Production сборка

```bash
npm run build
npm start
```

## Структура базы данных

База данных содержит три основные таблицы:

- **users** - пользователи системы (логин через номер телефона)
- **tikets** - типы билетов
- **ivents** - события/мероприятия

Подробная структура описана в файле `DB.md`.

## API Endpoints

### Авторизация

- `POST /api/auth/register` - регистрация нового пользователя
- `POST /api/auth/login` - вход по логину и паролю
- `GET /api/auth/me` - получение информации о текущем пользователе
- `POST /api/auth/logout` - выход из системы

## Роли пользователей

Согласно схеме БД, поддерживаются следующие роли:
- Участник (по умолчанию)
- Вип
- Вип+
- Спонсор
- Контролёр
- Админка
- Организатор

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)
