const bcrypt = require('bcrypt');

bcrypt.hash('admin123', 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('New password hash for admin123:');
    console.log(hash);
    console.log('\nSQL command to update:');
    console.log(`UPDATE nguoi_dung SET password_hash = '${hash}' WHERE email = 'admin@tvu.edu.vn';`);
  }
});
