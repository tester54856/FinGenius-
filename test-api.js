const https = require('https');

// Test the login endpoint with detailed error handling
function testLoginAPI() {
  const data = JSON.stringify({
    email: 'drstevemiller11@gmail.com',
    password: 'miller@123'
  });

  const options = {
    hostname: 'fingenius-7fwx.onrender.com',
    port: 443,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);

    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('Response Body:', responseData);
      try {
        const parsed = JSON.parse(responseData);
        console.log('Parsed Response:', parsed);
      } catch (e) {
        console.log('Could not parse response as JSON');
      }
    });
  });

  req.on('error', (error) => {
    console.error('Request Error:', error);
  });

  req.write(data);
  req.end();
}

console.log('🔍 Testing login API...');
testLoginAPI(); 