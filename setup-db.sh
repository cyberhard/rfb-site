#!/bin/bash
# Скрипт для создания базы данных MySQL
# Поддерживает удалённые подключения через настройки в .env

# Загрузить настройки из .env если файл существует
if [ -f .env ]; then
    export $(grep -v '^#' .env | grep -E '^DB_' | xargs)
fi

DB_USER="${DB_USER:-kifirchik}"
DB_PASSWORD="${DB_PASSWORD:-RD!c*zueHm7^WJ&MPZa2M0E4WFJKVp&A^r@Z8MmhhFUQaujJrE#Y3^FqZKDTN\$JN5bgu^C&TKaREX*7Vs\$&TGLcHKE4Mkg9i@I5b7dAC4jIOIJHjf0lWpUrR^OLwnda6}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-rfbnext}"

echo "Создание базы данных $DB_NAME..."
echo "Подключение к: $DB_HOST:$DB_PORT"

# Заменить имя базы в SQL файле на лету
sed "s/USE rfbnext;/USE ${DB_NAME};/g; s/CREATE DATABASE IF NOT EXISTS rfbnext/CREATE DATABASE IF NOT EXISTS ${DB_NAME}/g" database.sql | \
mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -P "$DB_PORT"

if [ $? -eq 0 ]; then
    echo "✅ База данных успешно создана!"
    echo ""
    echo "Проверка подключения:"
    mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -P "$DB_PORT" -e "USE ${DB_NAME}; SHOW TABLES;" 2>/dev/null
else
    echo "❌ Ошибка при создании базы данных"
    echo ""
    echo "Проверьте:"
    echo "  - MySQL запущен на $DB_HOST:$DB_PORT"
    echo "  - Правильность учётных данных"
    if [ "$DB_HOST" != "localhost" ] && [ "$DB_HOST" != "127.0.0.1" ]; then
        echo "  - Настроен ли удалённый доступ (см. REMOTE-DB-SETUP.md)"
    fi
    exit 1
fi

