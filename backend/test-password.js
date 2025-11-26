const bcrypt = require('bcrypt');

const password = 'admin123';
const hash = '$2b$10$rT8EXQY4z6XqK3h3J9Q1HuYGK8YXZ0NZc1xmN5gLlU6K8YN8XZ0Ne';

console.log('Testing password:', password);
console.log('Hash from DB:', hash);
console.log('Hash length:', hash.length);

bcrypt.compare(password, hash, (err, result) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Password match:', result);
  }
});

// Also generate a new hash to compare
bcrypt.hash(password, 10, (err, newHash) => {
  if (err) {
    console.error('Error generating hash:', err);
  } else {
    console.log('New hash:', newHash);
    console.log('New hash length:', newHash.length);
  }
});
