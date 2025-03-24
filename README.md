# ART-1262

## 🚀 Getting Started

### 1️⃣ **Clone the Repository**
```bash
git clone https://github.com/Alyssa-ngx/ART-1262.git

### **RUNNING BACKEND**
cd backend-node
npm start

### Server will run on http://localhost:3000

📌 API Endpoints
✅ Café API
Method	Endpoint	Description
GET	/api/cafes	Get all cafes
GET	/api/cafes?location=<location>	Get cafes by location
POST	/api/cafes	Add new cafe
PUT	/api/cafes/:id	Update cafe details
DELETE	/api/cafes/:id	Delete a cafe and its employees
✅ Employee API
Method	Endpoint	Description
GET	/api/employees	Get all employees
GET	/api/employees?cafe=<cafe>	Get employees by cafe
POST	/api/employees	Add new employee
PUT	/api/employees/:id	Update employee details
DELETE	/api/employees/:id	Delete an employee


# 🎨 Café Employee Frontend

This is the frontend React application for managing employees and cafes.

## 🚀 Getting Started
### **RUNNING FRONTEND**
cd frontend-react
npm start

Frontend will run on http://localhost:3001

📌 Features
✅ Café Page
View all cafes with employee count

Filter cafes by location

Add/Edit/Delete cafés

✅ Employee Page
View all employees

Assign employees to cafés

Track days worked

Add/Edit/Delete employees