# Frontend Architecture

This frontend is part of a **full-stack portfolio application**.
It is designed to be **visually premium, mobile-first, and technically clean**, with a strong focus on
UX quality, branding consistency, and maintainable React architecture.

This frontend intentionally demonstrates:
- a modern React + TypeScript architecture
- clean separation of concerns
- minimal but effective global state management with Context
- mobile-first and touch-friendly UX
- premium visual design using Tailwind CSS
- alignment with a secure, session-based backend

---

## Design Philosophy

- Mobile-first (smartphone UX is the priority)
- Minimal and premium aesthetics
- Fast, fluid interactions
- No hover-only UX
- Touch-friendly components
- Consistent branding across all pages

---

## Technology Stack

### Core
- React 18
- TypeScript
- Vite

### Styling & UI
- Tailwind CSS
- Framer Motion
- Headless UI
- Lucide Icons

### Routing & Data
- React Router
- Axios

---

## Project Structure

```txt
frontend/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── tailwind.css
│   │
│   ├── config/
│   │   ├── env.ts
│   │   ├── api.ts
│   │   └── routes.ts
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── UIContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── AppProvider.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Loader.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── PageWrapper.tsx
│   │   │
│   │   └── common/
│   │       ├── SectionTitle.tsx
│   │       ├── EmptyState.tsx
│   │       └── ErrorState.tsx
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Projects/
│   │   ├── ProjectDetails/
│   │   ├── About/
│   │   ├── Contact/
│   │   └── Admin/
│   │
│   ├── services/
│   │   ├── apiClient.ts
│   │   ├── project.service.ts
│   │   ├── auth.service.ts
│   │   └── contact.service.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useUI.ts
│   │   ├── useProjects.ts
│   │   └── useMediaQuery.ts
│   │
│   ├── utils/
│   │   ├── cn.ts
│   │   ├── formatDate.ts
│   │   └── scroll.ts
│   │
│   ├── animations/
│   │   └── variants.ts
│   │
│   └── types/
│       └── api.ts
│
├── public/
│   └── favicon.svg
│
├── tailwind.config.ts
├── postcss.config.js
├── index.html
├── tsconfig.json
├── package.json
└── README.md
```

---

## Contexts Architecture

### AuthContext
- Manages authentication state
- Relies on server-side sessions
- No token stored in frontend

### UIContext
- Global loaders
- Modals
- UI feedback

### ThemeContext
- Branding
- Dark/light mode
- User preferences

### AppProvider
- Composes all providers in a single entry point

---

## Mobile-First UX Rules

- All interactive elements >= 44px
- Bottom navigation optimized for thumb reach
- No critical information hidden behind hover
- Smooth but minimal animations

---

## Branding Guidelines

### Color Palette (Dark Premium)

- Background: #0B0E14
- Surface: #121826
- Primary: #

- Accent: #22D3EE
- Text Primary: #F8FAFC
- Text Secondary: #94A3B8

### Typography

- Inter (primary)
- JetBrains Mono (code accent)

---

## Conclusion

This frontend is designed to reflect **professional-grade frontend engineering** with a strong focus on:
- usability
- performance
- maintainability
- visual quality
- alignment with a secure backend architecture
