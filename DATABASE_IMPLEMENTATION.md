# GovMatch AI - User Data Persistence Implementation

## Overview

This document describes the implementation of persistent user data storage for GovMatch AI using SQLite.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   React Frontend                             │
│  • AuthModal.jsx (Login/Register)                           │
│  • EligibilityQuestionnaire.jsx (Profile Input)             │
│  • Profile.jsx (View/Edit Profile)                          │
│  • apiService.js (Authenticated API Calls)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP + JWT
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 Express Backend API                          │
│                                                              │
│  Auth Routes:                                               │
│    POST /api/auth/register                                  │
│    POST /api/auth/login                                     │
│                                                              │
│  Profile Routes (Protected):                                │
│    GET  /api/profile                                        │
│    POST /api/profile                                        │
│    PUT  /api/profile                                        │
└──────────────┬─────────────────┬──────────────────────────┘
               │                 │
               ▼                 ▼
┌─────────────────────┐  ┌──────────────────────────────────┐
│   SQLite Database   │  │  Existing Recommendation System  │
│   (User Profiles)   │  │  (Unchanged - schemes.json)      │
└─────────────────────┘  └──────────────────────────────────┘
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### User Profiles Table
```sql
CREATE TABLE user_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  age INTEGER,
  gender TEXT,
  state TEXT,
  district TEXT,
  area TEXT,
  occupation TEXT,
  employment_status TEXT,
  annual_income TEXT,
  education TEXT,
  caste TEXT,
  minority INTEGER DEFAULT 0,
  disability INTEGER DEFAULT 0,
  bpl_card INTEGER DEFAULT 0,
  is_student INTEGER DEFAULT 0,
  is_widow INTEGER DEFAULT 0,
  goal TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

#### POST /api/auth/login
Login existing user.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Profile Management (Requires Authentication)

#### GET /api/profile
Get the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  "profile": {
    "age": 28,
    "gender": "male",
    "state": "Karnataka",
    "district": "Bengaluru Urban",
    "area": "Urban",
    "occupation": "Student",
    "employmentStatus": "Part-Time",
    "annualIncome": "175000",
    "education": "Graduate",
    "caste": "general",
    "minority": false,
    "disability": false,
    "bplCard": false,
    "isStudent": true,
    "isWidow": false,
    "goal": ["Education Support", "Employment / Skill Training"],
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

#### POST /api/profile
Create a new profile (automatically uses authenticated user).

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request:**
```json
{
  "age": 28,
  "gender": "male",
  "state": "Karnataka",
  "occupation": "Student",
  "annualIncome": "175000",
  "education": "Graduate",
  "caste": "general"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile created successfully.",
  "profileId": 1
}
```

#### PUT /api/profile
Update existing profile (or create if doesn't exist).

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request:** Same as POST

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully."
}
```

## Security Implementation

### Password Security
- Passwords hashed using `bcryptjs` with salt rounds = 10
- Plain-text passwords never stored
- Password hashes never returned to frontend

### Authentication
- JWT (JSON Web Tokens) for stateless authentication
- Token expiry: 7 days
- Token stored in localStorage (`govmatch_token`)
- Token sent in `Authorization: Bearer <token>` header

### Authorization
- Middleware `authenticateToken()` protects profile routes
- User can only access their own profile
- User ID extracted from verified JWT token

### SQL Injection Protection
- Using parameterized queries with `better-sqlite3`
- All user inputs sanitized through prepared statements

## Data Flow

### 1. User Registration/Login
```
User fills form → POST /api/auth/register → Hash password → 
Insert into users table → Generate JWT → Return token + user data →
Frontend stores token → User logged in
```

### 2. Profile Creation (Questionnaire)
```
User fills questionnaire → Click "Find Schemes" → 
Save to localStorage (backward compatibility) →
IF logged in: POST/PUT /api/profile → Save to database →
Navigate to results → Recommendations generated
```

### 3. Profile Loading (After Login)
```
User logs in → JWT token received → App.jsx calls loadUserProfile() →
GET /api/profile with token → Database returns profile →
Merge with localStorage → Profile available for recommendations
```

### 4. Profile Update
```
User edits profile → Click "Save" → 
Update localStorage →
IF logged in: PUT /api/profile → Update database →
Show success message
```

## Backward Compatibility

