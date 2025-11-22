# YouTube Learning Platform

Transform unstructured YouTube content into structured, AI-powered learning experiences with personalized curricula and interactive AI tutoring.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## 🎯 Overview

The YouTube Learning Platform eliminates "research paralysis" when learning from YouTube by:
- **Generating structured curricula** for any topic in seconds using AI
- **Curating YouTube videos** into organized learning modules
- **Fetching video transcripts** for easy reference and searchability
- **Providing AI tutoring** that answers questions based on actual video content
- **Enabling timestamp navigation** to jump directly to relevant video sections

## ✨ Features

### 📚 Curriculum Generation
- Enter any learning topic (e.g., "Rust Programming", "Machine Learning Basics")
- AI generates a 5-module syllabus with curated YouTube videos
- Each module includes title, description, video link, channel, and duration

### 🎥 Video Integration
- Embedded YouTube player with full controls
- Automatic transcript fetching and display
- Clickable timestamps for precise navigation
- Synchronized transcript scrolling

### 🤖 AI Tutor
- Ask questions about video content in natural language
- Responses cite specific timestamps from the transcript
- Context-aware answers using Google Gemini 1.5 Flash
- Persistent chat history within each session

### 📱 Responsive Design
- Works seamlessly on desktop, tablet, and mobile devices
- Clean, intuitive interface built with Tailwind CSS
- Optimized for learning and focus

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Video Player:** YouTube IFrame API

### Backend
- **Runtime:** Node.js (Next.js API Routes)
- **APIs:**
  - Perplexity API (`sonar-pro` model) for curriculum generation
  - Google Gemini 1.5 Flash for AI tutoring
  - `youtube-transcript` library for fetching transcripts

### Deployment
- **Hosting:** Vercel (recommended)
- **Environment:** Serverless

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- API keys:
  - [Perplexity API key](https://docs.perplexity.ai/)
  - [Google Gemini API key](https://ai.google.dev/)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Dreadfxl/youtube-learning-platform.git
cd youtube-learning-platform
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
PERPLEXITY_API_KEY=your_perplexity_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Project Structure

```
youtube-learning-platform/
├── app/
│   ├── api/                  # Next.js API routes
│   │   ├── generate-syllabus/ # Perplexity API integration
│   │   ├── get-transcript/    # Transcript fetching
│   │   └── tutor/             # AI tutoring endpoint
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/
│   ├── TopicInput.tsx      # Topic search input
│   ├── SyllabusView.tsx    # Module list display
│   ├── VideoPlayer.tsx     # YouTube player
│   ├── TranscriptPanel.tsx # Transcript viewer
│   └── ChatPanel.tsx       # AI tutor chat
├── store/
│   └── learningStore.ts    # Zustand state management
├── public/                 # Static assets
├── PROJECT_REQUIREMENTS.md # Detailed specs
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 📚 API Endpoints

### `POST /api/generate-syllabus`
Generates a learning syllabus for a given topic.

**Request:**
```json
{
  "topic": "Rust Programming"
}
```

**Response:**
```json
{
  "topic": "Rust Programming",
  "modules": [
    {
      "id": 1,
      "title": "Introduction to Rust",
      "description": "Learn the basics...",
      "video_url": "https://www.youtube.com/watch?v=...",
      "channel": "Rust Official",
      "duration": "15:30"
    }
  ],
  "generated_at": "2025-11-22T12:30:00Z"
}
```

### `POST /api/get-transcript`
Fetches the transcript for a YouTube video.

**Request:**
```json
{
  "video_url": "https://www.youtube.com/watch?v=abc123"
}
```

**Response:**
```json
{
  "transcript": [
    {
      "text": "Hello everyone...",
      "start": 0,
      "duration": 2.5
    }
  ],
  "full_text": "Hello everyone..."
}
```

### `POST /api/tutor`
AI tutor that answers questions about video content.

**Request:**
```json
{
  "question": "What is ownership in Rust?",
  "transcript": "...full transcript text...",
  "chat_history": []
}
```

**Response:**
```json
{
  "response": "Ownership is a core concept in Rust (explained at 5:30)...",
  "timestamp_references": [
    {
      "text": "At 5:30",
      "seconds": 330
    }
  ]
}
```

## 🛡️ Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PERPLEXITY_API_KEY` | API key for Perplexity AI | Yes |
| `GEMINI_API_KEY` | API key for Google Gemini | Yes |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error tracking | No |

## 💰 Cost Estimation

- **Perplexity API:** ~$0.30/month for MVP usage
- **Google Gemini API:** ~$2/month for MVP usage
- **Vercel Hosting:** Free tier (up to $20/month for Pro)
- **Total:** $0-$20/month

## 📝 Development Roadmap

### Phase 1: MVP (Weeks 1-2) ✅
- [x] Next.js project setup with TypeScript
- [x] Perplexity API integration for syllabus generation
- [x] Basic UI for syllabus display
- [x] YouTube transcript fetching
- [x] Deployment configuration

### Phase 2: AI Tutoring (Weeks 3-4)
- [ ] Google Gemini 1.5 Flash integration
- [ ] Chat UI with message history
- [ ] Timestamp linking functionality
- [ ] Transcript search/filtering

### Phase 3: Polish & Optimization (Weeks 5-6)
- [ ] Syllabus caching
- [ ] Mobile responsiveness improvements
- [ ] Error handling and retry logic
- [ ] Performance optimization
- [ ] User feedback collection

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dreadfxl/youtube-learning-platform)

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- [Project Requirements Document](./PROJECT_REQUIREMENTS.md)
- [Perplexity API Docs](https://docs.perplexity.ai/)
- [Google Gemini API Docs](https://ai.google.dev/)
- [Next.js Documentation](https://nextjs.org/docs)

## 👏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Perplexity AI](https://www.perplexity.ai/) and [Google Gemini](https://ai.google.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ by [Dreadfxl](https://github.com/Dreadfxl)**