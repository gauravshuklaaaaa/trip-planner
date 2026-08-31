# 🗺️ TripPlanner - Interactive Trip Planner

TripPlanner is a handcrafted React + Express web application designed to take free-form trip descriptions, generate structured day-by-day travel itineraries using the Gemini AI model, and render them as an interactive board. 

The application avoids plain chat interfaces in favor of a stateful, interactive **travel journal board** where users can expand, reorder, edit, and adjust their stops in real-time.

---

## ✨ Features

- **Cozy Travel Journal Theme**: A bespoke UI styling theme with custom paper backgrounds, handwriting notes, active markers, and cohesive warm color palettes that support both light and dark mode toggles.
- **In-place Editing**: Modify any day title, theme, stop name, time, description, location, cost, or duration directly in the UI.
- **Interactive Day and Stop Management**:
  - Add or delete entire days (the app automatically repairs sequence indexing).
  - Add new stops or delete existing ones.
  - Reorder stops chronological order with Up and Down controls.
- **Stale Response Protection**: Utilizes a sequence tracking hook/ref inside `src/App.jsx` to ignore slower in-flight AI responses if the user submits a new prompt in the meantime.
- **Error Recovery & Demo Mode**: If the Gemini API fails, has no key configured, or rate limits, the app presents a clear error dialog with setup instructions and offers:
  - **Try Tokyo Demo**: Load a rich pre-designed 3-day Tokyo itinerary template to try all interactive editing tools immediately.
  - **Start from Scratch**: Start with a single blank day and design your itinerary manually.
- **Mobile Responsive**: Scalable layouts optimized for both mobile screens and desktop monitors.
- **Export Utilities**: Export your finalized itinerary as structured JSON, or trigger a clean print-ready layout.

---

## 🛠️ Tech Stack

- **Frontend**: React (Hooks, Functional Components, Lucide Icons)
  - Main component: `src/App.jsx`
  - Components: `Header.jsx`, `DaysSidebar.jsx`, `DayContentPanel.jsx`, `StopCard.jsx`, `PromptForm.jsx`, `HistorySidebar.jsx`, `ErrorBox.jsx`, and `Footer.jsx`
- **Styling**: Vanilla CSS (Harmonious HSL properties, layout grids, modern typography) via `src/index.css`
- **Backend Proxy**: Node.js + Express (to route and secure the API Key outside the browser environment)
  - Main server: `server.js`
- **AI Integration**: Google Gemini API (`gemini-3.6-flash` model for structured JSON outputs)

---

## 🚀 Setup & Installation

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18.x or later).

### 2. Clone and Install Dependencies
Navigate to the project root directory and run:
```bash
npm install
```
*This installs all necessary packages specified in `package.json` for both the Vite React frontend and Express backend.*

