# Transform to CareerDNA AI

This document outlines the plan to transform the existing "Resume Analyzer" into a premium AI Talent Intelligence Platform named **CareerDNA AI**. The goal is to achieve a recruiter-grade, hackathon-winning SaaS product look and feel with a premium dark theme.

## Goal Description

Overhaul the frontend to match a premium dark SaaS aesthetic (Linear/Vercel inspired) with glassmorphism, Framer Motion animations, and DNA-themed effects. The app will feature a comprehensive new Dashboard and Report section using realistic mock data, replacing the basic upload-only interface.

## User Review Required

> [!IMPORTANT]  
> Please review the following technical decisions:
> *   **Dependencies:** We will install `framer-motion` for animations, `lucide-react` for icons, and `clsx` + `tailwind-merge` for utility class management.
> *   **Mock Data:** Since this is a frontend-only update without a backend, we will hardcode a realistic mock analysis result that appears when the user clicks "Try Sample Analysis" or uploads mock files.

## Open Questions

> [!WARNING]  
> *   Do you have a specific color palette in mind for the "purple-blue gradients", or should I use a curated high-end SaaS palette? (I will default to a premium `#6366f1` (Indigo) and `#8b5cf6` (Purple) gradient if not specified).
> *   For the "DNA-themed background effects", would you prefer an animated SVG background or CSS particle effects? (I will default to CSS/Framer Motion animated particles and a subtle DNA double helix SVG background).

## Proposed Changes

---

### Core & Dependencies

We will install new dependencies and update global styles for the premium aesthetic.

#### [MODIFY] package.json
*   Add `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`.

#### [MODIFY] src/app/globals.css
*   Update CSS variables for the premium dark theme (deep navy/black backgrounds, purple/blue accents).
*   Add custom animations (DNA floating, particles).

---

### Navigation & Layout

#### [MODIFY] src/components/Navbar.tsx
*   Change branding to **CareerDNA AI**.
*   Add new links: Documentation, Theme Toggle (mock), GitHub icon.
*   Update the glassmorphism styling.

#### [MODIFY] src/app/layout.tsx
*   Update site title to "CareerDNA AI | Decode Your Career DNA".
*   Add the DNA-themed background and floating particles globally.

---

### Pages

#### [MODIFY] src/app/page.tsx
*   **Hero Section:** Add "Decode Your Career DNA" title, subtitle, and gradient spotlight background.
*   **Upload Section:** Integrate updated `UploadPortal` components. Add the "Try Sample Analysis" button.
*   **State Management:** Add React state to toggle between the "Upload State", "Loading State", and "Results State" (Dashboard).
*   **Results Rendering:** When mock data is triggered, render the new `Dashboard` and `ReportSection` components.

#### [MODIFY] src/app/developer/page.tsx
*   Add a "← Back to Analyzer" button using `next/navigation` `useRouter`.
*   Update the visual styling to match the new CareerDNA theme.

---

### New Components

We will create several new components to handle the complex dashboard and upload requirements.

#### [MODIFY] src/components/UploadPortal.tsx
*   Update to handle up to 5 resumes.
*   Add file chips with remove buttons.
*   Add an upload counter.
*   Enhance the premium card design.

#### [NEW] src/components/Dashboard.tsx
*   Create a grid layout for the analysis results.
*   Include: CareerDNA Score (animated ring), Skill/Experience/ATS Match cards, Candidate Ranking Leaderboard, Comparison Table, Skill Gap Heatmap, Recruiter Verdict Card, Industry Readiness Bars, Strength Analysis, 30/60/90 Day Roadmap, and Interview Questions Accordion.

#### [NEW] src/components/ReportSection.tsx
*   Create a detailed report view (Preview Report).
*   Include all 15 required sections (Cover Page, Executive Summary, Breakdown, etc.).
*   Add mock "Download PDF / Print / Share" buttons.

## Verification Plan

### Automated Tests
*   Run `npm run build` to ensure no TypeScript or Next.js build errors.

### Manual Verification
*   Open the app in the browser and verify the premium dark theme and animations.
*   Test the "Try Sample Analysis" flow to ensure the Dashboard and Report sections render correctly with the mock data.
*   Verify the Navbar and Developer page updates.
