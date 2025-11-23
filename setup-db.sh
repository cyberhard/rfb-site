#!/bin/bash
# Скрипт для создания базы данных MySQL

DB_USER="${DB_USER:-kifirchik}"
DB_PASSWORD="${DB_PASSWORD:-RD!c*zueHm7^WJ&MPZa2M0E4WFJKVp&A^r@Z8MmhhFUQaujJrE#Y3^FqZKDTN\$JN5bgu^C&TKaREX*7Vs\$&TGLcHKE4Mkg9i@I5b7dAC4jIOIJHjf0lWpUrR^OLwnda6}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-rfbnext}"

echo "Создание базы данных $DB_NAME..."

mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -P "$DB_PORT" < database.sql

if [ $? -eq 0 ]; then
    echo "✅ База данных успешно создана!"
else
    echo "❌ Ошибка при создании базы данных"
    echo "Убедитесь, что MySQL запущен и учётные данные верны"
    exit 1
fi

