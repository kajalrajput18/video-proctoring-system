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
