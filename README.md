# 🚨 DisasterSense AI

**Real-Time Social Media Disaster Detection, Verification, and Emergency Alert Platform**

DisasterSense AI is an open-source, AI-powered command center designed for emergency response agencies. It ingests social media and public data, uses Large Language Models (LLMs) to detect disasters, and strictly cross-verifies these reports against trusted scientific and news APIs to eliminate fake news and generate actionable, credible emergency alerts.

![DisasterSense AI Overview](https://via.placeholder.com/1200x600/0a0e1a/3b82f6?text=DisasterSense+AI+Command+Center)

---

## ✨ Key Features
- **🧠 AI Detection:** Utilizes Groq (Llama 3.3 70B) to parse unstructured social media posts into structured JSON disaster data.
- **🛡️ Cross-Verification Engine:** Authenticates incidents by checking:
  - Open-Meteo API (Weather/Storms/Floods)
  - USGS Earthquake API (Seismic activity)
  - NASA FIRMS API (Wildfires)
  - GDELT & ReliefWeb (News Coverage)
- **🧮 Credibility Scoring:** Algorithmic scoring filters out misinformation and fake news.
- **🗺️ Geospatial Intel:** Real-time interactive maps with heat zones powered by React Leaflet.
- **⚡ Real-time Alerts:** Supabase-powered real-time subscriptions and browser push notifications.

---

## 🛠️ Tech Stack
- **Frontend:** React (Vite), Tailwind CSS v4, Framer Motion, Zustand, Recharts, React Leaflet.
- **Backend / Database:** Supabase (PostgreSQL, Realtime, Row Level Security, Edge Functions).
- **AI / NLP:** Groq SDK (Llama 3.3).

---

## 🚀 Quick Start (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/disastersense-ai.git
cd disastersense-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` (or just edit the `.env` file directly):
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GROQ_API_KEY=your-groq-api-key
```

### 4. Setup Supabase Database
1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `supabase/migrations/00000000000000_initial_schema.sql` and run it. This will create your tables and policies.

### 5. Run the Application
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📚 Documentation
- [System Architecture](./docs/architecture.md)
- [Setup & Deployment Guide](./docs/setup-guide.md)
- [API Reference](./docs/api-reference.md)
- [Demo Script](./docs/demo-script.md)

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page]().

## 📝 License
This project is [MIT](LICENSE) licensed.
