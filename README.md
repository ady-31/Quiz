# Interactive Quiz Platform

A modern React-based quiz application that allows users to take timed quizzes and track their progress.

## Features

- Interactive quiz interface with multiple-choice questions
- Timer-based questions (30 seconds per question)
- Instant feedback on answers
- Progress tracking and attempt history
- Responsive design for all devices
- Local storage using IndexedDB for attempt history

## Technologies Used

- React 18
- React Router v6
- Styled Components
- IndexedDB (via idb package)
- Vite

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173 in your browser

## Build for Production

To create a production build:

```bash
npm run build
```

The build files will be in the `dist` directory, ready for deployment.

## Deployment

This application can be deployed to Vercel or Netlify. The build command is `npm run build` and the publish directory is `dist`.

## Project Structure

- `/src`
  - `/components` - React components
  - `/context` - React context for state management
  - `App.jsx` - Main application component
  - `main.jsx` - Application entry point
  - `index.css` - Global styles

## Features to Add

- [ ] Add more quiz questions
- [ ] Implement different quiz categories
- [ ] Add user authentication
- [ ] Add a leaderboard
