# HEPA Evidence Hub

Frontend for the HEPA evidence hub.

## Project Structure

```text
docs/
  EDITING_GUIDE.md
src/
  app/
    App.tsx
    styles/
  assets/
    images/
  components/
    common/
    brand/
    layout/
    providers/
    sections/
    ui/
  content/
    navigation.ts
    home/
  hooks/
  lib/
  pages/
    home/
    not-found/
  test/
```

## Where To Edit

- Most homepage text and lists live in `src/content/home/`
- Navbar links live in `src/content/navigation.ts`
- A file-by-file map is in `docs/EDITING_GUIDE.md`

## Development

```bash
npm run dev
npm run build
npm run test
```
