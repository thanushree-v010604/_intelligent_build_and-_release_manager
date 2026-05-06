
# Intelligent Build & Release Manager

AI-powered code generator that creates production-ready HTML applications using GROQ's Llama 3.1 model.

---

## 🚀 Quick Start - Local Development

### Prerequisites
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **GROQ API Key** ([Get free key](https://console.groq.com/keys))

### Setup

1. **Clone & install:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Add your GROQ API key:
     ```
     VITE_GROQ_API_KEY=gsk_your_actual_key_here
     ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   - Opens at: `http://localhost:3001`
   - App supports hot-reload as you edit code

---

## 🌐 Deploy to Render

### Security Setup (Keep API Key Private)

**Important:** `.env` files are in `.gitignore` and will NOT be pushed to GitHub. The API key stays secure on your machine.

### Deployment Steps

1. **Prepare your code:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Render Service:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **New** → **Static Site** or **Web Service**
   - Connect your GitHub repository
   - Set **Build Command**: `npm install && npm run build`
   - Set **Publish Directory**: `dist`

3. **Add API Key as Secret** (Render Environment Variable):
   - In Render Service → **Environment**
   - Click **Add Environment Variable**
   - **Name**: `VITE_GROQ_API_KEY`
   - **Value**: `gsk_your_actual_groq_api_key`
   - Click **Save**

4. **Deploy:**
   - Render will automatically redeploy when you push to GitHub
   - Your API key is stored securely in Render's vault, NOT in your code

---

## 📝 Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_GROQ_API_KEY` | GROQ API key for AI generation | `gsk_...` |

**Note:** Never commit `.env` or `.env.local` files. They're protected by `.gitignore`.

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (hot-reload) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## ⚙️ Configuration

- **Vite Config**: [vite.config.ts](vite.config.ts) - Build & dev server setup
- **API Service**: [src/services/gemini.ts](src/services/gemini.ts) - GROQ API calls
- **React App**: [src/App.tsx](src/App.tsx) - Main UI component

---

## 🔐 Security Best Practices

✅ **What we do:**
- API keys stored in `.env.local` (local only)
- `.gitignore` prevents accidental commits
- Render stores secrets in encrypted vault
- Environment variables injected at build time

❌ **Never do this:**
- Don't hardcode API keys in source code
- Don't commit `.env` files to git
- Don't share API keys via email/chat

---

## 📚 API Documentation

This app uses the **GROQ API** for AI code generation:
- **Model**: `llama-3.1-8b-instant`
- **Endpoint**: `https://api.groq.com/openai/v1/chat/completions`
- **Docs**: [GROQ Console](https://console.groq.com/)

---

## 💡 Troubleshooting

| Issue | Solution |
|-------|----------|
| **"API key missing"** | Ensure `.env.local` has `VITE_GROQ_API_KEY` set correctly |
| **Blank console output** | Press `F12` to open DevTools → Console tab to see debug logs |
| **Render deployment fails** | Check that Environment Variable `VITE_GROQ_API_KEY` is set in Render dashboard |

---

## 📄 License

Apache-2.0
