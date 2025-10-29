# FIFA Traffic Demo - Production Notes

## Internationalization (i18n) Implementation

**NOTE:** This application supports bilingual functionality (English/Spanish) using a database-driven translation system.

### Architecture

The i18n system is implemented using:

1. **Database-Backed Translations** (`Translation` model in Prisma)
   - All translatable strings are stored in the database
   - Allows dynamic translation updates without code deployment
   - Supports categorization (general, events, etc.)

2. **React Context for Client-Side State** (`TranslationContext`)
   - Provides `t()` function for translation lookup
   - `setLocale()` for switching languages without page reload
   - Initial translations hydrated from server to prevent hydration errors

3. **API Endpoint** (`/api/translations`)
   - Fetches translations dynamically when language changes
   - Query parameter: `?locale=en` or `?locale=es`

### Key Features

- **No Page Reload**: Language switching happens instantly via React state
- **URL Updates**: Language preference reflected in URL (`/en` or `/es`)
- **Server-Side Rendering**: Initial page load includes correct translations
- **Hydration Safe**: Server and client render the same content initially

### File Structure

```
src/
├── contexts/
│   └── TranslationContext.tsx    # Client-side translation provider
├── app/
│   ├── api/
│   │   └── translations/
│   │       └── route.ts           # Translation API endpoint
│   └── [lang]/
│       ├── layout.tsx             # SSR translation loading
│       └── page.tsx               # Main page
└── components/
    ├── LanguageSwitcher.tsx       # EN/ES toggle button
    ├── EventList.tsx              # Uses t('upcoming_events')
    ├── EventCard.tsx              # Uses t('event_*_name')
    └── VenueMarker.tsx            # Uses t('stadium')

prisma/
├── schema.prisma                  # Translation model definition
└── seed-translations.ts           # Translation seed data
```

### Usage in Components

```tsx
// In any client component:
import { useTranslation } from '@/contexts/TranslationContext';

function MyComponent() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <div>
      <h1>{t('upcoming_events')}</h1>
      <button onClick={() => setLocale('es')}>Español</button>
    </div>
  );
}
```

### Adding New Translations

1. Add translations to `prisma/seed-translations.ts`:
   ```ts
   { key: 'new_key', locale: 'en', value: 'English Text', category: 'general' },
   { key: 'new_key', locale: 'es', value: 'Texto en Español', category: 'general' },
   ```

2. Run seed script:
   ```bash
   npx tsx prisma/seed-translations.ts
   ```

3. Use in components:
   ```tsx
   {t('new_key')}
   ```

### Supported Locales

- `en` - English (default)
- `es` - Spanish (Español)

### Event Translation Keys

Event translations follow the pattern: `event_{fifaEventId}_{field}`

Example:
- `event_m01_name` - "Group Stage: USA vs. England" / "Fase de Grupos: EE.UU. vs. Inglaterra"
- `event_m01_description` - Match description text

### Migration Notes

- Next.js 16 deprecated `middleware.ts` in favor of `proxy.js` (warning present, functional)
- Dynamic route params must be awaited in Next.js 15+ (`await params`)
- `generateStaticParams()` required for `[lang]` dynamic route segment
