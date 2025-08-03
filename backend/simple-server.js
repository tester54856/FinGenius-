const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Mock user data - Updated with correct email and fresh password hash
const mockUser = {
  id: '1',
  name: 'Steve Miller',
  email: 'drstevemiller11@gmail.com',
  password: '$2b$10$4Fc01vYE45J9Zj5bUwdZReNAi34UwLQpT06NNNpXI7hTBYo7bN9jG', // "miller@123" - fresh hash
};

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: 'development'
  });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Received email:', email);
    console.log('Received password:', password);
    console.log('Expected email:', mockUser.email);
    console.log('Expected password hash:', mockUser.password);
    
    if (email !== mockUser.email) {
      console.log('❌ Email not found:', email);
      return res.status(401).json({
        message: 'Email/password not found'
      });
    }
    
    console.log('✅ Email matches!');
    
    const isValidPassword = await bcrypt.compare(password, mockUser.password);
    console.log('Password check result:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email);
      console.log('Received password length:', password.length);
      console.log('Password contains @:', password.includes('@'));
      return res.status(401).json({
        message: 'Invalid email/password'
      });
    }
    
    console.log('✅ Password is valid!');
    
    // Create JWT token
    const token = jwt.sign(
      { userId: mockUser.id },
      'your_jwt_secret_key_here',
      { expiresIn: '15m' }
    );
    
    console.log('🎉 Login successful for:', email);
    
    res.json({
      message: 'User logged in successfully',
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email
      },
      accessToken: token,
      expiresAt: Date.now() + (15 * 60 * 1000)
    });
    
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (email === mockUser.email) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }
    
    res.json({
      message: 'User registered successfully',
      user: {
        name,
        email
      }
    });
    
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Protected route example
app.get('/api/user/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }
  
  res.json({
    user: {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`📧 Test login: drstevemiller11@gmail.com / miller@123`);
}); 