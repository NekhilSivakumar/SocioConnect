# SocioConnect 🎓⚡

**VIT Campus Fresher-Senior Connecting Platform & Core Academic Vault**

SocioConnect bridges the gap between 1st-year freshers and experienced senior mentors across VIT campus (Vellore & Chennai). It enables instant matchmaking for sports, hackathons, and jam sessions, alongside a curated 3-column academic course vault for Calculus, Physics, and Chemistry.

---

## 🚀 Key Features

- **Sticky Modern Navigation**: Instant tab switching, campus status indicator, and quick action modals.
- **Hero Section**: Radiant dark theme with gradient typography, stats bar, and dynamic spring CTA buttons.
- **Core 3-Column Course Catalog**:
  - 🧮 **Calculus & Differential Equations** (`MAT1011` / `MAT2001`) — Difficulty: Hard (9.2/10)
  - ⚛️ **Engineering Physics & Modern Optics** (`PHY1701` / `PHY1999`) — Difficulty: Moderate-Hard (8.4/10)
  - 🧪 **Engineering Chemistry & Materials** (`CHY1701`) — Difficulty: Moderate (7.3/10)
- **VIT Sports & Activity Matchmaker**: Live interactive lobby system for Football, Badminton, Cricket, Hackathons, Gaming, and Jam sessions across VIT grounds & hostel blocks (`MH-A` to `MH-Q` and `LH`).
- **1-on-1 Senior Mentorship**: Direct guidance on FFCS teacher choices, CAT/FAT strategies, and club recruitment from 9+ CGPA senior rankers.
- **Smooth Spring Micro-interactions**: Built with `motion/react` and `lucide-react`.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Dark radiant palette)
- **Animations**: Motion (`motion/react`)
- **Icons**: Lucide React (`lucide-react`)

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 🌐 Deploy to Vercel

### Option 1: Via Vercel CLI
```bash
npx vercel
```
Follow the interactive prompt to link your Vercel account and deploy.

### Option 2: Via GitHub & Vercel Dashboard
1. Push this project directory to a GitHub repository:
   ```bash
   git remote add origin https://github.com/<your-username>/socioconnect.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your `socioconnect` repository and click **Deploy**. Vercel will automatically detect Next.js and deploy your application with global CDN caching and SSL.

