const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nutriai_dev'
});

async function run() {
  try {
    const resUsers = await pool.query('SELECT id, email, role FROM users');
    console.log('Users:', resUsers.rows.length);
    
    const dp = await pool.query('SELECT id, user_id, first_name FROM dietitian_profiles');
    console.log('Dietitian Profiles:', dp.rows);

    const dpat = await pool.query('SELECT dietitian_id, patient_id, status FROM dietitian_patients');
    console.log('Dietitian Patients Link:', dpat.rows);
    
    const pprofs = await pool.query('SELECT id, user_id, first_name FROM patient_profiles');
    console.log('Patient Profiles:', pprofs.rows);
    
    console.log('Query from Service:');
    const serviceQuery = await pool.query(`
      SELECT pp.first_name, u.email
      FROM dietitian_profiles dp
      JOIN dietitian_patients dpat ON dpat.dietitian_id = dp.id
      JOIN patient_profiles pp ON pp.id = dpat.patient_id
      JOIN users u ON u.id = pp.user_id
      WHERE dp.user_id = $1 AND dpat.status = 'active'
    `, [resUsers.rows.find(u => u.email === 'elif.kaya@nutriai.com').id]);
    console.log('Patients belonging to Elif:', serviceQuery.rows);

  } catch(e) { console.error('DB Hata:', e); }
  finally { pool.end(); }
}
run();
