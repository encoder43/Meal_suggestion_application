# 🥗 AI Nutritionist & Meal Suggestion App

![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-green?logo=fastapi)
![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)


An intelligent, full-stack application that generates personalized daily meal plans using an AI agent by taking the necessary information from user.
=======



---

## ✨ Key Features


* **Detailed User Questionnaire:** Captures comprehensive user data including biometrics, activity levels, dietary patterns, allergies, and goals.
* **AI-Powered Meal Generation:** Utilizes a sophisticated AI agent built with LangGraph and powered by the Groq API to create unique meal plans.
* **Dynamic HTML Output:** The AI agent generates a clean, styled HTML response, making the frontend display logic simple and robust.
* **Full-Stack Architecture:** Modern technology stack featuring a React/TypeScript frontend and a Python/FastAPI backend.
* **Asynchronous Backend:** Built with FastAPI for high-performance, non-blocking API requests.

---

## 🛠️ Tech Stack

This project is a monorepo containing both the frontend and backend.

* **Frontend:**
    * **Framework:** React
    * **Language:** TypeScript
    * **Build Tool:** Vite
    * **Styling:** Tailwind CSS (via CDN)

* **Backend:**
    * **Framework:** FastAPI
    * **Language:** Python
    * **AI Agent Framework:** LangGraph
    * **LLM Provider:** Groq API

---

## 📂 Project Structure

The project is organized with a clear separation of concerns:

/
├── agent/                # Contains the core LangGraph AI agent logic
├── prompt_library/       # Stores the system prompts that define the AI's persona
├── src/                  # All frontend React components and source code
├── tools/                # Python-based tools the AI agent can use (e.g., calculators)
├── utils/                # Utility functions for the backend
├── main.py               # The main FastAPI application file
├── package.json          # Frontend dependencies
└── requirements.txt      # Backend Python dependencies

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally on your machine.

### Prerequisites

* **Node.js** (v18 or later)
* **Python** (v3.11 or later)
* A package manager for Node.js (`npm` or `yarn`)
* An API key from [Groq](https://console.groq.com/keys)

### Backend Setup

1.  **Clone the Repository**
    ```bash
    git clone [https://your-repository-url.git](https://your-repository-url.git)
    cd your-project-directory
    ```

2.  **Create and Activate a Virtual Environment** (Recommended)
    ```bash
    # For Windows
    python -m venv env
    .\env\Scripts\activate

    # For macOS/Linux
    python3 -m venv env
    source env/bin/activate
    ```

3.  **Install Python Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set Up Environment Variables**
    Create a file named `.env` in the root of the project and add your Groq API key:
    ```env
    GROQ_API_KEY="your_groq_api_key_here"
    ```

5.  **Run the Backend Server**
    Open a terminal and run the following command. The server will start on `http://localhost:8000`.
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```

### Frontend Setup

1.  **Open a New Terminal**
    Keep the backend server running in its own terminal. Open a second terminal for the frontend.

2.  **Install Frontend Dependencies**
    ```bash
    npm install
    ```

3.  **Run the Frontend Development Server**
    The frontend will start, usually on `http://localhost:5173`.
    ```bash
    npm run dev
    ```

---

## Usage

Once both the backend and frontend servers are running:
1.  Open your browser and navigate to the frontend URL (e.g., `http://localhost:5173`).
2.  Fill out the questionnaire with your personal details and preferences.
3.  Submit the form. The application will send your request to the backend.
4.  The AI agent will generate your personalized meal plan, which will be displayed on the results screen.

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or want to add new features, please follow these steps:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourAmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some YourAmazingFeature'`).
4.  Push to the branch (`git push origin feature/YourAmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## 🙏 Acknowledgments

**Thanks to the creators of FastAPI, React, LangGraph, and Groq for their amazing tools and libraries that made this project possible. And a special thanks to all the beautiful hearts who contribute to open source.**
=======
  Run `npm run dev` to start the development server.