### 3. Configure API Key
Create a `.env` file in the project root by copying the structure from `.env.example`:
```bash
cp .env.example .env
```
Open the `.env` file and replace the placeholder with your actual Gemini API Key:
```env
GEMINI_API_KEY=AIzaSyYourActualKeyHere...
```
*(You can get a free API Key at [Google AI Studio](https://aistudio.google.com/))*

### 4. Run the Application
Start the development environment by running:
```bash
npm start
```
This script executes **concurrently** to run:
- Express backend API server on [http://localhost:3001](http://localhost:3001)
- Vite React frontend server on [http://localhost:5173](http://localhost:5173) (requests are automatically proxied via Vite configuration in `vite.config.js`)

Open [http://localhost:5173](http://localhost:5173) in your browser to experience TripPlanner!

---

## 📖 Usage Guide

TripPlanner provides a comprehensive interface for planning, editing, and saving travel itineraries. Here is how you can get the most out of it:

### 1. Generating a Travel Itinerary
* **Use Prompts**: Enter your trip details in the central prompt form (e.g., *"A 4-day trip to Tokyo focusing on art galleries and local cuisine"*).
* **Use Quick Suggestions**: Click on one of the pre-configured suggestion pills (e.g., *🌸 3 Days in Tokyo*, *🏰 5 Days in Paris*, or *🥾 4 Days in Iceland*) to quickly fill the input box and trigger generation.
* **Refining / Modifying**: Once an itinerary is loaded, you can enter follow-up instructions (e.g., *"Make it budget friendly"* or *"Add a museum visit to Day 2"*). The app sends the current state along with your prompt to the backend, enabling contextual updates.

### 2. Navigating and Editing the Journal Board
* **Switching Days**: Use the sidebar tab panel (`DaysSidebar.jsx`) to jump between different days.
* **In-place Editing**: Almost every element on the board can be edited in-place:
  * **Day Details**: Edit the Day Title and Day Theme fields in the header block.
  * **Stop Details**: Modify the Stop Name (activity), Location, Est. Cost, Duration, and Description directly in the fields.
* **Reordering Stops**: Use the Up ($\uparrow$) and Down ($\downarrow$) buttons inside any stop card (`StopCard.jsx`) to shift that activity's order within the day.
* **Managing Days and Stops**:
  * **Add Day**: Scroll to the bottom of the days list and click "+ Add Day" to append a blank day.
  * **Delete Day**: Click the trash icon on the day's tab button to remove it. Day numbers will automatically re-index.
  * **Add Stop**: Click the "+ Add Stop" button at the bottom of the day's timeline to create a new stop.
  * **Delete Stop**: Click the "Delete" button inside a stop card to remove it from the timeline.

### 3. Settings & History Sidebar
* **Toggle Theme**: Click the theme switcher button in the header (`Header.jsx`) to alternate between a clean warm Light Mode and a deep, cozy dark paper Dark Mode.
* **Trip History**: Click the history icon (or slide open the history sidebar) to view previous itineraries. TripPlanner automatically saves generated and modified trips locally. You can restore previous plans or clear your history at any time.

### 4. Exporting & Printing
* **Export as JSON**: Click the "Export JSON" button to download your customized trip data as a structured JSON file.
* **Print Itinerary**: Click the "Print" button to open the browser's print dialog. The interface loads a specialized print stylesheet that hides web-only controls (buttons, forms, and sidebars) and optimizes the pages for paper printing or saving as PDF.

---

## 👤 Developer & Credits

* **Developer**: Atul
* **Project**: TripPlanner (Interactive Trip Planner)
* **Purpose**: Internship Assignment Submission

### 🤖 AI-Usage Note
This project was developed by Atul with the assistance of **Antigravity (an AI coding assistant)**:
- **What AI did**: Assisted in scaffolding the Vite project, writing boilerplate Express route configurations in `server.js`, suggesting responsive CSS variables for light/dark modes, and assisting with boundary check validation logic in the stop reordering states.
- **What a Human (Atul) did**: Hand-tuned the aesthetic design layout (adding binder ring simulations, polaroid frames, and sticky note styling), designed the fallbacks (the interactive Tokyo demo and start from scratch functions), and carefully commented the code logic to explain the state mutations.

---

## ⚠️ Known Limitations

1. **AI Output Consistency**: Occasionally, very short or nonsensical user prompts might return itineraries with empty descriptions or fewer stops than expected. The app uses a fallback utility sanitizer (`sanitizeItinerary` in `src/utils.js`) to fill empty fields with readable defaults to prevent app crashes.
2. **Rate Limits**: The free tier of Gemini has a limit of 15 requests per minute. If this quota is hit, the application catches the error code and shows a friendly retry notice.
3. **Sequential Reordering**: Reordering stops currently moves elements up or down inside their active Day array. Drag-and-drop between different days is not implemented in order to keep the codebase lightweight and highly responsive on mobile browsers without introducing bulky external packages.
4. **Local Storage Limit**: Trip history is stored in the browser's local storage (up to ~5MB). Exceeding this limit might prevent saving new trips unless older ones are deleted.

---

## ⏱️ Time Spent

- **Planning & Research**: 45 mins (interpreting structured output schemas and fallback structures)
- **Backend Setup & API Proxying**: 45 mins (Express implementation, proxy setup in Vite, defensive JSON parser)
- **Frontend Board & Interaction Logic**: 1.5 hours (React states, active tabs, add/remove day, add/remove stop, move item)
- **UI/UX Styling (Cozy Journal Theme)**: 1 hour (Light/dark variables, timeline design, washi-tape decorations, print stylesheets)
- **Testing & Documentation**: 30 mins (verification of edge cases, README)
- **Total Time**: **~4.5 Hours**
