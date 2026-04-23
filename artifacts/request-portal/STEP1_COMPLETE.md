# Request Portal - Step 1 Complete

## 📁 Files Created for Visitor App (Step 1)

```
artifacts/request-portal/visitor-app/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   └── pages/
│       └── StepOne.tsx
└── README.md
```

### File Details:

1. **package.json** - Dependencies and scripts
2. **vite.config.ts** - Vite build configuration
3. **tsconfig.json** - TypeScript config for src
4. **tsconfig.node.json** - TypeScript config for vite
5. **index.html** - HTML entry point with RTL support
6. **src/main.tsx** - React entry point
7. **src/App.tsx** - Main app component
8. **src/index.css** - Global styles (empty/minimal)
9. **src/pages/StepOne.tsx** - The complete registration form
10. **README.md** - Build instructions

---

## 🚀 How to Run

### Step 1: Clone and Navigate
```bash
git clone https://github.com/mym-dev-ui/unity-bank-dashboard.git
cd unity-bank-dashboard/artifacts/request-portal/visitor-app
git checkout custom-request-platform
```

### Step 2: Install Dependencies
```bash
npm install
# or
pnpm install
```

### Step 3: Start Development Server
```bash
npm run dev
# or
pnpm dev
```

### Step 4: Open in Browser
```
http://localhost:5173
```

---

## 🎨 Page Preview Details

### Design Features:
- **Dark Modern Style**: Gradient background (#0f172a → #1a2240)
- **Arabic RTL**: Full right-to-left layout support
- **Responsive**: Mobile-friendly with max-width 440px
- **Animations**: Smooth slide-up and fade-in effects
- **Interactive**: Focus states, hover effects, loading spinner

### Form Fields:
1. **الاسم الكامل** (Full Name)
   - Text input, required validation
   
2. **رقم الجوال** (Phone Number)
   - Tel input with +966 prefix
   - Max 9 digits
   - Right-aligned in RTL
   
3. **رقم الهوية** (ID Number)
   - Text input, required validation

### Button:
- **التسجيل** (Register) button
- Blue gradient background
- Loading spinner animation
- Disabled state during submission
- Hover lift effect

### Colors Used:
- Background: `#0f172a`, `#1a2240`, `#162e4a`
- Primary: `#3b82f6` (Blue)
- Secondary: `#1d4ed8` (Darker Blue)
- Text: `#ffffff` (White), `#94a3b8`, `#cbd5e1`
- Error: `#ef4444` (Red)

### Typography:
- Main title: 28px, bold, white
- Labels: 14px, 500 weight
- Inputs: 15px, light background
- Footer: 12px, muted text

---

## 📸 Visual Layout

The page displays:
```
┌─────────────────────────────────────┐
│                                     │
│          [Blue Circle Logo]         │
│                                     │
│          إنشاء حساب                 │
│    أدخل بيانات التسجيل الأساسية    │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ الاسم الكامل                  │  │
│  │ [___________________________]  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ رقم الجوال                    │  │
│  │ [______________] +966         │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ رقم الهوية                    │  │
│  │ [___________________________]  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │       [التسجيل]               │  │
│  └───────────────────────────────┘  │
│                                     │
│  بالتسجيل، أنت توافق على الشروط   │
│                                     │
└─────────────────────────────────────┘
```

---

## ✅ Status: COMPLETE

**Step 1 Page**: ✅ DONE
- Form structure complete
- All fields implemented
- Validation in place
- Dark modern design
- Arabic RTL support
- Mobile responsive
- Animations working
- Error handling ready

**Next Phase**: Not started (awaiting approval to proceed)

---

## 🔗 GitHub Branch
`https://github.com/mym-dev-ui/unity-bank-dashboard/tree/custom-request-platform`

Files in: `artifacts/request-portal/visitor-app/`
