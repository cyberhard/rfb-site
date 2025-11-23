# Инструкция по запуску проекта

## ✅ Что уже сделано:
- ✅ Исправлена опечатка в `db.ts` (createPoll → createPool)
- ✅ Добавлен импорт NextResponse в `middleware.ts`
- ✅ Обновлён `.env` на порт MySQL (3306)
- ✅ Dev сервер запущен на `http://127.0.0.1:3000`

## 📋 Что нужно сделать:

### 1. Запустить MySQL сервер

```bash
# Для Ubuntu/Debian:
sudo systemctl start mysql
# или
sudo systemctl start mysqld

# Проверить статус:
sudo systemctl status mysql
```

### 2. Создать базу данных

Запустите скрипт создания БД:

```bash
./setup-db.sh
```

Или вручную:

```bash
mysql -u kifirchik -p < database.sql
```

Пароль из `.env`: `RD!c*zueHm7^WJ&MPZa2M0E4WFJKVp&A^r@Z8MmhhFUQaujJrE#Y3^FqZKDTN$JN5bgu^C&TKaREX*7Vs$&TGLcHKE4Mkg9i@I5b7dAC4jIOIJHjf0lWpUrR^OLwnda6`

### 3. Проверить подключение

После создания БД, API эндпоинты должны работать:
- `POST /api/auth/register` - регистрация
- `POST /api/auth/login` - вход
- `GET /api/auth/callback/vk` - VK OAuth

## 🔧 Текущие настройки (.env):

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=kifirchik
DB_NAME=rfbnext
```

## 🚀 Запуск сервера:

```bash
npm run dev
```

Сервер будет доступен на: `http://127.0.0.1:3000`

## 📝 Примечания:

- Если MySQL не установлен, установите его:
  ```bash
  sudo apt update
  sudo apt install mysql-server
  ```

- Если возникают проблемы с подключением к БД, проверьте:
  1. Запущен ли MySQL: `sudo systemctl status mysql`
  2. Правильность учётных данных в `.env`
  3. Существует ли база данных: `mysql -u kifirchik -p -e "SHOW DATABASES;"`

