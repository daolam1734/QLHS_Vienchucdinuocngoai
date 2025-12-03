/**
 * Script to create test users in the database
 * Run: ts-node src/scripts/createTestUser.ts
 */

import pool from '../config/database';
import { hashPassword } from '../utils/password.util';

const createTestUsers = async () => {
  try {
    console.log('🔧 Creating test users...\n');

    // Hash password for demo user
    const hashedPassword = await hashPassword('tvu123456');

    const users = [
      {
        username: 'demo',
        email: 'demo@tvu.edu.vn',
        ho_ten: 'Nguyễn Văn Demo',
        don_vi_id: 1,
      },
      {
        username: 'truongdonvi',
        email: 'truongdonvi@tvu.edu.vn',
        ho_ten: 'Trưởng Đơn Vị Test',
        don_vi_id: 1,
      },
      {
        username: 'tcns',
        email: 'tcns@tvu.edu.vn',
        ho_ten: 'Phòng TCNS Admin',
        don_vi_id: 2,
      },
      {
        username: 'admin',
        email: 'admin@tvu.edu.vn',
        ho_ten: 'Quản Trị Viên',
        don_vi_id: 1,
      },
    ];

    for (const user of users) {
      // Check if user already exists
      const existingUser = await pool.query(
        'SELECT email FROM nguoi_dung WHERE email = $1',
        [user.email]
      );

      if (existingUser.rows.length > 0) {
        console.log(`⚠️  User ${user.email} already exists, skipping...`);
        continue;
      }

      // Insert user
      const result = await pool.query(
        `INSERT INTO nguoi_dung (
          username,
          password_hash, 
          ho_ten, 
          email,
          don_vi_id, 
          is_active,
          ngay_tao,
          ngay_cap_nhat
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING id, email, ho_ten`,
        [user.username, hashedPassword, user.ho_ten, user.email, user.don_vi_id, true]
      );

      console.log(`✅ Created user: ${result.rows[0].email} (${result.rows[0].ho_ten})`);
    }

    console.log('\n✅ All test users created successfully!');
    console.log('\n📝 Test credentials:');
    console.log('   Email: demo@tvu.edu.vn (or any email above)');
    console.log('   Password: tvu123456\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    process.exit(1);
  }
};

createTestUsers();
