# Text-to-Learn: AI-Powered Course Generator

> Turn any topic prompt into a structured, multi-module online course with rich interactive lessons, code walkthroughs, embedded video guides, Hinglish narration, and PDF export.

[![CI/CD Pipeline](https://github.com/placeholder/text-to-learn/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/placeholder/text-to-learn/actions)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20Tailwind-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Backend-Java%2017%2F21%20%2B%20Spring%20Boot%203-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2F%20Embedded%20Mongo-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

---

## 🌟 Overview & Architecture

**Text-to-Learn** is a full-stack educational platform that democratizes personalized learning. By simply submitting a free-form topic (e.g. *"Intro to React Hooks"*, *"Basics of Copyright Law"*, *"Machine Learning with Python"*), the application autonomously crafts a complete curriculum with 4 structured modules, comprehensive lesson roadmaps, interactive multiple-choice quizzes, Hinglish voice narration, and styled PDF downloads.

```
project-root/
├── client/                     # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # PromptForm, Sidebar, HinglishAudioPlayer, LessonPDFExporter...
│   │   │   └── blocks/         # HeadingBlock, ParagraphBlock, CodeBlock, VideoBlock, MCQBlock
│   │   ├── pages/              # Home, Course, Lesson, MyCourses, Login, Signup
│   │   ├── hooks/              # useAuth (Auth0 Integration)
│   │   └── utils/              # api.js (Axios API Client)
│   └── vercel.json             # Vercel Deployment Blueprint
│
├── server/                     # Backend API (Java 17/21 + Spring Boot 3 + MongoDB)
│   ├── src/main/java/com/texttolearn/
│   │   ├── controller/         # CourseController, LessonController, GenerateController, NarrationController...
│   │   ├── service/            # AiCourseGeneratorService, YouTubeService, HinglishNarrationService...
│   │   ├── model/              # Course, CourseModule, Lesson, ContentBlock
│   │   ├── repository/         # CourseRepository, ModuleRepository, LessonRepository
│   │   ├── config/             # SecurityConfig (Auth0 JWT), CorsConfig
│   │   └── exception/          # GlobalExceptionHandler
│   └── pom.xml                 # Maven Configuration
│
├── .github/workflows/          # GitHub Actions CI/CD Pipeline
└── render.yaml                 # Render Cloud Deployment Blueprint
```

---

## 🚀 Key Features Implemented

| Feature | Description | Milestone |
|---|---|---|
| **Prompt-to-Course Generation** | Generates 3–6 progressive modules with 3–5 lessons each from any free-form topic prompt. | Milestone 1 & 8 |
| **Lazy Lesson Enrichment** | Generates detailed lesson content on first open to minimize token usage and latency. | Milestone 8 |
| **Rich Lesson Rendering** | Renders structured content blocks: Section Headings, Paragraphs, Syntax-highlighted Code with 1-click copy, and Video queries. | Milestone 6 |
| **Interactive MCQs** | Real-time quiz evaluation with immediate feedback, answer badges, and deep explanations. | Milestone 6 |
| **Hinglish Audio Narration** | Conversational Hinglish translation + speech playback and transcript viewer for multilingual self-learners. | Milestone 10 |
| **Download as PDF** | Styled offline lesson export using `html2canvas` and `jsPDF`. | Milestone 11 |
| **YouTube Video Integration** | YouTube Data API v3 search with educational embed fallbacks. | Milestone 9 |
| **Auth0 OAuth 2.0 Security** | Secure JWT Bearer authentication with automatic dev/guest fallback for instant local testing. | Milestone 4 |
| **Database Persistence** | Relational hierarchy (`Course` → `Module` → `Lesson`) stored in MongoDB with embedded fallback. | Milestone 5 |
| **CI/CD Pipeline** | Automated build, test, and package workflow via GitHub Actions. | Milestone 12 |

---

## 🛠️ Quick Start (Run Locally)

### Prerequisites
- **Node.js** 18+ and **npm**
- **Java** 17+ (or JDK 21/26) and Maven (wrapper included via `./mvnw`)

### 1. Start the Java Spring Boot Backend
```bash
cd server
./mvnw spring-boot:run
```
> The API automatically starts on **`http://localhost:5000`** with embedded MongoDB enabled.

Verify API health:
```bash
curl http://localhost:5000/api/health
```

### 2. Start the React Frontend
```bash
cd client
npm install
npm run dev
```
> Opens immediately on **`http://localhost:5173`**.

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status check |
| `POST` | `/api/generate-course` | Generate course outline from `{ "topic": "..." }` |
| `GET` | `/api/courses` | List all created courses |
| `GET` | `/api/user-courses` | List courses created by the authenticated user |
| `GET` | `/api/courses/{courseId}` | Get full course syllabus with modules and lessons |
| `DELETE` | `/api/courses/{courseId}` | Delete course and its associated modules & lessons |
| `GET` | `/api/lessons/{lessonId}` | Get lesson (triggers lazy AI enrichment if not yet generated) |
| `GET` | `/api/youtube?query={q}` | Search educational YouTube video embed |
| `POST` | `/api/narrate` | Generate Hinglish translation & audio narration from lesson text |

---

## 🌐 Cloud Deployment

### Backend on Render
1. Create a new **Web Service** on Render and connect your GitHub repository.
2. Set **Root Directory** to `server`.
3. Set **Build Command** to `./mvnw clean package -DskipTests` and **Start Command** to `java -jar target/text-to-learn-backend.jar`.
4. (Optional) Set environment variables: `MONGO_URI`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `YOUTUBE_API_KEY`, `AUTH0_ISSUER`.

### Frontend on Vercel
1. Import the repository on Vercel.
2. Set **Root Directory** to `client`.
3. Set Environment Variable: `VITE_API_URL=https://your-backend-url.onrender.com`.
4. Deploy!

---

## 📄 Resume Bullets

- **Full-Stack Architecture**: Architected an AI-powered course generator using Java Spring Boot 3, Spring Data MongoDB, and React 18 with Vite and Tailwind CSS.
- **Lazy AI Content Pipeline**: Implemented an on-demand content enrichment engine that generates structured lesson blocks (objectives, code walkthroughs, interactive quizzes) upon first view, minimizing LLM token consumption.
- **Multilingual TTS Narration**: Integrated Gemini API translation to deliver conversational Hinglish explanations and audio playback for enhanced accessibility.
- **Client-Side Document Export**: Built a PDF generation pipeline leveraging `html2canvas` and `jsPDF` for styled offline lesson downloads.
