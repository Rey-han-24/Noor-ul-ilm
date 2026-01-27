# Noor ul Ilm - Development Guidelines

## Project Overview
Noor ul Ilm (Light of Knowledge) is an Islamic web application for Quran and Hadith resources.

## Tech Stack
- **Framework:** Next.js 15+ with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Fonts:** Inter (UI) + Amiri (Arabic text)

## Code Standards

### General Rules
- Write clean, readable, well-documented code
- Use TypeScript strict mode - no `any` types
- Add JSDoc comments for all functions and components
- Keep files focused and small (single responsibility)

### Naming Conventions
- **Components:** PascalCase (e.g., `QuranVerse.tsx`)
- **Functions:** camelCase (e.g., `formatVerseReference`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `HADITH_COLLECTIONS`)
- **Types/Interfaces:** PascalCase (e.g., `QuranVerse`)

### File Organization
- Components go in `src/components/`
- API routes go in `src/app/api/`
- Types go in `src/types/`
- Utilities go in `src/lib/`

## Islamic Content Guidelines

### CRITICAL: Content Accuracy
- Quran text must be 100% authentic Uthmani script
- All Hadith must include proper grading (Sahih, Hasan, Da'if)
- Translations must be from verified scholars
- Never generate or modify Quranic text

### Arabic Text Handling
- Use the `arabic-text` class for Arabic content
- Use `quran-verse` class for Quran verses
- Always set `dir="rtl"` for Arabic sections
- Use Amiri font for Arabic (via `font-amiri` variable)

### Translation Attribution
- Always include translator name
- Include language and translation year if available

## Component Guidelines

### Quran Components
- Display Arabic text prominently
- Show verse numbers in Arabic numerals
- Include verse reference (Surah:Ayah)
- Support multiple translations

### Hadith Components
- Show collection name and reference
- Display grading clearly
- Include narrator chain when available

## Accessibility
- Use semantic HTML elements
- Add proper ARIA labels for RTL content
- Ensure keyboard navigation works
- Maintain sufficient color contrast

## Testing Requirements
- Test all Quran/Hadith data rendering
- Verify Arabic text displays correctly
- Test RTL layout switching
- Test responsive design
