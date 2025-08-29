Live Demo Link: https://graphicalpassword-varshith.vercel.app/

# 🔐 Graphical Password Authentication System
A **secure and user-friendly authentication system** that replaces traditional text-based passwords with a **graphical password mechanism**.  
Instead of only typing a password, users select a sequence of images from dynamically generated grids, making it resistant to brute-force, phishing, and shoulder-surfing attacks.

---

## 🚀 Features
- **Dual Authentication**: Combines alphanumeric + graphical passwords.  
- **Dynamic Image Grid**: Images fetched from the **Unsplash API** and shuffled each session.  
- **Password Security**: Uses **bcrypt** with salting for hashing alphanumeric & graphical passwords.  
- **Account Protection**: Automatic **account blocking** after multiple failed attempts.  
- **Email Alerts**: Sends **unblock link** via Nodemailer for account recovery.  
- **Responsive Frontend**: Built with **React.js + Tailwind CSS**.  
- **Secure Backend**: Node.js & Express.js with **JWT-based session management**.  
- **Database**: MongoDB for storing user data, hashed passwords, and login attempts.  

---

## 🏗️ System Architecture
- **Frontend (React.js, Tailwind CSS)**  
  - Signup/Login flow with graphical password selection  
  - Image grid with **blur effect** to reduce shoulder surfing  
  - Smooth animations via **Framer Motion**  

- **Backend (Node.js, Express.js)**  
  - User registration & login logic  
  - Graphical password verification  
  - Email notifications with Nodemailer  
  - JWT for session management  

- **Database (MongoDB + Mongoose)**  
  - Stores user credentials (hashed)  
  - Graphical password image metadata  
  - Failed login attempts & account status  

---

## ⚙️ Tech Stack
**Frontend**: React.js, Tailwind CSS, Framer Motion, Axios  
**Backend**: Node.js, Express.js, JWT, bcrypt, Nodemailer  
**Database**: MongoDB, Mongoose  
**External APIs**: Unsplash API (dynamic image retrieval)  

---


## 🔑 How It Works
1. **Signup**
   - User registers with email, alphanumeric password, and selects an image theme.  
   - The system fetches **64 images** from Unsplash, divided into 4 sets.  
   - User selects 1 image per set → forms a **4-image graphical password sequence**.  
   - Both passwords are hashed with bcrypt and stored.  

2. **Login**
   - Step 1: Enter email + alphanumeric password.  
   - Step 2: Select graphical password sequence from shuffled images.  
   - If both match → **Access Granted**.  

3. **Account Blocking**
   - After multiple failed attempts → account is **blocked**.  
   - User receives an **email unblock link**.  

4. **Session Management**
   - Secure **JWT-based tokens** manage user sessions.  

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)  
- MongoDB (local or Atlas cluster)  
- Unsplash API key  

### Setup
```bash
# Clone repo
git clone https://github.com/varshith2303/graphicalpassword.git
cd graphical-password-authentication

# Install dependencies
cd client && npm install
cd ../server && npm install
Configure Environment Variables
Create a .env file inside server/:


MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
UNSPLASH_ACCESS_KEY=your_unsplash_api_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password


# Start backend (in server/)
npm start

# Start frontend (in client/)
npm start
Frontend → http://localhost:3000
Backend → http://localhost:5000
```
---

## 🔮 Future Enhancements
- 📱 Mobile app support (Android/iOS)  
- 🎨 Custom image datasets instead of Unsplash API  
- 🔑 Multi-factor authentication (biometrics + graphical)  
- 🛡️ AI-based anomaly detection for fraud prevention  
- ♿ Accessibility features (high contrast, voice guidance)  
- ☁️ Cloud deployment with Docker & Kubernetes  

---

## 📖 References
Research papers and resources related to **Graphical Password Authentication**  
(see detailed bibliography in report).  

---

## 👨‍💻 Author
**Kasaram Varshith**  
Final Year CSE-AIML Student  




