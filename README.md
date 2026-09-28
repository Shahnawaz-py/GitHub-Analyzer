# ⚡ GitPulse Pro — Full-Stack GitHub Analyzer & Developer Intelligence Suite

![GitPulse Pro](https://img.shields.io/badge/Status-Production%20Ready-emerald?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js%2018%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**GitPulse Pro** is a modern full-stack developer intelligence platform and GitHub analytics suite. Built with a decoupled **Next.js** frontend and an **Express.js** REST API backend, GitPulse Pro evaluates developer profiles, computes a proprietary **OctoScore (0–100)**, audits repository code health, analyzes language distribution, and enables head-to-head developer showdowns.

---

## 🌟 Key Features

### 1. 🧠 Developer Intelligence & OctoScore Index
- **Proprietary Scoring Algorithm (0–100)**: Evaluates developers across 4 core pillars:
  - **Repository Quality & Breadth** (Original repos, documentation completeness)
  - **Community Traction** (Stars and forks earned)
  - **Activity Velocity** (Commit frequency, pull requests, issue participation)
  - **Stack Diversity** (Language versatility & followers reach)
- **Gamified Rank Badges**: Assigns developer tiers (*Mythic Architect*, *Elite Contributor*, *Senior Builder*, *Active Crafter*, *Novice Explorer*).

### 2. 📊 Language Ecosystem Breakdown
- **Stacked Color Bar**: Visual distribution of programming languages matching GitHub official language color standards.
- **Language Tags**: Percentage, repository counts, and color badges.

### 3. 🛡️ Repository Health & Deep-Dive Auditor
- **Code Health Score (0–100)**: Audits open-source repositories against industry best practices:
  - ✅ Informative description
  - ✅ Valid open-source license (MIT, Apache, GPL, etc.)
  - ✅ Discoverability topics & tags
  - ✅ Issue tracker configuration
  - ✅ Active commit history
- **Recent Commit Stream**: Live commit SHA, author, and commit message timeline.

### 4. ⚔️ Developer Showdown (Compare Mode)
- **Head-to-Head Battle**: Pit two GitHub profiles against each other.
- Compares stars, followers, repository count, language count, and overall DevScore.
- Dynamically awards category victories and crowns the overall champion.

### 5. 💡 Profile Strengths & Actionable Recommendations
- Identifies key portfolio strengths.
- Provides actionable, high-impact recommendations to improve GitHub profiles for recruiters and hiring managers.

### 6. ⚡ Smart Rate-Limit Guard & Caching
- Built-in 5-minute TTL in-memory caching to minimize rate-limit consumption.
- Live rate-limit tracker badge in the navbar indicating remaining requests in real time.
- Supports both unauthenticated mode (60 req/hr) and GitHub Personal Access Token mode (5,000 req/hr).

---

## 🏗️ Architecture

```
                             ┌───────────────────────────────┐
                             │        Client Browser         │
                             │  (Next.js 15 + Vanilla CSS)   │
                             └──────────────┬────────────────┘
                                            │ HTTP (JSON)
                                            ▼
                             ┌───────────────────────────────┐
                             │       Express REST API        │
                             │  - In-Memory TTL Cache        │
                             │  - Rate-Limit Manager         │
                             │  - OctoScore Engine           │
                             │  - Repo Health Checker        │
                             └──────────────┬────────────────┘
                                            │ HTTPS
                                            ▼
                             ┌───────────────────────────────┐
                             │       GitHub REST API v3      │
                             │  (/users, /repos, /events)    │
                             └───────────────────────────────┘
```

---

## 📁 Project Structure

```bash
GitHub_analyzer/
├── client/                     # Next.js 15 Frontend
│   ├── app/
│   │   ├── globals.css         # Design tokens, gradients, animations
│   │   ├── layout.js           # Root layout & SEO meta tags
│   │   └── page.js             # Main dashboard controller
│   ├── components/
│   │   ├── Navbar.js           # Brand header & live rate-limit pill
│   │   ├── UserProfileHero.js  # Identity, bio & social links
│   │   ├── DevScoreCard.js     # Circular SVG progress ring & score breakdown
│   │   ├── MetricsGrid.js      # Stars, forks, followers stat cards
│   │   ├── LanguageBreakdown.js# Stacked language color bar
│   │   ├── StrengthsAndTips.js # AI-style strengths & suggestions
│   │   ├── TopRepositories.js  # Flagship starred repos with inspect trigger
│   │   ├── ActivityTimeline.js # Real-time event stream
│   │   ├── RepoAnalyzerView.js # Dedicated repo deep-dive auditor
│   │   └── ShowdownView.js     # Head-to-head developer comparison
│   ├── styles/
│   │   └── analyzer.module.css # Glassmorphism & layout styles
│   └── package.json
│
├── server/                     # Express.js REST API Backend
│   ├── index.js                # Server entrypoint & middleware
│   ├── routes/
│   │   └── analyzerRoutes.js   # API route definitions
│   ├── services/
│   │   ├── githubService.js    # GitHub API client with in-memory caching
│   │   └── analyzerService.js  # OctoScore, health checks & comparison algorithms
│   ├── .env.example            # Environment variables template
│   └── package.json
│
├── package.json                # Root package.json with concurrent dev runner
├── .gitignore                  # Git ignore rules for Node & Next.js
└── README.md                   # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) v18.17.0 or higher
- [npm](https://www.npmjs.com/) v9 or higher

### 1. Clone the repository
```bash
git clone https://github.com/your-username/GitHub_analyzer.git
cd GitHub_analyzer
```

### 2. Install all dependencies
You can install dependencies for root, server, and client with a single command:
```bash
npm run install:all
```
*(Or install manually in both `client/` and `server/` with `npm install`)*

### 3. (Optional) Configure GitHub Personal Access Token
To increase the GitHub rate limit from **60 requests/hr** to **5,000 requests/hr**:
1. Go to [GitHub Settings -> Developer Settings -> Personal access tokens](https://github.com/settings/tokens).
2. Generate a classic token with `public_repo` and `read:user` permissions.
3. Create a `.env` file in the `server` directory:
   ```bash
   cp server/.env.example server/.env
   ```
4. Add your token in `server/.env`:
   ```env
   PORT=5000
   GITHUB_TOKEN=ghp_your_personal_access_token_here
   ```

### 4. Run the Application
Start both the Express backend and Next.js client concurrently:
```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & uptime status |
| `GET` | `/api/ratelimit` | Current GitHub API quota & reset timestamp |
| `GET` | `/api/user/:username` | Full profile intelligence, OctoScore, languages & strengths |
| `GET` | `/api/repo/:owner/:repo` | Repository health audit, checks, commits & language bytes |
| `GET` | `/api/compare?userA=:u1&userB=:u2` | Side-by-side comparison between two developers |

---

## 🎨 Design Philosophy
- **Glassmorphic Dark Mode**: Ambient multi-layer gradients, frosted glass cards (`backdrop-filter: blur(16px)`), and high-contrast typography.
- **Micro-Animations**: Hover glows, SVG circular progress ring transitions, and responsive tab state management.
- **Zero External UI Libraries**: Hand-crafted Vanilla CSS design tokens with clean CSS modules for maximum performance and zero dependency overhead.

---

## 📄 License
This project is licensed under the **MIT License**.
