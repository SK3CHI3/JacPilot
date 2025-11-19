# Frontend Design Plan - JacPilot

## 🎨 Design System Overview

### Brand Colors
Based on the reference images, our color scheme will feature:

**Primary Gradient** (from image 2):
- **Orange to Yellow Gradient**: Rich orange (#FF6B35) transitioning to golden yellow (#FFD23F)
- **Gradient Direction**: Top-left (darkest orange) to bottom-right (brightest yellow)

**Supporting Colors**:
- **Dark Theme Base**: Deep dark (#0F0F0F or #1A1A1A) for main backgrounds
- **Soft White**: (#FFFFFF, #F5F5F5) for text and cards
- **Black Accents**: (#000000, #1A1A1A) for contrast
- **Purple Accents**: (#8B5CF6, #A78BFA) for highlights and CTAs
- **Green Accents**: (#10B981, #34D399) for success states and progress
- **Orange Accents**: (#F97316, #FB923C) for active states

### Typography
- **Headings**: Bold, modern sans-serif (Inter, Poppins, or similar)
- **Body**: Clean, readable sans-serif
- **Code**: Monospace (Fira Code, JetBrains Mono)

---

## 📱 Page 1: Student Dashboard (Main Focus)

### Layout Structure (Matching Image 1)

#### Top Navigation Bar
- **Position**: Fixed top, full width
- **Background**: Dark (#0F0F0F) with subtle gradient
- **Content**:
  - Left: Logo "JacPilot" (centered or left-aligned)
  - Center: Navigation links (Courses, Dashboard [active], Schedule, Forum)
  - Right: Language flags + User profile section
- **Active State**: Purple highlight (#8B5CF6)
- **User Profile**: Name, role ("Student"), profile picture (circular)

#### Main Content Grid (2-3 Column Layout)

**Top Row:**

1. **Live Session / Video Call Panel** (Left, Large)
   - **Size**: ~60% width, prominent
   - **Background**: Dark with subtle gradient
   - **Content**:
     - Video frame showing lesson/mentor session
     - Two participants (instructor + student avatars)
     - "ONLINE" indicator (green badge)
     - "Join speaking club" button (purple, with camera icon)
   - **Style**: Rounded corners, shadow, modern video call UI

2. **User Progress & Premium Status** (Middle)
   - **Card**: Vertical, orange-yellow gradient background
   - **Content**:
     - "PRO student" badge (top)
     - Three stats with icons:
       - "126 level" (or mastery level)
       - "14 quizzes" (completed)
       - "170 hours" (time spent)
   - **Style**: Gradient card, rounded, elevated

3. **Weekly Activity Chart** (Right)
   - **Content**:
     - Days of week (Mon-Sun) with checkmarks
     - Bar chart below showing daily activity
     - Purple gradient bars
   - **Style**: Clean chart, green checkmarks for active days

**Bottom Row:**

4. **Trainings Section** (Left, Wide)
   - **Title**: "Trainings" with subtitle
   - **Three Training Cards**:
     - **Vocabulary**: Green card, "12,567 words", progress bar
     - **Listening**: Dark grey card, "37h audio", progress bar
     - **Grammar**: Dark grey card, "60 lessons", progress bar
   - **Category Filters**: 8 buttons with icons
     - Food, Traveling, Sport, Animals, Health, Science, Work, Other
     - Active state: Orange highlight
   - **Style**: Grid of cards, progress bars, icon buttons

5. **Interactive Practice Section** (Right)
   - **Two Modules**:
     
     **a) Practice Speaking:**
     - Green "AI" circular icon
     - Spanish/Jac code example text
     - Microphone icon + audio waveform
     - Dark card background
     
     **b) Fast Repeat (Vocabulary):**
     - "Vocabulary" label, clock icon, "10 min practice"
     - Animated robot/mascot character
     - Purple circular button with arrow
     - Gamified, fun design

### Component Specifications

#### Cards
- **Background**: Dark (#1A1A1A) with subtle borders
- **Border Radius**: 12px-16px
- **Shadow**: Subtle elevation
- **Padding**: 20px-24px

#### Progress Bars
- **Active**: Green gradient (#10B981 to #34D399)
- **Inactive**: Dark grey (#2D2D2D)
- **Height**: 8px-12px
- **Border Radius**: Full rounded

#### Buttons
- **Primary**: Purple gradient (#8B5CF6 to #A78BFA)
- **Secondary**: Orange gradient (#F97316 to #FB923C)
- **Text**: White, bold
- **Border Radius**: 8px-12px
- **Hover**: Slight scale + glow effect

#### Icons
- **Style**: Modern, outlined or filled
- **Size**: 20px-24px
- **Color**: Match context (green for success, purple for actions)

---

## 🏠 Page 2: Homepage (Landing Page)

### Layout Structure (Matching Image 3)

#### Header/Navigation
- **Background**: White/light with subtle gradient
- **Logo**: "JacPilot" (left, blurred effect optional)
- **Nav Links**: Home, Product, Pricing, Integration (right)
- **CTA Button**: "Try Demo" (blue outline, rounded)

#### Hero Section

**Left Side (60% width):**
- **Intro Text**: "With JacPilot," (small, grey)
- **Headline**: "Make learning Jaseci more interesting!" (large, bold, dark grey)
- **Description**: "JacPilot is an adaptive learning platform to help you master Jaseci through interactive lessons, quizzes, and personalized learning paths."
- **Two CTAs**:
  - Primary: "Let's do it!" (solid blue, rounded)
  - Secondary: "Learn more" (white outline, dark text)

**Right Side (40% width):**
- **3D Visual**: Stylized Jaseci/Jac-themed 3D element
  - Could be: Code blocks, graph nodes, or abstract tech shape
  - Gradient background: Purple → Pink → Light Blue (vertical)
- **Section Number**: "01" (bottom right, vertical line)

#### Feature Cards Section (Below Hero)

**Two Cards Side-by-Side:**

1. **Card 1 - Rewards/Achievements:**
   - **Icon**: Gold medal with ribbon
   - **Title**: "More than 500 Concepts"
   - **Description**: "Master Jaseci with comprehensive lessons."
   - **CTA**: "Check out!" button

2. **Card 2 - Updates/Content:**
   - **Icon**: Abstract gradient icon (pink/blue)
   - **Title**: "Added 43 new lessons"
   - **Description**: "Fresh content added regularly."
   - **CTA**: "Check out!" button

### Design Elements

#### Background
- **Main**: White/light grey (#F9FAFB)
- **Gradients**: Soft, pastel transitions
- **Sections**: Alternating light backgrounds

#### Typography
- **Headline**: 48px-64px, bold, dark grey
- **Body**: 16px-18px, medium grey
- **CTAs**: 16px, bold, white

#### Spacing
- **Section Padding**: 80px-120px vertical
- **Card Gaps**: 24px-32px
- **Content Width**: Max 1200px, centered

---

## 🎮 Gamification Elements

### Progress Indicators
- **XP/Level System**: Show user level prominently
- **Streak Counter**: Daily learning streaks
- **Achievement Badges**: Unlockable badges for milestones
- **Progress Rings**: Circular progress for skills

### Interactive Elements
- **Hover Effects**: Cards lift, buttons glow
- **Animations**: Smooth transitions, loading states
- **Micro-interactions**: Button clicks, progress fills
- **Particle Effects**: Subtle background animations (optional)

### Visual Feedback
- **Success States**: Green checkmarks, confetti (subtle)
- **Error States**: Red highlights, helpful messages
- **Loading States**: Skeleton screens, spinners
- **Empty States**: Friendly illustrations, CTAs

---

## 📐 Component Library

### Core Components

1. **DashboardCard**
   - Props: title, subtitle, content, gradient, icon
   - Variants: default, gradient, outlined

2. **ProgressBar**
   - Props: value, max, color, showLabel
   - Variants: linear, circular, animated

3. **StatCard**
   - Props: icon, value, label, trend
   - Variants: default, gradient, compact

4. **ActivityChart**
   - Props: data, period, color
   - Variants: bar, line, area

5. **TrainingCard**
   - Props: title, value, progress, icon, color
   - Variants: vocabulary, listening, grammar

6. **PracticeModule**
   - Props: type, content, action
   - Variants: speaking, vocabulary, coding

7. **CategoryButton**
   - Props: label, icon, active
   - Variants: default, active, disabled

8. **VideoCallPanel**
   - Props: participants, status, action
   - Variants: live, recorded, preview

---

## 🛠️ Technology Stack

### Frontend Framework
- **React 18+** with TypeScript
- **Vite** for build tool
- **Tailwind CSS** for styling
- **Framer Motion** for animations

### UI Libraries
- **shadcn/ui** or **Radix UI** for components
- **Recharts** or **Chart.js** for charts
- **Monaco Editor** for code editor
- **React Router** for navigation

### Styling Approach
- **Tailwind CSS** with custom theme
- **CSS Variables** for colors
- **Gradient utilities** for brand colors
- **Dark mode** support

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Adaptations
- **Dashboard**: Stack cards vertically
- **Navigation**: Hamburger menu
- **Video Panel**: Full width
- **Charts**: Simplified, scrollable

---

## 🎨 Color Palette (Detailed)

### Primary Colors
```css
--orange-primary: #FF6B35;
--orange-light: #FF8C5A;
--yellow-primary: #FFD23F;
--yellow-light: #FFE066;
```

### Gradient Definitions
```css
--gradient-primary: linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%);
--gradient-purple: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%);
--gradient-green: linear-gradient(135deg, #10B981 0%, #34D399 100%);
```

### Neutral Colors
```css
--dark-bg: #0F0F0F;
--dark-card: #1A1A1A;
--dark-border: #2D2D2D;
--text-primary: #FFFFFF;
--text-secondary: #A1A1AA;
--text-muted: #71717A;
```

---

## 🚀 Implementation Phases

### Phase 1: Design System Setup
- [ ] Configure Tailwind with custom colors
- [ ] Set up typography system
- [ ] Create base component library
- [ ] Implement gradient utilities

### Phase 2: Dashboard Layout
- [ ] Build navigation bar
- [ ] Create grid layout system
- [ ] Implement video call panel
- [ ] Build progress cards

### Phase 3: Dashboard Components
- [ ] Activity chart component
- [ ] Training cards
- [ ] Practice modules
- [ ] Category filters

### Phase 4: Homepage
- [ ] Hero section
- [ ] Feature cards
- [ ] 3D visual element
- [ ] Responsive layout

### Phase 5: Gamification
- [ ] Progress indicators
- [ ] Achievement system
- [ ] Animations and transitions
- [ ] Interactive feedback

### Phase 6: Polish
- [ ] Responsive adjustments
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Final UI refinements

---

## 📝 Design Notes

### Key Principles
1. **Modern & Clean**: Minimal clutter, clear hierarchy
2. **Gamified**: Progress, achievements, streaks
3. **Professional**: Suitable for learning platform
4. **Accessible**: WCAG AA compliance
5. **Performant**: Fast load times, smooth animations

### Inspiration Sources
- **Dashboard**: Language learning platform (Image 1)
- **Colors**: Warm orange-yellow gradient (Image 2)
- **Homepage**: Modern product landing page (Image 3)

### Brand Identity
- **Name**: JacPilot
- **Tagline**: "Master Jaseci through adaptive learning"
- **Personality**: Friendly, professional, innovative
- **Tone**: Encouraging, clear, supportive

---

## ✅ Success Criteria

- [ ] Dashboard matches reference design (Image 1)
- [ ] Homepage matches reference design (Image 3)
- [ ] Brand colors implemented (Image 2 gradient)
- [ ] Fully responsive
- [ ] Smooth animations
- [ ] Accessible (WCAG AA)
- [ ] Fast performance (< 3s load)
- [ ] Modern, professional appearance

---

**Status**: 🎨 Design Plan Complete - Ready for Implementation

