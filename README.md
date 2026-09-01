# 🗺️ TripPlanner - Interactive Trip Planner

> An AI-powered interactive travel journal that generates, manages, and customizes personalized day-by-day travel itineraries.

## 🌐 Live Demo

🚀 **[Open TripPlanner →](https://trip-planner-50hi.onrender.com)**

**Frontend:** [https://trip-planner-50hi.onrender.com](https://trip-planner-50hi.onrender.com)

**Backend:** [https://atul-trip-planner-backend.onrender.com](https://atul-trip-planner-backend.onrender.com)

---

## 📖 About the Project

**TripPlanner** is a handcrafted React + Express web application designed to transform free-form travel descriptions into structured, day-by-day travel itineraries using the **Google Gemini API**.

Instead of using a traditional chatbot-style interface, TripPlanner provides an interactive **travel journal board** where users can explore, edit, reorder, and customize their travel plans in real time.

The application combines AI-powered itinerary generation with an interactive visual planning experience.

---

## ✨ Features

### 🗺️ AI-Powered Trip Planning

Users can describe their trip naturally, for example:

> "Create a 4-day trip to Tokyo focusing on anime culture, temples, and local food."

The application generates a structured itinerary containing:

- Day-by-day plans
- Morning, afternoon, and evening activities
- Activity descriptions
- Locations
- Estimated duration
- Estimated cost
- Daily themes

---

### 📖 Cozy Travel Journal Theme

TripPlanner is designed to feel like a digital travel journal instead of a generic AI chatbot.

The UI includes:

- Paper-inspired backgrounds
- Journal-style cards
- Sticky-note elements
- Binder-ring visual elements
- Polaroid-inspired frames
- Handwritten-style visual elements
- Warm color palettes
- Light mode
- Dark mode

---

### ✏️ In-Place Editing

Almost every major itinerary field can be edited directly from the interface.

Users can modify:

- Day title
- Day theme
- Activity name
- Time
- Description
- Location
- Duration
- Cost

Changes are reflected immediately in the interactive itinerary board.

---

### 📅 Interactive Day Management

Users can:

- Add new days
- Delete existing days
- Automatically re-index day numbers
- Switch between different days
- Add new stops
- Delete existing stops

For example:

```text
Day 1
Day 2
Day 3
```

If Day 2 is deleted:

```text
Day 1
Day 2
```

The application automatically repairs the day numbering.

---

### 🔄 Stop Reordering

Activities within a day can be reordered using:

- ⬆️ Up
- ⬇️ Down

This allows users to adjust the sequence of activities according to their preferred schedule.

---

### 🤖 AI Itinerary Refinement

After generating an itinerary, users can provide follow-up instructions.

Examples:

```text
Make it more budget friendly
```

```text
Add a museum visit to Day 2
```

```text
Remove expensive activities
```

```text
Add more local food experiences
```

The application sends the existing itinerary along with the new instruction to Gemini so that the AI can refine the current plan.

---

### 🛡️ Stale Response Protection

TripPlanner uses a request sequence tracker in `src/App.jsx`.

If multiple AI requests are submitted before an earlier request finishes, slower responses from older requests are ignored.

This prevents an outdated AI response from overwriting the latest itinerary.

---

### 🚨 Error Recovery & Demo Mode

The application handles API failures and other generation errors gracefully.

Users can:

- Retry the request
- Load a pre-built Tokyo demo itinerary
- Start a new itinerary from scratch

The demo mode allows users to explore the application's editing features even when the AI service is unavailable.

---

### 📱 Responsive Design

The interface is optimized for:

- Desktop
- Laptop
- Tablet
- Mobile browsers

The layout adapts to different screen sizes while maintaining the journal-style experience.

---

### 💾 Trip History

Generated and modified itineraries are automatically stored in the browser using `localStorage`.

Users can:

- View previous trips
- Restore previous itineraries
- Continue editing saved trips
- Delete old trips

No external database is required for trip history.

---

### 📤 Export as JSON

Users can export their finalized itinerary as a structured JSON file.

Example:

```text
itinerary-tokyo-trip.json
```

---

### 🖨️ Print Itinerary

TripPlanner includes a print-friendly layout.

Users can print their itinerary or save it as a PDF using the browser's print dialog.

Web-only controls such as buttons and sidebars are hidden from the print layout.

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- JavaScript
- React Hooks
- Lucide React Icons

### Main Frontend Component

```text
src/App.jsx
```

### Components

```text
src/components/
├── Header.jsx
├── HistorySidebar.jsx
├── PromptForm.jsx
├── LoadingBox.jsx
├── ErrorBox.jsx
├── EmptyState.jsx
├── DaysSidebar.jsx
├── DayContentPanel.jsx
├── StopCard.jsx
└── Footer.jsx
```

---

## Backend

- Node.js
- Express
- CORS
- dotenv
- Google Generative AI SDK

### Main Backend

```text
server.js
```

The Express backend acts as a proxy between the frontend and Gemini API.

This keeps the Gemini API key on the server instead of exposing it directly in the browser.

---

## Styling

TripPlanner uses:

- Vanilla CSS
- CSS variables
- HSL-based theme values
- Responsive layouts
- Custom print styles

Main stylesheet:

```text
src/index.css
```

---

## AI Integration

TripPlanner uses the **Google Gemini API** for itinerary generation.

Current model:

```text
gemini-3.6-flash
```

The backend requests structured JSON output so that the response can be parsed and rendered by the React application.

---

# 📁 Project Structure

```text
TripPlanner/
│
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── HistorySidebar.jsx
│   │   ├── PromptForm.jsx
│   │   ├── LoadingBox.jsx
│   │   ├── ErrorBox.jsx
│   │   ├── EmptyState.jsx
│   │   ├── DaysSidebar.jsx
│   │   ├── DayContentPanel.jsx
│   │   ├── StopCard.jsx
│   │   └── Footer.jsx
│   │
│   ├── App.jsx
│   ├── utils.js
│   └── index.css
│
├── server.js
├── vite.config.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

# 🚀 Setup & Installation

## 1. Prerequisites

Make sure the following are installed:

- Node.js v18.x or later
- npm

Check your Node.js version:

```bash
node --version
```

Check npm:

```bash
npm --version
```

---

## 2. Clone the Repository

```bash
git clone https://github.com/gauravshuklaaaaa/trip-planner.git
```

Move into the project directory:

```bash
cd trip-planner
```

---

## 3. Install Dependencies

Run:

```bash
npm install
```

This installs all required dependencies for the React frontend and Express backend.

---

# 🔑 4. Configure Gemini API Key

Create a `.env` file in the project root.

You can use `.env.example` as a template:

```bash
cp .env.example .env
```

Then add your Gemini API key:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

The backend reads the key using:

```js
process.env.GEMINI_API_KEY
```

### ⚠️ Security

**Never commit your `.env` file to GitHub.**

Make sure `.env` is included in `.gitignore`.

For production deployment, configure `GEMINI_API_KEY` through the hosting provider's environment-variable settings.

---

# ▶️ 5. Run the Application Locally

Start the development environment:

```bash
npm start
```

The application runs two services.

### Backend

```text
http://localhost:3001
```

### Frontend

```text
http://localhost:5173
```

Open:

```text
http://localhost:5173
```

in your browser.

---

# 🔌 API

TripPlanner exposes the following main backend endpoint:

```text
POST /api/generate
```

### Request

```json
{
  "prompt": "Create a 3 day trip to Tokyo with temples and anime",
  "existingItinerary": []
}
```

`existingItinerary` is optional and is used when refining an existing itinerary.

---

## Response

The backend returns a structured itinerary:

```json
{
  "itinerary": [
    {
      "dayNumber": 1,
      "title": "Traditional Tokyo",
      "theme": "Temples and Culture",
      "stops": [
        {
          "time": "Morning",
          "activity": "Senso-ji Temple",
          "description": "Explore one of Tokyo's most famous temples.",
          "location": "Asakusa",
          "duration": "2 hours",
          "cost": "Free"
        }
      ]
    }
  ]
}
```

---

# 📖 Usage Guide

## 1. Generate a Travel Itinerary

Enter a natural-language travel request.

Example:

```text
A 4-day trip to Tokyo focusing on art galleries,
local cuisine, and cultural experiences.
```

Click:

```text
Plan Trip
```

The frontend sends the request to the Express backend.

The backend sends the request to Gemini and returns a structured itinerary.

---

## 2. Quick Suggestions

TripPlanner provides predefined travel suggestions such as:

- 🌸 3 Days in Tokyo
- 🏰 5 Days in Paris
- 🥾 4 Days in Iceland

Clicking a suggestion automatically starts itinerary generation.

---

## 3. Refine an Existing Trip

After generating an itinerary, users can enter additional instructions.

Examples:

```text
Make it budget friendly
```

```text
Add a museum visit to Day 2
```

```text
Remove expensive activities
```

```text
Add more local food experiences
```

The existing itinerary is sent along with the new prompt so Gemini can update the current plan.

---

# ✏️ Editing the Itinerary

Users can edit itinerary information directly from the board.

### Day Details

- Day title
- Day theme

### Stop Details

- Activity name
- Time
- Description
- Location
- Duration
- Cost

---

# 📅 Managing Days

## Add Day

Click:

```text
+ Add Day
```

A new day is appended to the itinerary.

---

## Delete Day

Click the delete/trash control on a day.

The application automatically re-indexes the remaining days.

---

# 📍 Managing Stops

## Add Stop

Click:

```text
+ Add Stop
```

A new editable stop is created.

---

## Delete Stop

Use the delete control inside a stop card.

---

## Reorder Stops

Use:

```text
↑ Up
↓ Down
```

to move an activity within the selected day.

---

# 🌗 Theme

TripPlanner supports:

- Light Mode
- Dark Mode

The selected theme is stored in browser `localStorage`.

---

# 🕘 Trip History

TripPlanner automatically saves generated and modified itineraries locally.

Trip history allows users to:

- Restore previous trips
- Continue editing trips
- Delete old trips
- Maintain multiple itinerary drafts

Storage is handled using:

```text
localStorage
```

---

# 📤 Exporting

Users can export the finalized itinerary as JSON.

The exported file contains the complete structured itinerary including:

- Days
- Activities
- Locations
- Times
- Descriptions
- Duration
- Cost

---

# 🖨️ Printing

Click:

```text
Print Itinerary
```

The browser's print dialog will open.

The application includes a dedicated print stylesheet that hides web-only controls and optimizes the itinerary for printing or saving as PDF.

---

# 🛡️ Error Handling

TripPlanner includes defensive error handling for several situations.

### Missing API Key

The backend detects when `GEMINI_API_KEY` is missing and returns an appropriate error.

### Invalid Request

Empty or invalid prompts are rejected before making an AI request.

### Gemini API Errors

Gemini API failures are caught by the Express backend and returned to the frontend.

### Invalid AI Output

The backend validates and parses the Gemini response as JSON.

Malformed responses are handled without crashing the application.

### Request Timeout

The frontend uses `AbortController` to prevent requests from remaining pending indefinitely.

### Stale Requests

Older AI responses are ignored when a newer request has already been submitted.

---

# 🧠 AI Output Structure

Gemini is instructed to return a JSON array containing day objects.

Each day follows this structure:

```json
{
  "dayNumber": 1,
  "title": "Traditional Tokyo",
  "theme": "Culture and History",
  "stops": [
    {
      "time": "Morning",
      "activity": "Senso-ji Temple",
      "description": "Explore the historic temple and surrounding streets.",
      "location": "Asakusa, Tokyo",
      "duration": "2 hours",
      "cost": "Free"
    }
  ]
}
```

The frontend uses a sanitizer utility to handle incomplete or malformed itinerary fields.

---

# 🌐 Deployment

TripPlanner is deployed using **Render**.

## Frontend

🚀 **[https://trip-planner-50hi.onrender.com](https://trip-planner-50hi.onrender.com)**

## Backend

🔧 **[https://atul-trip-planner-backend.onrender.com](https://atul-trip-planner-backend.onrender.com)**

## API Endpoint

```text
https://atul-trip-planner-backend.onrender.com/api/generate
```

The frontend communicates directly with the deployed Express backend.

The Gemini API key remains on the backend and is not exposed to the frontend.

---

# ⚠️ Known Limitations

## 1. AI Output Consistency

Very short, ambiguous, or nonsensical prompts may occasionally result in itineraries with fewer details than expected.

The application uses a sanitizer utility to reduce the possibility of UI crashes caused by incomplete AI responses.

---

## 2. API Quotas and Rate Limits

Gemini API usage is subject to the quota and rate limits associated with the configured API key and model.

If a quota or rate limit is reached, the application displays an appropriate error message and allows the user to retry.

---

## 3. Sequential Reordering

Stop reordering currently works within the active day.

Moving stops directly between different days is not implemented.

---

## 4. Local Storage

Trip history is stored using browser `localStorage`.

The available storage depends on the user's browser and environment.

Very large histories may require older trips to be deleted.

---

## 5. No User Authentication

The current application does not implement:

- User accounts
- Login
- Registration
- Cloud synchronization

Trip history is stored locally in the user's browser.

---

# 🎨 Design Philosophy

TripPlanner intentionally avoids the appearance of a conventional AI chatbot.

The application is designed around the concept of a:

> **Digital Travel Journal**

The interface combines:

- Paper textures
- Journal-style cards
- Sticky notes
- Binder elements
- Timeline layouts
- Handwritten-inspired visual elements
- Warm styling
- Interactive editing

The goal is to make travel planning feel like organizing a personal travel journal rather than chatting with a generic AI assistant.

---

# 👤 Developer & Credits

**Developer:** Gaurav Shukla

**Project:** TripPlanner - Interactive Trip Planner

**Purpose:** Internship Assignment Submission

---

# 🤖 AI Usage Note

This project was developed with assistance from AI coding tools.

### AI Assistance

AI tools assisted with:

- Initial Vite project scaffolding
- Express backend boilerplate
- Gemini API integration structure
- Responsive CSS suggestions
- JSON parsing and validation ideas
- State-management logic suggestions
- Stop reordering validation
- Error-handling patterns

### Human Contributions

The project was manually developed and customized with emphasis on:

- UI/UX design
- Travel journal visual style
- Binder-ring simulations
- Polaroid-style frames
- Sticky-note elements
- Light/dark themes
- Interactive editing experience
- Demo itinerary
- Start-from-scratch functionality
- Error recovery flow
- Final integration
- Testing and deployment

---

# ⏱️ Time Spent

| Task | Time |
|---|---:|
| Planning & Research | 45 mins |
| Backend Setup & API Proxying | 45 mins |
| Frontend Board & Interaction Logic | 1.5 hours |
| UI/UX Styling | 1 hour |
| Testing & Documentation | 30 mins |
| **Total** | **~4.5 Hours** |

---

# 📌 Project Highlights

TripPlanner demonstrates practical implementation of:

- React state management
- React Hooks
- REST API communication
- Express backend development
- Gemini API integration
- Structured JSON generation
- Defensive JSON parsing
- Error handling
- Request timeout handling
- Stale request protection
- Local storage persistence
- Responsive UI design
- Light/dark themes
- Interactive itinerary editing
- Day and stop management
- JSON export
- Print-friendly layouts
- Frontend/backend deployment

---

# 🔄 Application Flow

```text
User describes a trip
        ↓
React Frontend
        ↓
Express Backend
        ↓
Google Gemini API
        ↓
Structured JSON Itinerary
        ↓
Interactive Travel Journal
        ↓
Edit / Add / Delete / Reorder
        ↓
Refine itinerary with AI
        ↓
Save to Trip History
        ↓
Export / Print
```

---

# 🚀 Live Application

## **[🌍 Open TripPlanner →](https://trip-planner-50hi.onrender.com)**

Try the deployed application and create your own AI-powered travel itinerary.

---

## 📄 License

This project was created as an internship assignment and demonstration project.
