#!/bin/bash
# Скрипт для просмотра данных в базе данных

DB_USER="${DB_USER:-kifirchik}"
DB_PASSWORD="${DB_PASSWORD:-RD!c*zueHm7^WJ&MPZa2M0E4WFJKVp&A^r@Z8MmhhFUQaujJrE#Y3^FqZKDTN\$JN5bgu^C&TKaREX*7Vs\$&TGLcHKE4Mkg9i@I5b7dAC4jIOIJHjf0lWpUrR^OLwnda6}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-rfbnext}"

echo "=========================================="
echo "Подключение к базе данных: $DB_NAME"
echo "=========================================="
echo ""

# Проверка подключения
mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -P "$DB_PORT" -e "SELECT 1;" > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Ошибка подключения к MySQL!"
    echo ""
    echo "Попробуйте запустить MySQL:"
    echo "  sudo systemctl start mysql"
    echo "  или"
    echo "  sudo systemctl start mysqld"
    echo ""
    exit 1
fi

echo "✅ Подключение успешно!"
echo ""

# Показываем таблицы
echo "📋 Доступные таблицы:"
mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -P "$DB_PORT" "$DB_NAME" -e "SHOW TABLES;" 2>/dev/null

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ База данных '$DB_NAME' не существует или пуста!"
    echo ""
    echo "Создайте базу данных:"
    echo "  ./setup-db.sh"
    echo ""
    exit 1
fi

echo ""
echo "=========================================="
echo "Данные из таблицы users:"
echo "=========================================="
mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -P "$DB_PORT" "$DB_NAME" -e "SELECT id, phone_number, screen_name, role, availability, defile, merch, created_at FROM users LIMIT 20;" 2>/dev/null

echo ""
echo "=========================================="
echo "Данные из таблицы tikets:"
echo "=========================================="
mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -P "$DB_PORT" "$DB_NAME" -e "SELECT * FROM tikets LIMIT 20;" 2>/dev/null

echo ""
echo "=========================================="
echo "Данные из таблицы tags:"
echo "=========================================="
mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -P "$DB_PORT" "$DB_NAME" -e "SELECT * FROM tags LIMIT 20;" 2>/dev/null

echo ""
echo "=========================================="
echo "Статистика:"
echo "=========================================="
mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -P "$DB_PORT" "$DB_NAME" -e "
SELECT 
    'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 
    'tikets' as table_name, COUNT(*) as count FROM tikets
UNION ALL
SELECT 
    'tags' as table_name, COUNT(*) as count FROM tags;
" 2>/dev/null

echo ""
echo "Для интерактивного режима выполните:"
echo "  mysql -u $DB_USER -p -h $DB_HOST -P $DB_PORT $DB_NAME"

