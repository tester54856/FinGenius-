// Test email validation
const email = 'drstevemiller11@gmail.com';

// Basic email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValid = emailRegex.test(email);

console.log('Email:', email);
console.log('Is valid:', isValid);
console.log('Length:', email.length);
console.log('Contains @:', email.includes('@'));
console.log('Contains .:', email.includes('.'));
console.log('Has domain:', email.split('@')[1]?.includes('.')); 