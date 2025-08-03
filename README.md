# 💰 FinGenius - Personal Finance Management App

A modern, full-stack personal finance management application built with React, Node.js, and MongoDB.

## 🚀 Features

- **📊 Dashboard Analytics** - Visual insights into your financial health
- **💳 Transaction Management** - Add, edit, and categorize transactions
- **📱 Receipt Scanning** - AI-powered receipt scanning with Google Gemini
- **📈 Expense Tracking** - Monitor income vs expenses with detailed breakdowns
- **📅 Recurring Transactions** - Set up automatic recurring payments
- **📊 Reports & Analytics** - Generate detailed financial reports
- **🔐 Secure Authentication** - JWT-based user authentication
- **📧 Email Notifications** - Automated financial reports via email

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **React Hook Form** with Zod validation
- **Shadcn/ui** components

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Google AI (Gemini)** for receipt scanning
- **Cloudinary** for image uploads
- **Resend** for email notifications

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Google AI (Gemini) API key
- Cloudinary account
- Resend account

### Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
cp env.example .env
# Edit .env with your API URL
npm run dev
```

## 🌐 Deployment

### Backend (Render)
1. Connect GitHub repository to Render
2. Set root directory to `backend`
3. Configure environment variables
4. Deploy

### Frontend (Vercel)
1. Import GitHub repository to Vercel
2. Set root directory to `client`
3. Set `VITE_API_URL` environment variable
4. Deploy

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=10000
BASE_PATH=/api
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
RESEND_API_KEY=your_resend_api_key
RESEND_MAILER_SENDER=your_email@domain.com
FRONTEND_ORIGIN=https://your-frontend-domain.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

## 📱 Usage

1. **Sign up/Login** with your email
2. **Add transactions** manually or scan receipts
3. **View dashboard** for financial insights
4. **Generate reports** for detailed analysis
5. **Set up recurring transactions** for automation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google AI for receipt scanning capabilities
- Cloudinary for image management
- Resend for email services
- MongoDB Atlas for database hosting

---

**Built with ❤️ for better financial management**