### Non-Breaking Changes ✅
1. **localStorage still works**: All existing localStorage code preserved
2. **Recommendation engine unchanged**: Still accepts profile object as before
3. **Non-authenticated users**: Can use questionnaire without logging in
4. **Graceful degradation**: If database save fails, app continues working

### Dual Storage Strategy
- **localStorage**: Immediate, always available, works offline
- **Database**: Persistent, cross-device, secure

Profile data flow:
1. Always save to localStorage first (instant)
2. If user logged in, save to database (persistent)
3. On login, load from database → merge with localStorage
4. Recommendation engine reads from localStorage (unchanged)

## Files Created

### Backend
```
backend/
├── database/
│   ├── db.js              # SQLite connection
│   └── init.js            # Table initialization
├── auth/
│   └── authRoutes.js      # Register/login endpoints
├── profile/
│   └── profileRoutes.js   # Profile CRUD endpoints
└── data/
    └── govmatch.db        # SQLite database (auto-created)
```

### Frontend
```
mp-frontend--main/src/
└── services/
    └── apiService.js      # Authenticated API helper
```

## Files Modified

### Backend
- `server.js` - Initialize database, mount auth & profile routes
- `package.json` - Added dependencies (better-sqlite3, bcryptjs, jsonwebtoken)
- `.env.example` - Added JWT_SECRET

### Frontend
- `components/AuthModal.jsx` - Use backend auth APIs
- `pages/EligibilityQuestionnaire.jsx` - Save profile to database
- `pages/Profile.jsx` - Load/update profile from/to database
- `App.jsx` - Load profile on login

## Environment Variables

Add to `backend/.env`:
```
PORT=5001
OPENROUTER_API_KEY=your_key_here
PYTHON_NLP_URL=http://localhost:5002
JWT_SECRET=your_jwt_secret_key_change_in_production
```

## Dependencies Added

### Backend (backend/package.json)
```json
{
  "better-sqlite3": "^11.8.1",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2"
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set Environment Variables
```bash
cp .env.example .env
# Edit .env and set JWT_SECRET
```

### 3. Start Backend
```bash
npm start
```

The database will be automatically initialized on first run.

### 4. Start Frontend
```bash
cd mp-frontend--main
npm run dev
```

## Testing

See `backend/TEST_DATABASE.md` for comprehensive testing guide.

## Troubleshooting

### Database locked error
- SQLite uses Write-Ahead Logging (WAL) mode for better concurrency
- If you see "database is locked", ensure only one server instance is running

### Token expired
- JWT tokens expire after 7 days
- Users will need to log in again
- Future enhancement: Add refresh token mechanism

### Profile not loading
- Check browser console for errors
- Verify token exists in localStorage: `govmatch_token`
- Test API endpoint directly with cURL

### Backend not starting
- Check if port 5001 is already in use
- Verify all dependencies installed: `npm install`
- Check database permissions in `backend/data/` directory

## Future Enhancements

1. **Recommendation History**: Store past recommendations in database
2. **Password Reset Email**: Implement actual email functionality
3. **Profile Versioning**: Track profile changes over time
4. **Social Login**: Add Google/Facebook authentication
5. **Profile Photos**: Add avatar upload feature
6. **Data Export**: Let users download their data (GDPR compliance)
7. **Account Deletion**: Implement complete account removal
8. **Refresh Tokens**: Add automatic token refresh
9. **Rate Limiting**: Prevent brute force attacks
10. **Email Verification**: Verify email before account activation

## Performance Considerations

- SQLite is suitable for this use case (read-heavy, moderate writes)
- WAL mode enabled for better concurrent access
- Indexes on `users.email` and `user_profiles.user_id` for fast lookups
- Connection reused across requests (singleton pattern)

## Security Best Practices Implemented

✅ Password hashing with bcrypt  
✅ JWT-based authentication  
✅ Parameterized SQL queries  
✅ Token expiration  
✅ User isolation (can't access other users' data)  
✅ Password never sent to frontend  
✅ HTTPS recommended for production  
✅ Environment variables for secrets  

## Conclusion

The user data persistence feature has been successfully implemented with:
- ✅ Zero breaking changes to existing functionality
- ✅ Backward compatibility maintained
- ✅ Security best practices followed
- ✅ Clear separation of concerns
- ✅ Graceful error handling
- ✅ Complete testing coverage

The existing recommendation engine, scheme data, and all frontend features continue to work exactly as before.
