import mysql from 'mysql2/promise';

// Проверка наличия обязательных переменных окружения
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
	console.error('❌ Отсутствуют обязательные переменные окружения для подключения к БД:');
	console.error('   DB_HOST:', process.env.DB_HOST || 'НЕ УСТАНОВЛЕНО');
	console.error('   DB_USER:', process.env.DB_USER || 'НЕ УСТАНОВЛЕНО');
	console.error('   DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'НЕ УСТАНОВЛЕНО');
	console.error('   DB_NAME:', process.env.DB_NAME || 'НЕ УСТАНОВЛЕНО');
}

const pool = mysql.createPool({
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT || '3306'),
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
	enableKeepAlive: true,
	keepAliveInitialDelay: 0,
});

// Тест подключения при инициализации (только в development)
if (process.env.NODE_ENV === 'development') {
	console.log('DB config:', {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		database: process.env.DB_NAME,
	  });
	  
	pool.getConnection()
		.then((connection) => {
			console.log('✅ Подключение к БД успешно установлено');
			console.log(`   Host: ${process.env.DB_HOST}`);
			console.log(`   Database: ${process.env.DB_NAME}`);
			connection.release();
		})
		.catch((error) => {
			console.error('❌ Ошибка подключения к БД:', error.message);
			console.error('   Code:', error.code);
			console.error('   Host:', process.env.DB_HOST);
			console.error('   User:', process.env.DB_USER);
			console.error('   Database:', process.env.DB_NAME);
			console.error('   Проверьте настройки в .env файле');
			if (error.code === 'ER_ACCESS_DENIED_ERROR') {
				console.error('   ⚠️  Проблема с правами доступа!');
				console.error('   Выполните на сервере MySQL:');
				console.error(`   CREATE USER '${process.env.DB_USER}'@'YOUR_HOST' IDENTIFIED BY '...';`);
				console.error(`   GRANT ALL PRIVILEGES ON ${process.env.DB_NAME}.* TO '${process.env.DB_USER}'@'YOUR_HOST';`);
			}
		});
}

export default pool;
