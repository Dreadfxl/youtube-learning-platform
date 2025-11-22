# YouTube Learning Platform - Project Requirements Document

**Project Name:** YouTube Learning Platform (YLP)  
**Client/User:** Self  
**Date:** November 22, 2025  
**Version:** 1.0  

---

## 1. Executive Summary

The YouTube Learning Platform is a web-based application that transforms unstructured YouTube content into structured, AI-powered learning experiences. Users input a learning goal (e.g., "Learn Rust Programming"), and the system automatically generates a personalized curriculum with curated YouTube videos, transcripts, and an AI tutor that answers questions about the content.

**Key Value Proposition:**
- Eliminate "research paralysis" when learning from YouTube
- Structured syllabus for any topic in seconds
- AI-powered tutoring based on actual video content
- Free/low-cost (leveraging existing APIs)

---

## 2. Project Objectives

### Primary Objectives
1. **Curriculum Generation:** Generate a 5-module syllabus with curated YouTube video links for any topic
2. **Content Integration:** Automatically retrieve video transcripts and make them searchable/queryable
3. **AI Tutoring:** Provide an interactive chat interface where users can ask questions answered using video transcripts
4. **User Experience:** Clean, intuitive interface showing videos, syllabus, and chat in one view

### Secondary Objectives
1. Cache syllabi to reduce API costs and improve response time
2. Enable timestamp linking (clickable timestamps that seek the video player)
3. Support multiple topics/courses per user session
4. Collect user feedback to improve video recommendations

---

## 3. Scope Definition

### In Scope
- Syllabus generation for any learning topic
- Finding and embedding YouTube videos (via curated URLs)
- Transcript fetching and display
- AI-powered Q&A tutor based on video transcripts
- Responsive web interface (desktop + mobile)
- Session-based course storage (not persistent user accounts for MVP)

### Out of Scope
- User authentication/accounts (for MVP)
- Video generation or creation
- Downloading videos
- Monetization or premium features (for MVP)
- Support for non-YouTube video sources
- Multi-language support (MVP: English only)
- Community features (forums, peer interaction)

---

## 4. Functional Requirements

### 4.1 Curriculum Generation Module

**FR-1.1:** The system shall accept a learning topic as text input from the user.
**FR-1.2:** The system shall use Perplexity API (`sonar-pro` model) to generate a structured JSON syllabus.
**FR-1.3:** The system shall validate that video URLs are valid YouTube links before storing.
**FR-1.4:** The system shall display the generated syllabus on the frontend as a visual timeline/roadmap.

### 4.2 Transcript Fetching & Display

**FR-2.1:** The system shall fetch video transcripts using `youtube-transcript-api` when a user clicks on a video.
**FR-2.2:** The system shall display the transcript in a scrollable sidebar with timestamps.
**FR-2.3:** The system shall handle cases where transcripts are unavailable gracefully (error message).
**FR-2.4:** Transcripts shall be cached in memory for the user session to avoid repeated API calls.

### 4.3 AI Tutor (Q&A)

**FR-3.1:** The system shall display a chat interface where users can ask questions about the current video.
**FR-3.2:** When a user submits a question, the system shall:
   - a) Pass the full transcript to Google Gemini 1.5 Flash API
   - b) Include the user's question
   - c) Receive and display the AI-generated response
**FR-3.3:** The AI response shall cite timestamps from the transcript (e.g., "At 12:45...").
**FR-3.4:** Timestamps in the response shall be clickable and update the video player's current time.
**FR-3.5:** The system shall maintain chat history within the current session for context.

### 4.4 Video Player Integration

**FR-4.1:** The system shall embed YouTube's iframe player on the frontend.
**FR-4.2:** The video player shall be seekable to timestamps provided by the AI tutor.
**FR-4.3:** The player shall remain visible while the user scrolls through the transcript or chat.

### 4.5 User Interface
**FR-5.1:** The frontend shall display:
   - A search/input bar at the top for entering a learning topic
   - A syllabus section (left/top) showing all modules
   - A video player (center) for the selected module
   - A transcript panel (right/bottom) showing video text
   - A chat panel (bottom) for Q&A interaction
