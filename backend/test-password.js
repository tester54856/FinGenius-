const bcrypt = require('bcrypt');

async function testPassword() {
  const password = 'miller@123';
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Hashed password:', hashedPassword);
  
  // Test the comparison
  const isValid = await bcrypt.compare(password, hashedPassword);
  console.log('Password valid:', isValid);
  
  // Test with the old hash
  const oldHash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
  const isValidOld = await bcrypt.compare(password, oldHash);
  console.log('Old hash valid:', isValidOld);
}

testPassword(); 