# AI-Powered Support Ticket Management and Intelligent Resolution System

A complete, production-style web application built using the MERN stack. It uses AI/NLP techniques to automatically classify incoming support tickets, detect priority and severity, assign tickets to the correct support team, and recommend responses for agents.

## Features

- **User Authentication**: JWT-based auth with Role-Based Access Control (Admin, Support Agent, Customer).
- **AI Ticket Classification**: Automatically predicts ticket category, priority, severity, and assigned team using a lightweight local NLP classifier (TF-IDF).
- **AI Response Recommendation**: Suggests responses based on the AI classification which agents can accept, edit, or reject.
- **Ticket Management**: Create, view, update, and close tickets with advanced filtering, searching, and pagination.
- **Ticket Conversation**: Real-time style chat threads between customers and support agents.
- **Admin Dashboard & Analytics**: Visual charts (Recharts) displaying ticket volume, workload distribution, and AI accuracy insights.
- **Graceful Degradation**: The system falls back to default ticket values if the AI service fails.

## Technology Stack

- **MongoDB** / Mongoose
- **Express.js**
- **React.js** (Vite, React Router, Recharts, Tailwind CSS, Lucide React)
- **Node.js**
- **Natural** (Node.js NLP library for TF-IDF classification)

## Folder Structure

```
├── client/          # React Frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React Context for global state (Auth)
│   │   ├── pages/       # Route-level components
│   │   └── services/    # Axios API config
│   └── ...
├── server/          # Express Backend
│   ├── config/      # DB Connection
│   ├── controllers/ # Route handlers
│   ├── middleware/  # Auth & Error handling
│   ├── models/      # Mongoose schemas
│   ├── routes/      # Express routes
│   ├── services/    # AI implementation logic
│   └── seed.js      # DB Seeding script
└── README.md
```

## Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally on default port 27017 or provide a cloud URI)

### Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (you can copy `.env.example`):
   ```bash
   cp .env.example .env
   ```
4. Seed the database with demo data:
   ```bash
   npm run seed
   ```
5. Start the backend server (runs on port 5000):
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

## Demo Accounts

The database seed script creates the following demo accounts (Password for all: `Admin@123`, `Agent@123`, `Customer@123` respectively):
- **Admin**: `admin@example.com`
- **Support Agent**: `agent@example.com`
- **Customer**: `customer@example.com`

## AI Setup / Architecture

The AI module is located in `server/services/ai/`. 
By default, it uses a lightweight local TF-IDF classifier (`natural` library) trained on a small dataset. This ensures the project runs smoothly without requiring expensive paid APIs. The abstraction layer `aiService.js` makes it easy to swap in OpenAI, Gemini, or other LLMs later by modifying the `analyzeTicket` function to make external API calls.
