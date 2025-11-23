# Подключение к базе данных MySQL

## Быстрый способ просмотра данных

Запустите скрипт для автоматического просмотра всех таблиц:

```bash
./view-db.sh
```

## Интерактивное подключение

### Способ 1: Через командную строку MySQL

```bash
mysql -u kifirchik -p -h localhost -P 3306 rfbnext
```

Пароль: `RD!c*zueHm7^WJ&MPZa2M0E4WFJKVp&A^r@Z8MmhhFUQaujJrE#Y3^FqZKDTN$JN5bgu^C&TKaREX*7Vs$&TGLcHKE4Mkg9i@I5b7dAC4jIOIJHjf0lWpUrR^OLwnda6`

### Способ 2: С паролем в одной строке (небезопасно, только для локального использования)

```bash
mysql -u kifirchik -p'RD!c*zueHm7^WJ&MPZa2M0E4WFJKVp&A^r@Z8MmhhFUQaujJrE#Y3^FqZKDTN$JN5bgu^C&TKaREX*7Vs$&TGLcHKE4Mkg9i@I5b7dAC4jIOIJHjf0lWpUrR^OLwnda6' -h localhost -P 3306 rfbnext
```

## Полезные SQL команды

После подключения к базе данных:

```sql
-- Показать все таблицы
SHOW TABLES;

-- Посмотреть структуру таблицы users
DESCRIBE users;

-- Показать все пользователи
SELECT * FROM users;

-- Показать пользователей с ограничением
SELECT id, phone_number, screen_name, role, created_at FROM users LIMIT 10;

-- Подсчитать количество записей
SELECT COUNT(*) FROM users;

-- Поиск по номеру телефона
SELECT * FROM users WHERE phone_number LIKE '%123%';

-- Показать пользователей по роли
SELECT * FROM users WHERE role = 'Участник';

-- Показать билеты
SELECT * FROM tikets;

-- Показать теги
SELECT * FROM tags;
```

## Если MySQL не запущен

```bash
# Запустить MySQL
sudo systemctl start mysql
# или
sudo systemctl start mysqld

# Проверить статус
sudo systemctl status mysql
```

## Если база данных не создана

```bash
# Создать базу данных и таблицы
./setup-db.sh
```

## Графические инструменты (опционально)

Если предпочитаете графический интерфейс:

1. **phpMyAdmin** - веб-интерфейс для MySQL
2. **MySQL Workbench** - официальный GUI от Oracle
3. **DBeaver** - универсальный инструмент для работы с БД
4. **TablePlus** - современный GUI для БД

Для подключения используйте те же данные:
- Host: `localhost`
- Port: `3306`
- User: `kifirchik`
- Password: `RD!c*zueHm7^WJ&MPZa2M0E4WFJKVp&A^r@Z8MmhhFUQaujJrE#Y3^FqZKDTN$JN5bgu^C&TKaREX*7Vs$&TGLcHKE4Mkg9i@I5b7dAC4jIOIJHjf0lWpUrR^OLwnda6`
- Database: `rfbnext`

