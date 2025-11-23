#!/bin/bash
# Скрипт для настройки пользователя MySQL с удалённым доступом

echo "=========================================="
echo "Настройка удалённого доступа к MySQL"
echo "=========================================="
echo ""

read -p "Введите IP-адрес для доступа (или '%' для любого IP, небезопасно): " REMOTE_IP
read -p "Введите имя пользователя [kifirchik]: " DB_USER
DB_USER=${DB_USER:-kifirchik}

read -sp "Введите пароль: " DB_PASSWORD
echo ""

read -p "Введите имя базы данных [rfbnext]: " DB_NAME
DB_NAME=${DB_NAME:-rfbnext}

echo ""
echo "Создание пользователя '$DB_USER'@'$REMOTE_IP' для базы '$DB_NAME'..."

# SQL команды
SQL="
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS '${DB_USER}'@'${REMOTE_IP}' IDENTIFIED BY '${DB_PASSWORD}';

GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'${REMOTE_IP}';

FLUSH PRIVILEGES;

SELECT user, host FROM mysql.user WHERE user = '${DB_USER}';
"

echo ""
echo "Подключитесь к MySQL как root и выполните:"
echo "----------------------------------------"
echo "sudo mysql -u root"
echo ""
echo "Затем выполните следующие команды:"
echo "----------------------------------------"
echo "$SQL"
echo "----------------------------------------"
echo ""

# Попытка выполнить автоматически (если есть доступ)
if command -v mysql &> /dev/null; then
    read -p "Попытаться выполнить автоматически? (y/n): " AUTO
    if [ "$AUTO" = "y" ] || [ "$AUTO" = "Y" ]; then
        echo "$SQL" | sudo mysql -u root
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Пользователь успешно создан!"
        else
            echo ""
            echo "❌ Ошибка. Выполните команды вручную."
        fi
    fi
fi

echo ""
echo "После создания пользователя:"
echo "1. Измените bind-address в /etc/mysql/mysql.conf.d/mysqld.cnf:"
echo "   bind-address = 0.0.0.0"
echo ""
echo "2. Перезапустите MySQL:"
echo "   sudo systemctl restart mysql"
echo ""
echo "3. Настройте firewall (если нужно):"
echo "   sudo ufw allow 3306/tcp"
echo ""
echo "Подробная инструкция: cat REMOTE-DB-SETUP.md"

