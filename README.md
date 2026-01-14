# Music Dashboard – Full Stack Take-Home Project

This project is a **full-stack Music Dashboard application** that allows users to browse songs, search by title, sort song attributes, rate songs, visualize data through charts, and export data as CSV.

The backend is built with **FastAPI + PostgreSQL**, and the frontend is built with **React + TypeScript**.

---

## Tech Stack

### Backend
- Python 3.13
- FastAPI
- SQLAlchemy
- PostgreSQL
- Uvicorn
- Pytest

### Frontend
- React
- TypeScript
- Axios
- Recharts
- Vite

---

## 📁 Project Structure

```
Songs Take Home/
│
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   ├── inject_json.py
│   ├── test_api.py
│   ├── requirements.txt
│   └── data/
│       └── playlist.json
│
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── App.css
    │   ├── components/
    │   │   └── Charts.tsx
    │   ├── types/
    │   │   └── Song.ts
    │   └── main.tsx
    └── package.json
```

---

## Backend Setup

### 1️⃣ Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 2️⃣ Install dependencies
```bash
pip install -r requirements.txt
```

### 3️⃣ Configure PostgreSQL
Create a database:
```sql
CREATE DATABASE musicDB;
```

Update connection string in `database.py`:
```python
DATABASE_URL = "postgresql://postgres:password@localhost:5432/musicDB"
```

### 4️⃣ Load song data
```bash
python inject_json.py
```

### 5️⃣ Run backend server
```bash
uvicorn app:app --reload
```

Backend runs at:
```
http://localhost:8000
```

API Docs:
```
http://localhost:8000/docs
```

---

## Backend Testing

Run tests:
```bash
pytest
```

---

## Frontend Setup

### 1️⃣ Install dependencies
```bash
cd frontend
npm install
```

### 2️⃣ Start frontend
```bash
npm run dev
```

Frontend runs at:
```
http://localhost:5173
```

---
 
