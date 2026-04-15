# TapThat

## Project Overview

Our initiative, TapThat, is a web application centered on community engagement, aimed at supporting and promoting local British pubs, which are experiencing a decline in numbers throughout the UK.

The platform enables users to explore nearby pubs via an interactive map and discover the most efficient walking route to their closest pub utilizing an A star heuristic algorithm.

Users can participate by reviewing pints at various pubs, reading reviews from others, and connecting with the broader community through shared experiences rather than monetary transactions.

Each review submitted will feature an integrated AI component that evaluates the pour and assigns a score, fostering consistent quality and user involvement.

An aggregated leaderboard showcasing the most favored beers assists pubs in understanding community preferences and promotes interaction between patrons and local establishments.

The application embodies the principle of sharing and community building by enhancing awareness of local pubs and motivating individuals to visit, support, and sustain them through collective engagement.

---

## Technical Stack

### Frontend
- HTML  
- CSS  
- JavaScript  
- PUG  

### Backend
- Node.js  
- Express.js  
- MySQL  

### DevOps and Tooling
- Docker  
- Git  
- GitHub Actions  
- GitHub Projects  

---

## Project Management

The project is executed using a Scrum-based methodology.

Tasks are organized through a GitHub Project Kanban board, and development is carried out iteratively over four sprints.

---

## Running the Project Locally

1. Clone the repository  
2. Ensure Docker is installed and operational  
3. Execute the Docker compose command  
4. Access the web application through a browser at the designated port.

### Environment Setup

The PourScore AI feature requires a Google Gemini API key.

1. Create a `.env` file in the root directory.
2. Get a free API key from [aistudio.google.com](https://aistudio.google.com/).
3. Add the key to your `.env` file:
   ```env
   GOOGLE_API_KEY=your_api_key_here
   ```

### Troubleshooting

**Missing `multer` module crashing the server?**
If you cloned the repository or updated the code, and your server is repeatedly crashing with `Error: Cannot find module 'multer'` (or similar), it's because Docker has cached an old version of the local `node_modules` volume.

To fix this, you must destroy the old volume and rebuild your containers:
```bash
docker-compose down -v
docker-compose up -d --build
```
*(The `-v` flag is critical—it deletes the old persistent volume so the new dependencies can properly install).*

---

## Repository Structure

The repository adheres to an Express project architecture with distinct folders for:
- Routes  
- Views  
- Public assets  

Docker configuration files are provided to guarantee a uniform development environment for the team.

---

## Team

- Jack Turner  
- Luke Pring  
- Alec Thompson  
- Sujal Shah
- Victor Tepeniuc

---

## Status

- **Sprint 1:** Project setup and initial planning have been completed.
- **Sprint 2:** Plans refined, Docker set up, code base started.
- **Sprint 3:** Initial UI added, database working and basic functionality complete.

---

## Section Grid Layout

Sections can be placed side-by-side using the `.section-row` flex container and width utility classes. All layouts collapse to full-width stacked on mobile (≤768px). The grid uses a tight **12px gap**.

### Available Classes

| Class | Width |
|---|---|
| `.w-full` | 100% |
| `.w-half` | 50% |
| `.w-third` | 33% |
| `.w-two-thirds` | 66% |
| `.w-quarter` | 25% |
| `.w-three-quarters` | 75% |

### Usage (Pug)

**Two halves:**
```pug
.section-row
  section.w-half
    h2 Left
  section.w-half
    h2 Right
```

**Third + two-thirds:**
```pug
.section-row
  section.w-third
    h2 Sidebar
  section.w-two-thirds
    h2 Main content
```

**Four quarters:**
```pug
.section-row
  section.w-quarter
    h2 One
  section.w-quarter
    h2 Two
  section.w-quarter
    h2 Three
  section.w-quarter
    h2 Four
```
