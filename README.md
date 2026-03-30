<p>
  <img src="assets/imgs/logo/dp-icon.png" width="50" style="vertical-align: middle;">
  <img src="assets/imgs/logo/text-logo.png" width="140" style="vertical-align: middle;">  
</p>

Official website for **DjangoPlay**

### 🌐 Production
https://djangoplay.org/

---

### 📦 Repositories

* 🦊 GitLab: [https://gitlab.com/codefleet](https://gitlab.com/codefleet)
* 🐙 GitHub Mirror: [https://github.com/codefleetx](https://github.com/codefleetx)

---

## Overview

This website serves multiple purposes:

* DjangoPlay platform landing page
* Developer portfolio
* Open-source libraries showcase
* Architecture and engineering philosophy presentation
* Central hub linking GitLab, GitHub, PyPI, and relevant projects

The site is built as a **fully static website** using HTML, CSS, and vanilla JavaScript — no frameworks or build tools required.

---

## Features

### Landing Page

* Project introduction
* Technology stack overview
* Architecture principles
* Animated code block
* Responsive layout

### Developer Portfolio

* Developer profile
* Career timeline
* Featured project (DjangoPlay)
* Open-source libraries (PyPI)
* Repository list
* Skills grid
* Social links
* Section scroll navigation

### Theme System

* Light theme
* Space / dark theme
* Animated star background
* Theme toggle with persistence

### Portfolio Content System

Portfolio content is rendered dynamically from a JSON file, allowing content updates without modifying HTML or JavaScript.

### Performance Features

* Lazy image loading
* Scroll spy navigation
* Minimal JavaScript
* No external frameworks
* Fast load times

---

## Project Structure

```
djangoplay-site/
│
├── index.html
├── developer.html
│
├── assets/
│   ├── css/
│   │   ├── tokens.css
│   │   ├── base.css
│   │   ├── index.css
│   │   ├── developer.css
│   │   └── space-theme.css
│   │
│   ├── js/
│   │   ├── main.js
│   │   ├── theme.js
│   │   ├── space.js
│   │   ├── portfolio.js
│   │   └── code-block.js
│   │
│   ├── images/
│   └── content.json
│
└── README.md
```

---

## Design Architecture

The CSS architecture follows a structured design system:

| File            | Purpose                                       |
| --------------- | --------------------------------------------- |
| tokens.css      | Design tokens (colors, spacing, typography)   |
| base.css        | Layout, navigation, footer, shared components |
| index.css       | Landing page styles                           |
| developer.css   | Developer portfolio styles                    |
| space-theme.css | Space theme visual effects                    |

This separation ensures maintainability and scalability.

---

## JavaScript Modules

| File          | Purpose                                            |
| ------------- | -------------------------------------------------- |
| main.js       | Page initialization, nav active state, lazy images |
| theme.js      | Theme toggle and persistence                       |
| space.js      | Star background animation                          |
| portfolio.js  | Renders developer portfolio from JSON              |
| code-block.js | Animated code block on landing page                |

---

## Running the Website

Since this is a static website, you can run it using any static server.

### Option 1 — Python

```
python -m http.server 8000
```

### Option 2 — Node

```
npx serve
```

### Option 3 — Open directly

Open `index.html` in the browser.

---

## Deployment

This site can be deployed to:

* GitHub Pages
* GitLab Pages
* Netlify
* Vercel
* Any static hosting service

---

## License

This project is released under the MIT [License](LICENSE).

---

## Author

**Chandrashekhar Bhosale**

*Software Engineer | Python, Django Backend | Systems Architecture*
* Contact: contact@djangoplay.org