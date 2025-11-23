# Быстрая настройка удалённого подключения

## На сервере MySQL (где находится база данных)

### 1. Разрешить удалённые подключения

```bash
# Отредактировать конфиг
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Найти и изменить:
bind-address = 0.0.0.0

# Перезапустить
sudo systemctl restart mysql
```

### 2. Создать пользователя с удалённым доступом

```bash
sudo mysql -u root
```

```sql
-- Для доступа с любого IP (небезопасно, только для теста!)
CREATE USER 'kifirchik'@'%' IDENTIFIED BY 'ваш_пароль';
GRANT ALL PRIVILEGES ON rfbnext.* TO 'kifirchik'@'%';
FLUSH PRIVILEGES;
EXIT;
```

**Безопаснее:** использовать конкретный IP:
```sql
CREATE USER 'kifirchik'@'YOUR_IP_ADDRESS' IDENTIFIED BY 'ваш_пароль';
GRANT ALL PRIVILEGES ON rfbnext.* TO 'kifirchik'@'YOUR_IP_ADDRESS';
FLUSH PRIVILEGES;
```

### 3. Открыть порт в firewall

```bash
sudo ufw allow 3306/tcp
# или для конкретного IP:
sudo ufw allow from YOUR_IP_ADDRESS to any port 3306
```

## На вашем компьютере (клиент)

### 1. Обновить .env

Измените `DB_HOST` на IP сервера:

```env
DB_HOST=YOUR_SERVER_IP
DB_PORT=3306
DB_USER=kifirchik
DB_PASSWORD=ваш_пароль
DB_NAME=rfbnext
```

### 2. Подключиться

```bash
# Через скрипт (автоматически использует .env)
./view-db.sh

# Или напрямую
mysql -u kifirchik -p -h YOUR_SERVER_IP -P 3306 rfbnext
```

## Альтернатива: SSH туннель (рекомендуется для безопасности)

Не нужно открывать порт 3306!

```bash
# Создать туннель
ssh -L 3306:localhost:3306 user@your_server

# В .env используйте:
DB_HOST=127.0.0.1
DB_PORT=3306
```

## Проверка

```bash
# Проверить доступность
telnet YOUR_SERVER_IP 3306

# Или
nc -zv YOUR_SERVER_IP 3306
```

Подробная инструкция: `REMOTE-DB-SETUP.md`

