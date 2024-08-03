const { query } = require('./db');

const testConnection = async () => {
  try {
    const res = await query('SELECT 1');
    console.log('Connection successful:', res.rows);
  } catch (err) {
    console.error('Connection failed:', err);
  }
};

testConnection();

