# Установка MySQL на Ubuntu/Debian

## Вариант 1: Установка MySQL Server

```bash
# Обновить список пакетов
sudo apt update

# Установить MySQL Server
sudo apt install mysql-server -y

# Запустить MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Проверить статус
sudo systemctl status mysql
```

## Вариант 2: Установка MariaDB (совместим с MySQL)

```bash
# Обновить список пакетов
sudo apt update

# Установить MariaDB
sudo apt install mariadb-server -y

# Запустить MariaDB
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Проверить статус
sudo systemctl status mariadb
```

## Настройка безопасности MySQL

После установки выполните:

```bash
sudo mysql_secure_installation
```

Это поможет:
- Установить пароль для root
- Удалить анонимных пользователей
- Отключить удалённый доступ для root
- Удалить тестовую базу данных

## Создание пользователя для приложения

После установки MySQL подключитесь как root:

```bash
sudo mysql -u root
```

И выполните:

```sql
-- Создать пользователя (если ещё не создан)
CREATE USER IF NOT EXISTS 'kifirchik'@'localhost' IDENTIFIED BY 'RD!c*zueHm7^WJ&MPZa2M0E4WFJKVp&A^r@Z8MmhhFUQaujJrE#Y3^FqZKDTN$JN5bgu^C&TKaREX*7Vs$&TGLcHKE4Mkg9i@I5b7dAC4jIOIJHjf0lWpUrR^OLwnda6';

-- Дать все права на базу данных
GRANT ALL PRIVILEGES ON rfbnext.* TO 'kifirchik'@'localhost';

-- Применить изменения
FLUSH PRIVILEGES;

-- Выйти
EXIT;
```

## Альтернатива: Использовать существующую БД

Если у вас уже есть MySQL на другом сервере, измените в `.env`:

```
DB_HOST=your_mysql_host
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=rfbnext
```

## Проверка установки

```bash
# Проверить версию
mysql --version

# Проверить статус сервиса
sudo systemctl status mysql

# Попробовать подключиться
mysql -u root -p
```

