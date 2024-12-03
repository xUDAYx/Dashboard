# 🚀 RBAC Dashboard

A modern Role-Based Access Control (RBAC) dashboard built with Next.js 14, Prisma, and Shadcn UI. This application provides a sleek and user-friendly interface for managing users and roles with their respective permissions.

![Dashboard Preview](./public/dashboard-preview.png)

## ✨ Features

### 📊 Dashboard
- Real-time statistics and metrics
- Visual representation of user distribution
- Growth indicators for users and roles
- Interactive charts and graphs

### 👥 User Management
- Create new users with name, email, and role assignments
- Edit existing user details and role assignments
- Delete users from the system
- View all users in a sortable and searchable table
- Real-time filtering and sorting capabilities

### 🔐 Role Management
- Create custom roles with specific permissions
- Manage role permissions with an intuitive interface
- Delete roles when no longer needed
- View role assignments and permissions at a glance
- Search and filter roles easily

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Database**: [Prisma](https://www.prisma.io/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide Icons](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A database (PostgreSQL recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rbac-dashboard.git
cd rbac-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your database connection string and other configurations.

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

## 📱 Screenshots

### Dashboard View
![Dashboard](./public/dashboard.png)

### User Management
![User Management](./public/users.png)

### Role Management
![Role Management](./public/roles.png)

## 🔒 Security

This dashboard implements role-based access control (RBAC) with the following features:
- Secure authentication
- Permission-based authorization
- Protected API routes
- Input validation and sanitization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/)
- [Shadcn](https://twitter.com/shadcn)
- [Prisma Team](https://www.prisma.io/)
- [Vercel](https://vercel.com/)

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/rbac-dashboard](https://github.com/yourusername/rbac-dashboard)

---
⭐️ Star this repo if you find it helpful!
