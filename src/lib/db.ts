import mysql from 'mysql2/promise';

// Создаем пул соединений для эффективной работы с БД
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rfb_site',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