**FR-5.2:** The layout shall be responsive and work on:
   - Desktop (1920x1080+)
   - Tablet (768px+)
   - Mobile (375px+)
**FR-5.3:** The UI shall include loading states and error messages for all API calls.

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Syllabus generation: < 10 seconds (Perplexity API response time)
- Transcript fetch: < 3 seconds
- AI tutor response: < 8 seconds (Gemini API latency)
- Page load time: < 2 seconds

### 5.2 Scalability
- Support concurrent users via stateless API design
- Cache syllabi using browser localStorage or a simple caching service
- Handle multiple simultaneous API requests without blocking

### 5.3 Reliability
- Graceful fallback if Perplexity API is unavailable (show manual input form)
- Retry logic for failed API calls (max 3 retries with exponential backoff)
- Error logging to console and optional external service (Sentry)

### 5.4 Security
- API keys stored securely in environment variables (never in frontend code)
- CORS configured to allow frontend domain only
- User input validated to prevent injection attacks
- No sensitive data stored permanently (session-based only)

### 5.5 Maintainability
- Code documented with JSDoc/docstrings
- Separate API routes for each major function
- Clear component structure in React/Next.js
- Configuration file for API endpoints and settings

### 5.6 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Alt text for images
- Sufficient color contrast ratios

---

## 6. Technical Architecture

### 6.1 Frontend Stack
- **Framework:** Next.js 15 (React)
- **Styling:** Tailwind CSS or CSS Modules
- **Video Player:** YouTube's iframe API
- **Chat UI:** Custom React component or library (e.g., `react-chat-ui`)
- **HTTP Client:** Axios or fetch API
- **State Management:** React Context API or Zustand (lightweight)

### 6.2 Backend Stack
- **Framework:** Next.js API Routes (serverless)
- **Runtime:** Node.js
- **Language:** TypeScript (recommended) or JavaScript

### 6.3 External APIs
1. **Perplexity API:**
   - Endpoint: `https://api.perplexity.ai/chat/completions`
   - Model: `sonar-pro`
   - Usage: Curriculum generation
2. **Google Gemini API:**
   - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash`
   - Usage: AI tutoring / Q&A
3. **youtube-transcript-api (Python/JavaScript):**
   - Usage: Fetch video transcripts (no API key required)
   - Alternative: YouTube Data API v3 (if transcripts unavailable)

### 6.4 Data Flow
```
User Input (Topic)
    ↓
[Next.js API Route /api/generate-syllabus]
    ↓
Perplexity API (sonar-pro)
    ↓
JSON Syllabus + YouTube URLs
    ↓
Frontend renders Syllabus
    ↓
User selects Video
    ↓
[Next.js API Route /api/get-transcript]
    ↓
youtube-transcript-api
    ↓
Transcript cached in browser
    ↓
User asks Question
    ↓
[Next.js API Route /api/tutor]
    ↓
Gemini 1.5 Flash API (+ full transcript)
    ↓
AI Response displayed in Chat
    ↓
