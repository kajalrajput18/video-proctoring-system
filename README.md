# 🎥 Video Proctoring System  

A full-stack **AI-powered video proctoring system** built with **React (Vite) + Tailwind CSS (Frontend)** and **Node.js + Express + Socket.io (Backend)**.  
This project allows online exam monitoring with real-time video streaming, face/eye movement tracking, and rule violation detection.  

---

## 🚀 Features  

✅ **User Authentication** (Firebase / JWT) – Secure login for Students & Proctors  
✅ **Real-Time Video Streaming** – WebRTC + Socket.io for low-latency monitoring  
✅ **Violation Detection** – Detects multiple faces, absence, or unusual activities  
✅ **Exam Dashboard** – Proctor can view multiple students in grid view  
✅ **Activity Logs** – Stores violations & generates reports  
✅ **Responsive UI** – Built with Tailwind CSS for a modern and clean interface  

---

## 🏗️ Tech Stack  

**Frontend**  
- ⚡ React (Vite)  
- 🎨 Tailwind CSS  
- 🔐 Firebase Authentication  

**Backend**  
- 🟢 Node.js  
- ⚡ Express.js  
- 🔌 Socket.io (real-time communication)  

**Database**  
- 📦 MongoDB (or Firebase Firestore)  

---

## ⚙️ Installation & Setup
**1️⃣ Clone Repo**
git clone https://github.com/your-username/video-proctoring-system.git
cd video-proctoring-system

**2️⃣ Install Dependencies**
Frontend
cd client
npm install

Backend
cd server
npm install

**3️⃣ Setup Environment Variables**

Create a .env file inside client/

VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id


Create a .env file inside server/

PORT=5000
MONGO_URI=your-mongo-db-uri
JWT_SECRET=your-secret-key

**4️⃣ Run the App**
Start Backend
cd server
npm start

Start Frontend
cd client
npm run dev


### 🎯 Future Enhancements

🔍 AI-powered face recognition

📊 Analytics dashboard for violations

📡 Cloud storage for exam recordings

🤖 Auto-detection of multiple devices


📜 License

This project is licensed under the MIT License – free to use and modify.

👩‍💻 Built with ❤️ by Kajal


## 📂 Folder Structure  

```bash
video-proctoring-system/
│── client/              # Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth Context / Global State
│   │   ├── pages/       # Login, Dashboard, Exam pages
│   │   └── App.jsx
│   └── package.json
│
│── server/              # Backend (Node.js + Express)
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── models/          # Database models
│   ├── socket/          # Socket.io handlers
│   └── server.js
│
│── README.md
│── package.json




