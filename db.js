const { Pool } = require('pg');
const pool = new Pool({
  user: 'aiyanascar',
  host: 'localhost',
  database: 'employee_tracker',
  password: 'cherrybox14!',  
  port: 5432,
});

const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error('Error executing query', err.stack);
    throw err;
  }
};

module.exports = { query };
