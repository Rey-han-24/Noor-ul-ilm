# 🌙 Noor ul Ilm - نور العلم

> **Light of Knowledge** - A comprehensive Islamic web application

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io/)

## 📖 About

**Noor ul Ilm** is an Islamic web application providing authentic Quran and Hadith resources. Our mission is to make Islamic knowledge accessible to everyone with 100% accuracy and beautiful presentation.

### ✨ Features

- 📖 **Al-Quran** - Complete Quran with Arabic text and translations in multiple languages
- 📚 **Hadith Collections** - All major Hadith books (Bukhari, Muslim, Abu Dawud, etc.)
- 🔍 **Smart Search** - Search through Quran verses and Hadiths
- 👤 **User Accounts** - Save bookmarks, reading history, and preferences
- � **Bookmarks** - Save your favorite verses and hadiths
- 📜 **Reading History** - Continue where you left off
- �💝 **Donate** - Support Islamic causes and charity
- 🌙 **Beautiful UI** - Clean, respectful design with RTL support for Arabic
- 🔐 **Admin Panel** - Manage content, users, and donations

## 🛠️ Tech Stack

- **Framework:** Next.js 16+ (App Router, SSR/SSG)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with HTTP-only cookies
- **Fonts:** Inter (UI) + Amiri (Arabic)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/                # REST API endpoints
│   ├── quran/              # Quran reading pages
│   ├── hadith/             # Hadith reading pages
│   ├── dashboard/          # User dashboard
│   ├── admin/              # Admin panel
│   └── ...                 # Other pages
│
├── frontend/               # Client-side code
│   ├── components/         # React components
│   │   ├── quran/          # Quran-specific components
│   │   ├── hadith/         # Hadith-specific components
│   │   ├── search/         # Search components
│   │   └── dashboard/      # Dashboard components
│   ├── hooks/              # Custom React hooks
│   └── styles/             # CSS styles
│
├── backend/                # Server-side code
│   ├── lib/                # Server utilities (Prisma, auth)
│   ├── services/           # API services (Quran, Hadith, Search)
│   ├── data/               # Local data files
│   └── api/                # API helpers
│
├── shared/                 # Shared between frontend & backend
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Shared utilities
│   └── constants/          # App constants
│
├── middleware.ts           # Next.js middleware
│
prisma/
├── schema.prisma           # Database schema
└── migrations/             # Database migrations
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Rey-han-24/Noor-ul-ilm.git
   cd Noor-ul-ilm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## 🎯 Development Guidelines

### Code Quality
- All code must be clean, readable, and well-documented
- TypeScript strict mode is enabled
- ESLint rules must pass before commits

### Content Accuracy
- **Quran text** must be 100% authentic (Uthmani script)
- **Hadith** must include proper grading and attribution
- All translations must be from verified scholars

### Accessibility
- Full RTL support for Arabic content
- Proper semantic HTML
- Keyboard navigation support

## 🤝 Contributing

Contributions are welcome! Please ensure:
1. Code follows existing style conventions
2. All Islamic content is verified for accuracy
3. Tests pass (when implemented)

## 📄 License

This project is open source and available under the MIT License.

## 🤲 Acknowledgments

- Quran data from verified Islamic sources
- Hadith from authenticated collections
- Translations from respected scholars

---

**بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ**

*In the name of Allah, the Most Gracious, the Most Merciful*
