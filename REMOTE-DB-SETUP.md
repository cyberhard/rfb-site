# Настройка удалённого подключения к MySQL

## Настройка на сервере MySQL

### 1. Настройка MySQL для удалённых подключений

Отредактируйте конфигурационный файл MySQL:

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Найдите строку:
```
bind-address = 127.0.0.1
```

Измените на:
```
bind-address = 0.0.0.0
```

Или закомментируйте:
```
# bind-address = 127.0.0.1
```

Сохраните и перезапустите MySQL:
```bash
sudo systemctl restart mysql
```

### 2. Создание пользователя с удалённым доступом

Подключитесь к MySQL как root:

```bash
sudo mysql -u root
```

Выполните:

```sql
-- Создать пользователя с доступом с любого хоста (НЕ БЕЗОПАСНО для продакшена!)
CREATE USER 'kifirchik'@'%' IDENTIFIED BY 'RD!c*zueHm7^WJ&MPZa2M0E4WFJKVp&A^r@Z8MmhhFUQaujJrE#Y3^FqZKDTN$JN5bgu^C&TKaREX*7Vs$&TGLcHKE4Mkg9i@I5b7dAC4jIOIJHjf0lWpUrR^OLwnda6';

-- Или создать пользователя с доступом только с конкретного IP (БЕЗОПАСНЕЕ)
CREATE USER 'kifirchik'@'YOUR_IP_ADDRESS' IDENTIFIED BY 'RD!c*zueHm7^WJ&MPZa2M0E4WFJKVp&A^r@Z8MmhhFUQaujJrE#Y3^FqZKDTN$JN5bgu^C&TKaREX*7Vs$&TGLcHKE4Mkg9i@I5b7dAC4jIOIJHjf0lWpUrR^OLwnda6';

-- Дать права на базу данных
GRANT ALL PRIVILEGES ON rfbnext.* TO 'kifirchik'@'%';
-- или для конкретного IP:
-- GRANT ALL PRIVILEGES ON rfbnext.* TO 'kifirchik'@'YOUR_IP_ADDRESS';

-- Применить изменения
FLUSH PRIVILEGES;

-- Проверить пользователей
SELECT user, host FROM mysql.user WHERE user = 'kifirchik';

-- Выйти
EXIT;
```

### 3. Настройка Firewall (если используется)

Разрешите подключения к порту 3306:

```bash
# UFW (Ubuntu)
sudo ufw allow 3306/tcp
sudo ufw reload

# Или для конкретного IP (безопаснее)
sudo ufw allow from YOUR_IP_ADDRESS to any port 3306

# Firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-port=3306/tcp
sudo firewall-cmd --reload

# Или для конкретного IP
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="YOUR_IP_ADDRESS" port port="3306" protocol="tcp" accept'
sudo firewall-cmd --reload
```

## Настройка на клиенте (ваш компьютер)

### 1. Обновить .env файл

Измените в файле `.env`:

```env
DB_HOST=YOUR_SERVER_IP
DB_PORT=3306
DB_USER=kifirchik
DB_PASSWORD=RD!c*zueHm7^WJ&MPZa2M0E4WFJKVp&A^r@Z8MmhhFUQaujJrE#Y3^FqZKDTN$JN5bgu^C&TKaREX*7Vs$&TGLcHKE4Mkg9i@I5b7dAC4jIOIJHjf0lWpUrR^OLwnda6
DB_NAME=rfbnext
```

Замените `YOUR_SERVER_IP` на IP-адрес вашего сервера MySQL.

### 2. Подключение через командную строку

```bash
mysql -u kifirchik -p -h YOUR_SERVER_IP -P 3306 rfbnext
```

### 3. Использование скриптов

Скрипты `view-db.sh` и `setup-db.sh` автоматически используют настройки из `.env`.

Или можно указать параметры вручную:

```bash
DB_HOST=YOUR_SERVER_IP ./view-db.sh
```

## Проверка подключения

### С сервера MySQL:

```bash
# Проверить, слушает ли MySQL на всех интерфейсах
sudo netstat -tlnp | grep 3306
# или
sudo ss -tlnp | grep 3306
```

Должно показать что-то вроде:
```
tcp  0  0.0.0.0:3306  0.0.0.0:*  LISTEN  ...
```

### С клиента:

```bash
# Проверить доступность порта
telnet YOUR_SERVER_IP 3306
# или
nc -zv YOUR_SERVER_IP 3306

# Попробовать подключиться
mysql -u kifirchik -p -h YOUR_SERVER_IP -P 3306 -e "SELECT 1;"
```

## Безопасность

⚠️ **ВАЖНО для продакшена:**

1. **Используйте конкретные IP-адреса** вместо `%`:
   ```sql
   CREATE USER 'kifirchik'@'192.168.1.100' IDENTIFIED BY 'password';
   ```

2. **Используйте SSH туннель** (рекомендуется):
   ```bash
   ssh -L 3306:localhost:3306 user@your_server
   ```
   Затем подключайтесь к `localhost:3306`

3. **Используйте VPN** для доступа к БД

4. **Ограничьте доступ через firewall** только нужными IP

5. **Используйте SSL** для шифрования соединения:
   ```sql
   GRANT ALL PRIVILEGES ON rfbnext.* TO 'kifirchik'@'%' REQUIRE SSL;
   ```

6. **Регулярно меняйте пароли**

## Альтернатива: SSH туннель (самый безопасный способ)

Если не хотите открывать порт 3306, используйте SSH туннель:

```bash
# Создать туннель
ssh -L 3306:localhost:3306 user@your_server

# В другом терминале подключиться как к локальной БД
mysql -u kifirchik -p -h 127.0.0.1 -P 3306 rfbnext
```

В `.env` используйте:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
```

## Troubleshooting

### Ошибка: "Can't connect to MySQL server"

1. Проверьте, что MySQL запущен: `sudo systemctl status mysql`
2. Проверьте bind-address в конфиге
3. Проверьте firewall правила
4. Проверьте, что пользователь имеет права на подключение с вашего IP

### Ошибка: "Access denied"

1. Проверьте правильность пароля
2. Проверьте, что пользователь создан с правильным host (`%` или ваш IP)
3. Выполните `FLUSH PRIVILEGES;` после создания пользователя

### Ошибка: "Host is not allowed to connect"

Пользователь создан только для localhost. Создайте пользователя с `@'%'` или `@'YOUR_IP'`

