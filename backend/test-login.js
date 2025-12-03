const bcrypt = require('bcrypt');

// Password hash từ database
const hashFromDb = '$2b$10$rKW5JQvKHKjH8V8qV7rYJ.T6WBQmzO0sOqYBxHvZ1hMz3NqJ8Cvxy';

async function testPasswords() {
  console.log('Testing password validation:');
  
  // Test các mật khẩu có thể
  const passwords = ['123456', 'password', 'admin123', 'default'];
  
  for (const pwd of passwords) {
    const match = await bcrypt.compare(pwd, hashFromDb);
    console.log(`Password "${pwd}": ${match ? '✅ MATCH' : '❌ NO MATCH'}`);
  }
  
  // Generate new hash for '123456'
  const newHash = await bcrypt.hash('123456', 10);
  console.log('\nNew hash for "123456":', newHash);
  
  // Verify new hash
  const verify = await bcrypt.compare('123456', newHash);
  console.log('Verify new hash:', verify ? '✅ OK' : '❌ FAILED');
}

testPasswords().catch(console.error);
