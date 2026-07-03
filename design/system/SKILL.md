---
name: cenit-design
description: Use this skill to generate well-branded interfaces and assets for Cénit Digital, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key facts:
- Themes: light = Bosque & Limón, dark = Noche & Oro (toggle via `data-theme` on `<html>`). Consume colors only via `var(--color-…)`.
- Type: Outfit (display) + DM Sans (text). Load via `styles.css`.
- Logo: "Órbita" (ring + gradient wave + zenith dot), theme-adaptive — see `assets/` and `components/core/Logo.jsx`. Never redraw or hardcode its colors.
- For production (Vite + React + SCSS repo `Cenit-Digital/WebEmpresa`), use `docs/DESIGN_SYSTEM.md` + `HANDOFF.md` + `cenit-design-system-export/`.
