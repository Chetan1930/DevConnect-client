# 🧑‍💻 DevConnect — Frontend

**DevConnect** is a full-stack social platform for developers where users can create profiles, write blogs, follow others, and chat in real-time — all in one place.  
This repository contains the **frontend (client)** built using **React + TypeScript + Tailwind CSS**.

---

## 🚀 Features

- 🔐 Authentication (Login, Register) using JWT
- 🧑‍🎓 Developer Profiles with skills, GitHub, LinkedIn, avatar
- 📝 Blog System with Markdown support, likes & comments
- 🤝 Follow/Unfollow other developers
- 💬 Real-time 1-to-1 chat using Socket.IO
- 📸 Image uploads (avatar, blog covers via Cloudinary)
- 🔍 Explore/Search developers
- ⚙️ Clean state management via React Context API

---

## 🛠️ Tech Stack

- **React** + **Vite**
- **TypeScript**
- **Tailwind CSS**
- **React Router**
- **Context API** for Auth state
- **Axios** for API calls
- **Socket.IO Client** for real-time chat
- **Markdown Rendering** via `react-markdown` (optional)

---

## 📁 Folder Structure

```

client/
├── components/       # Reusable UI components (Navbar, Footer, etc.)
├── context/          # AuthContext for global user/auth state
├── pages/            # Page-level components (Login, Register, Dashboard, Chat, etc.)
├── services/         # Axios API utilities
├── App.tsx           # Main app with routing
├── main.tsx          # Root file
└── index.css         # Tailwind base styles

````

---

## 🔧 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/devconnect-frontend.git
   cd devconnect-frontend
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root and configure:

   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   ```

4. **Run the app locally**

   ```bash
   npm run dev
   ```

---

## 🧪 Features in Progress

* [ ] Responsive UI improvements
* [ ] Profile editing
* [ ] Notifications
* [ ] Better error handling for forms

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you would like to change.

---

## 📸 Preview

> *(Include screenshots here when available)*

---

## 📄 License

This project is licensed under the MIT License.

---

## 🧠 Author

* **Chetan Chauhan**
  [LinkedIn](https://www.linkedin.com/in/chetan71)


