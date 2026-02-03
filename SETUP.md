# 🚀 Setup Instructions

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

### 1. Clone Repository
```bash
git clone https://github.com/raymaizing-id/airenamer.git
cd airenamer/renamer-next
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Setup Environment Variables
Copy `.env.local` to `.env` and add your API keys:
```bash
cp .env.local .env
```

Then edit `.env` and add your real API keys:
- `REACT_APP_GROQ_API_KEY` - Get from https://console.groq.com
- `REACT_APP_MIDTRANS_CLIENT_KEY` - Get from Midtrans dashboard
- `REACT_APP_MIDTRANS_SERVER_KEY` - Get from Midtrans dashboard

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

App will run on http://localhost:8080

## Features
- ✅ AI Chatbot (Aira) with Groq Llama 3.3 70B
- ✅ Vibrant Blue Theme
- ✅ Pricing Calculator
- ✅ Product Ecosystem Carousel
- ✅ Complete Backend Architecture (ready for Laravel)
- ✅ Authentication System (ready)
- ✅ Midtrans Payment Integration (ready)

## Backend Setup (Optional)
See `backend/DEPLOYMENT_GUIDE.md` for complete backend setup instructions.

## Documentation
- `AIRA_KNOWLEDGE_BASE.md` - Chatbot knowledge base
- `GROQ_LLAMA_SETUP.md` - Groq API setup guide
- `BACKEND_ARCHITECTURE.md` - Backend system design
- `MIDTRANS_SETUP.md` - Payment integration guide

## Support
Email: support@raymaizing.com
