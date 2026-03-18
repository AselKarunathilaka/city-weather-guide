# 🌍 City Weather Guide

**City Weather Guide** is a personal **passion project** built to explore how a modern front-end application can combine weather data, air quality, local time, and city background information into one interactive experience.

This project focuses on major cities around the world and presents:

- 🌤️ current weather
- 🌫️ air quality estimates
- 🕒 local city time and timezone
- 📅 5-day forecast
- 🏙️ city and country facts
- 📍 popular places
- 📖 short city background summaries

---

## 💡 Why I built this

I wanted to create a visually appealing city information platform that combines public data sources with a clean interface and a simple DevOps workflow.

This project also helped me practice:

- 🔌 working with external APIs
- 🎨 building a responsive UI with HTML, CSS, and JavaScript
- ⚡ using Vite for development and production builds
- 🔁 setting up CI/CD with GitHub Actions
- 🚀 preparing the project for deployment on platforms like GitHub Pages, Vercel, and Docker-based Linux servers

---

## ⚠️ Important note about data accuracy

This project uses **free public APIs** and public knowledge sources. Because of that, some information may be **approximate, delayed, incomplete, or inconsistent** depending on the city and source.

### 📌 Data accuracy disclaimer

- 🌤️ Weather and forecast data are fetched from free weather APIs and are generally suitable for learning and portfolio use.
- 🌫️ Air quality values in this project should be treated as **estimates** or **model-based values** rather than guaranteed live station-grade measurements.
- 📖 City descriptions, background information, and popular places may be derived from public summary-style sources and may not always be fully complete or perfectly up to date.
- 👥 Population figures and city metadata may vary depending on how the source defines city boundaries, metro areas, or administrative limits.

Because of these limitations, this project should be viewed as an **educational and demonstration project** rather than a source of authoritative real-time decision-making data.

---

## 🔗 APIs and data sources

This project uses free public APIs and public content sources, including:

- 🌦️ Open-Meteo
- 🌍 REST Countries
- 📚 Wikimedia / Wikipedia APIs

---

## ✨ Features

- 🔎 Search for a city
- 🏷️ Quick access to featured cities
- 🌤️ Current weather overview
- 🌫️ Air quality estimate
- 🕒 City local time and timezone
- 📅 5-day forecast
- 🏙️ Country and city snapshot
- 📍 Popular places section
- 📖 City background section
- 🎇 Animated modern UI background
- 📱 Responsive layout for desktop and smaller screens

---

## 🛠️ Tech stack

- 🧱 HTML
- 🎨 CSS
- 🧠 JavaScript
- ⚡ Vite
- 🔁 GitHub Actions
- 🌐 GitHub Pages / Vercel
- 🐳 Docker + Nginx for container deployment

---

## 📂 Project structure

city-weather-guide/
├─ .github/
│  └─ workflows/
│     └─ deploy.yml
├─ public/
│  └─ favicon.svg
├─ src/
│  ├─ css/
│  │  └─ style.css
│  └─ js/
│     ├─ api.js
│     ├─ config.js
│     ├─ data.js
│     ├─ helpers.js
│     ├─ main.js
│     └─ ui.js
├─ .gitignore
├─ index.html
├─ package-lock.json
├─ package.json
├─ README.md
└─ vite.config.js