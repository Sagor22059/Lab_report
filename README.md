# 🔬 Lab Report System

A modern, user-friendly platform for submitting and managing lab reports online. Designed for educational institutions to streamline the lab report submission process.

## ✨ Features

- **📤 Easy Submission**: Upload lab reports quickly with file validation
- **✅ Feedback Management**: Teachers can provide detailed feedback on submissions
- **📊 Progress Tracking**: Students can monitor their grades and progress
- **👥 Role-Based Access**: Separate dashboards for Students, Teachers, and Admins
- **🔐 Secure Authentication**: Password hashing with bcrypt
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎨 Modern UI**: Bootstrap 5 with custom styling

## 🛠️ Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MySQL with mysql2
- **Frontend**: EJS templating, Bootstrap 5, JavaScript
- **Authentication**: express-session, bcryptjs
- **File Handling**: Multer for file uploads
- **Environment**: dotenv for configuration

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Lab_report
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Database

**Start MySQL:**
```bash
# Windows
net start MySQL80

# macOS
mysql.server start

# Linux
sudo systemctl start mysql
```

**Create Database and Import Schema:**
```bash
mysql -u root -p
CREATE DATABASE IF NOT EXISTS lab_reports_db;
USE lab_reports_db;
SOURCE database.sql;
EXIT;
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lab_reports_db
SESSION_SECRET=your_secret_key_here
NODE_ENV=development
```

### 5. Run the Application

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📚 Project Structure

```
Lab_report/
├── database.sql           # Database schema
├── db.js                  # Database configuration
├── server.js              # Express server setup
├── package.json           # Dependencies
├── .env                   # Environment variables
├── middleware/            # Custom middleware
│   ├── auth.js
│   └── upload.js
├── routes/                # Route handlers
│   ├── auth.js
│   ├── student.js
│   ├── teacher.js
│   └── admin.js
├── views/                 # EJS templates
│   ├── public/            # Public pages
│   ├── student/           # Student pages
│   ├── teacher/           # Teacher pages
│   ├── admin/             # Admin pages
│   └── partials/          # Reusable components
├── public/                # Static files
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
└── uploads/               # User file uploads
```

## 👥 User Roles

### Student
- Submit lab reports
- View grades and feedback
- Track submission status
- Download assignment files

### Teacher/Instructor
- Create and manage assignments
- Review student submissions
- Provide grades and feedback
- View class statistics

### Admin
- Manage users (students, teachers)
- Manage courses
- View system statistics
- Configure system settings

## 🔐 Demo Credentials

For testing purposes:

| Role | Email | Password |
|------|-------|----------|
| Student | student@example.com | password123 |
| Teacher | teacher@example.com | password123 |
| Admin | admin@example.com | password123 |

## 🎯 API Endpoints

### Authentication
- `GET /login` - Login page
- `POST /login` - Submit login
- `GET /register` - Registration page
- `POST /register` - Submit registration
- `GET /logout` - Logout user

### Student Routes
- `GET /student/dashboard` - Student dashboard
- `GET /student/submission` - View submissions
- `POST /student/upload` - Upload assignment

### Teacher Routes
- `GET /teacher/dashboard` - Teacher dashboard
- `POST /teacher/create-assignment` - Create assignment
- `POST /teacher/grade` - Grade submission

### Admin Routes
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/manage-users` - Manage users
- `GET /admin/manage-courses` - Manage courses

## 🔍 Validation

The system includes:
- **Email validation**: RFC 5322 compliant email format
- **Password validation**: Minimum 6 characters, hashed with bcrypt
- **File validation**: File type and size restrictions
- **Input sanitization**: Protection against SQL injection
- **Session validation**: Secure cookie-based sessions

## 📝 Database Schema

### Users Table
```sql
- id (INT, Primary Key)
- name (VARCHAR 100)
- email (VARCHAR 100, UNIQUE)
- password (VARCHAR 255)
- role (ENUM: student, teacher, admin)
- created_at (TIMESTAMP)
```

### Submissions Table
```sql
- id (INT, Primary Key)
- assignment_id (INT, Foreign Key)
- student_id (INT, Foreign Key)
- file_path (VARCHAR 255)
- submission_date (DATETIME)
- status (ENUM: submitted, late, graded)
```

## 🐛 Troubleshooting

### MySQL Connection Error
```
Error: connect ECONNREFUSED ::1:3306
```
**Solution**: Ensure MySQL is running. Start it with:
```bash
net start MySQL80  # Windows
```

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: Install dependencies:
```bash
npm install
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Change the PORT in `.env` or kill the process using port 3000.

### Database Not Found
```
Error: ER_BAD_DB_ERROR
```
**Solution**: Create the database and import schema:
```bash
mysql -u root < database.sql
```

## 🔒 Security Considerations

1. **Password Security**: Passwords are hashed using bcrypt with salt rounds = 10
2. **SQL Injection Prevention**: Using parameterized queries with mysql2
3. **Session Security**: Secure session cookies with proper configuration
4. **CSRF Protection**: Implement CSRF tokens for state-changing operations
5. **Input Validation**: All user inputs are validated on both client and server
6. **SSL Support**: Database connection supports SSL for production

## 📊 Features to Add

- [ ] Email notifications for submissions
- [ ] Real-time notifications using WebSockets
- [ ] Advanced analytics and reporting
- [ ] Student peer review system
- [ ] Plagiarism detection
- [ ] Mobile app integration
- [ ] Two-factor authentication
- [ ] File version history

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@labsystem.com or open an issue in the repository.

## 👨‍💻 Author

Created by the Lab Report System Team

## 🙏 Acknowledgments

- Bootstrap 5 for the responsive design framework
- Express.js for the robust web framework
- MySQL for reliable database management
- All contributors who have helped with this project

---

**Happy Coding! 🚀**
