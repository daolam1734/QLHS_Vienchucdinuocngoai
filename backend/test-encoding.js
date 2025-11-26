const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'qlhs_dinuocngoai',
  user: 'postgres',
  password: 'postgres',
});

async function test() {
  try {
    // Set UTF-8
    await pool.query("SET client_encoding TO 'UTF8'");
    
    const result = await pool.query(`
      SELECT nd.id, nd.username, nd.email, nd.ho_ten, dv.ten_don_vi, vt.ten_vai_tro
      FROM nguoi_dung nd 
      LEFT JOIN dm_don_vi dv ON nd.don_vi_id = dv.id
      LEFT JOIN phan_quyen pq ON nd.id = pq.nguoi_dung_id
      LEFT JOIN dm_vai_tro vt ON pq.vai_tro_id = vt.id
      WHERE nd.email = 'admin@tvu.edu.vn'
    `);
    
    console.log('=== Test UTF-8 Encoding ===');
    console.log('Raw data:', result.rows[0]);
    console.log('\nFormatted:');
    console.log('Họ tên:', result.rows[0].ho_ten);
    console.log('Vai trò:', result.rows[0].ten_vai_tro);
    console.log('Đơn vị:', result.rows[0].ten_don_vi);
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
