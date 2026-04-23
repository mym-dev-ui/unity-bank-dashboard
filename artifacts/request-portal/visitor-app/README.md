# Build Instructions for Request Portal Visitor App

## Setup

1. Navigate to the visitor-app directory:
```bash
cd artifacts/request-portal/visitor-app
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run development server:
```bash
npm run dev
# or
pnpm dev
```

The app will be available at `http://localhost:5173`

## Features (Step 1)

- **Arabic RTL Layout**: Fully RTL support with proper text direction
- **Dark Modern Design**: Gradient background with blue accents
- **Form Fields**:
  - Full Name (الاسم الكامل)
  - Phone Number (رقم الجوال) - with +966 country code
  - ID Number (رقم الهوية)
- **Input Validation**: Basic client-side validation
- **Loading State**: Visual feedback during form submission
- **Error Handling**: User-friendly error messages in Arabic
- **Mobile Responsive**: Optimized for all screen sizes

## Architecture

- **Framework**: React 19 with TypeScript
- **Styling**: Inline styles (no CSS framework dependency)
- **Build Tool**: Vite
- **Dir**: RTL for Arabic support

## Next Steps

After approval of this page design:
1. Step 2 page (additional verification)
2. Step 3 page (confirmation)
3. API integration
4. Admin dashboard
5. Full backend implementation