User clicks timestamp → Video seeks
```

---

## 7. API Endpoints (Next.js)

### 7.1 POST `/api/generate-syllabus`
Request: `{"topic": "Rust Programming"}`
Response: `{"topic": "Rust Programming", "modules": [/* ... */], "generated_at": "2025-11-22T12:30:00Z"}`
Error Response (400): `{"error": "Topic is required"}`

### 7.2 POST `/api/get-transcript`
Request: `{"video_url": "https://www.youtube.com/watch?v=abc123"}`
Response: `{"transcript": [ { "text": "Hello everyone...", "start": 0, "duration": 2.5 }, { "text": "Today we learn Rust", "start": 2.5, "duration": 3.0 } ], "full_text": "Hello everyone... Today we learn Rust..."}`

### 7.3 POST `/api/tutor`
Request: `{"question": "What is ownership in Rust?", "transcript": "...full transcript text...", "chat_history": [/* array of previous messages */]}`
Response: `{"response": "Ownership is a core concept in Rust (explained at 5:30). It means... [citation continues]", "timestamp_references": [ { "text": "At 5:30", "seconds": 330 } ]}`

---

## 8. User Stories

### US-1: Generate a Course
As a learner, I want to enter a topic and get an instant syllabus so that I don't waste time researching the best videos.
Acceptance Criteria:
- User enters "Machine Learning for Beginners"
- System returns 5 modules with video links within 10 seconds
- Each module shows title, description, and video channel
- User can preview or click each video link

### US-2: Learn from a Video
As a learner, I want to watch a video with its transcript visible so that I can follow along and review content.
Acceptance Criteria:
- Video player loads and plays YouTube content
- Transcript appears synchronized with video
- User can search for keywords in the transcript
- Clicking a transcript line seeks video to that timestamp

### US-3: Ask Questions About Content
As a learner, I want to ask the AI tutor questions about the video so that I can clarify confusing concepts.
Acceptance Criteria:
- User types "Explain gradient descent" in the chat
- AI responds using the video transcript as context
- Response includes timestamps
- Clicking a timestamp seeks the video

### US-4: Browse Multiple Topics
As a learner, I want to switch between different learning topics so that I can explore multiple subjects in one session.
Acceptance Criteria:
- Multiple course syllabi can be generated in one session
- User can switch between courses without losing chat history
- Sidebar shows all active courses as tabs

---

## 9. Data & Privacy Considerations
Minimal user data collected (learning topics, questions asked)
No personally identifiable information required (MVP)
Session-based only (cleared on browser close)
Syllabus data: Generated by Perplexity API (not stored)
Video URLs: Public YouTube links (stored in browser session)
Transcripts: Fetched from YouTube (cached in browser session)
Inform users that conversations are not stored permanently
Disclose API usage: Perplexity, Google Gemini
Comply with YouTube's Terms of Service

---

## 10. Cost Estimation
Perplexity (sonar-pro) API: ~$0.30/mo
Google Gemini 1.5 Flash API: ~$2/mo
youtube-transcript-api: Free
Frontend Hosting: Vercel (Free tier or $20/mo)
Backend: Next.js API Routes (Included with Vercel)
Database: None required for MVP
Monitoring: Sentry (Free tier)
Total Monthly: $0 - $20

---

## 11. Timeline & Milestones
Phase 1: MVP (Week 1-2)
- Set up Next.js project with TypeScript
- Integrate Perplexity API for syllabus generation
- Build basic UI for syllabus display
- Integrate youtube-transcript-api
- Deploy frontend to Vercel

Phase 2: AI Tutoring (Week 3-4)
- Integrate Google Gemini 1.5 Flash API
- Build chat UI and message history
- Implement timestamp linking
- Add transcript search/filtering

Phase 3: Polish & Optimization (Week 5-6)
- Add caching for syllabi
- Improve mobile responsiveness
- Error handling and retry logic
- Performance optimization
- User feedback collection

---

## 12. Testing Strategy
Unit tests for API parsing, timestamp validation, transcript errors
Integration tests for full flows, API limiting, error scenarios
Beta user testing for feedback
Performance/load testing for concurrency

---

## 13. Success Metrics
Quantitative: Syllabus >95% success, response time <8s, AI accuracy >85%
Qualitative: Easy to use, better learning confidence, preferred over manual searching

---

## 14. Risks & Mitigation
Perplexity API invalid JSON: Validate/fallback
Transcript unavailable: Retry/error message
API costs at scale: Caching/rate limiting
CORS with YouTube API: Proxy/CORS headers
Inaccurate AI answers: Disclaimer/citations/feedback

---

## 15. Future Enhancements
User accounts & progress tracking
Quiz generation
Code execution environment
Mobile app
Multi-language support
Platform integrations
Community sharing
Instructor mode

---

## 16. Assumptions & Dependencies
Stable internet, API access/stability, transcripts available, modern browser support

---

## 17. Sign-Off
Product Owner: Self | 2025-11-22 | ✓
Technical Lead: Self | 2025-11-22 | ✓

---

## 18. Appendix: Wireframe Notes
Dashboard and mobile layouts sketched in markdown

---

**End of Project Requirements Document**