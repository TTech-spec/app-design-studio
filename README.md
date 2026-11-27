<h1 align="center">🎓 DarlTech Academy</h1>

<p align="center">
  <b>Do extraordinary things with in-demand tech skills.</b><br>
  The website, learning portal and admin dashboard for DarlTech Academy, a Lagos-based online tech academy.
</p>

<p align="center">
  <a href="https://darltechacademy.online"><img src="https://img.shields.io/badge/Live%20site-darltechacademy.online-EF4136?style=for-the-badge" alt="Live site"></a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
</p>

---

## ✨ Overview

DarlTech Academy offers courses in **Web Development, Backend Development, UI/UX Design, Data Analytics, Data Science, Cybersecurity, AI Automation and Python**. This project brings the whole academy online in one app:

- 🌐 **Public landing page**: animated hero, course catalogue, how it works, pricing and scholarships, FAQ and contact
- 👩‍🎓 **Student portal**: explore and enrol in courses, take quizzes, join the community feed, message tutors, and shop the store
- 👨‍🏫 **Tutor portal**: create and manage quizzes, post to the feed, and chat with students
- 🛠️ **Admin dashboard**: manage users, courses, applications, scholarships, payments, events, announcements and reports
- 📝 **Applications & onboarding**: join as a student or tutor, apply for scholarships, and start a free Plus trial
- 🔗 **Shareable quizzes**: public quiz links anyone can open and take

The repo also contains **Agricon NG**, a 50-screen mobile app prototype for a farm marketplace connecting farmers and buyers. It includes onboarding, marketplace, farm profiles, chat, verification and a farmer dashboard, with multi-language support.

## 🛠️ Tech stack

| Area | Tools |
|---|---|
| Framework | React 19, TanStack Start, TanStack Router (file-based routing), Vite |
| Language | TypeScript |
| Styling & UI | Tailwind CSS v4, shadcn/ui, Radix UI, Lucide icons |
| Animation & 3D | Framer Motion, GSAP, Three.js / React Three Fiber |
| Data & auth | Supabase (Postgres, Auth, Storage, Realtime), TanStack Query |
| Forms & validation | React Hook Form, Zod |
| Charts | Recharts |
| AI | Groq API |

## 📁 Project structure

```
src/
├── routes/          # One file per page (file-based routing)
│   ├── index.tsx        # Landing page
│   ├── student.*.tsx    # Student portal
│   ├── tutor.*.tsx      # Tutor portal
│   ├── admin.*.tsx      # Admin dashboard
│   └── app.*.tsx        # Agricon NG mobile prototype
├── components/
│   ├── landing/     # Hero, pricing, features, how it works
│   ├── academy/     # Portal shell, feed, messages, quizzes
│   ├── admin/       # Admin pages and UI kit
│   ├── mobile/      # Mobile prototype screens
│   └── ui/          # shadcn/ui components
├── hooks/
└── lib/             # Supabase client, auth context, translations
supabase/
├── migrations/      # Database schema, step by step
└── darltech_full_setup.sql
```

## 🚀 Getting started

**Requirements:** Node.js 20+ (or Bun) and a free [Supabase](https://supabase.com) project.

```bash
# 1. Clone the repo
git clone https://github.com/TTech-spec/darltech.com.git
cd darltech.com

# 2. Install dependencies
npm install

# 3. Add your environment variables
cp .env.example .env
```

Fill in `.env`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_GROQ_API_KEY=your-groq-api-key
```

**Set up the database:** in the Supabase SQL editor, run `supabase/darltech_full_setup.sql`, or run the files in `supabase/migrations/` in order. Then, under **Authentication → URL Configuration**, add `http://localhost:5173/create-password` and your production `/create-password` URL as redirect URLs.

```bash
# 4. Start the dev server
npm run dev
```

## 📜 Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint the code with ESLint |
| `npm run format` | Format the code with Prettier |

## 👨‍💻 Author

**Adekola Timothy**, Front-End & Mobile App Developer

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-ecc766?style=flat-square)](https://my-portfolio-self-nine-52.vercel.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/adekola-timothy-28a05433b)
[![GitHub](https://img.shields.io/badge/GitHub-TTech--spec-181717?style=flat-square&logo=github)](https://github.com/TTech-spec)

---

<p align="center">⭐ If you like this project, give it a star!</p>
