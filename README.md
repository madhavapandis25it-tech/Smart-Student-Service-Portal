# Smart Student Service Portal

A modern, premium frontend redesign for the Smart Student Service Portal — a university ERP landing page built with pure HTML5, CSS3, and Vanilla JavaScript.

## Design Philosophy

Apple-inspired minimalism meets Microsoft Fluent Design glassmorphism. Clean, spacious, and professional — built for trust and clarity.

## Theme

- **Style:** Glassmorphism + Light Corporate
- **Accent:** Royal Blue (#4F6DFF)
- **Font:** Inter
- **Background:** Campus photo with frosted glass overlay

## Setup

### 1. Add your college logo

Place your transparent PNG/SVG logo at:
```
assets/logo/psna logo.png
```

### 2. Add your campus photo

Place a high-resolution (1920×1080+) campus photo at:
```
assets/images/campus-bg.jpg
```

If the image is not found, the page gracefully falls back to a gradient background.

### 3. Open in browser

Open `index.html` in any modern browser.

## Project Structure

```
project/
├── index.html          # Main HTML
├── css/
│   ├── style.css       # Variables, base styles, layout
│   ├── animations.css  # Animations & transitions
│   └── responsive.css  # Responsive breakpoints
├── js/
│   ├── main.js         # Core functionality (nav, ripple, parallax, etc.)
│   └── animations.js   # Scroll reveal, sparkles, load sequence
├── assets/
│   ├── logo/           # College logo
│   ├── images/         # Campus photo
│   ├── icons/          # SVG icons
│   └── backgrounds/    # Background assets
└── README.md
```

## Features

- Frosted glass panels with backdrop-filter blur
- Floating gradient orbs and decorative elements
- Mouse parallax on hero spheres
- Button ripple effects
- Scroll-triggered reveal animations
- Smooth page load sequence
- Full responsiveness (360px to 4K)
- Keyboard navigation and ARIA labels
- Mobile hamburger menu with overlay
- Graceful degradation (reduced-motion support)

## Browser Support

Chrome, Firefox, Safari, Edge (latest 2 versions).
