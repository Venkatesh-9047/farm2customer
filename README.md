# 🚜 Farm2Customer (F2C)
**Direct Connection Between Local Farmers & Consumers**

**Farm2Customer** is a full-stack, serverless application built to bridge the gap between rural farmers and urban consumers. By removing middlemen, it allows farmers to list fresh produce directly and enables customers to buy them based on real-time location and availability.

---

## 🌟 Key Features

### 👨‍🌾 For Farmers
- **Product Management**: A dedicated dashboard to list fresh produce with images, descriptions, and pricing.
- **Real-Time Inventory**: Custom "Auto-Delete" logic that instantly removes products from the live shop once purchased to ensure stock accuracy.
- **Seller Identity**: Secure login and management of unique farm listings via **Firebase Authentication**.

### 🛒 For Customers
- **Location-Based Discovery**: Smart filtering system using **Firestore Composite Indexing** to find fresh produce in your specific city.
- **Seamless Shopping**: Integrated shopping cart powered by **React Context API** for a persistent and smooth checkout experience.
- **Role-Based Access**: Specialized user flows that differentiate between buying and selling permissions.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (v18), React Router (v6) |
| **Backend (Serverless)** | Firebase Authentication, Firebase SDK |
| **Database** | Cloud Firestore (NoSQL) |
| **Tooling** | Vite, Git/GitHub, NPM |

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/Venkatesh-9047/farm2customer.git](https://github.com/Venkatesh-9047/farm2customer.git)
cd farm2customer

2. Install Dependencies
Bash
npm install
3. Run Development Server
Bash
npm run dev
🧑‍💻 Author
Venkatesh

GitHub: @Venkatesh-9047

Focus: Full-Stack Development, Data Structures & Algorithms (DSA), and Web Architecture
