# Quick Start Guide - User Data Persistence

## 🚀 Start Using the Database Feature in 3 Steps

### Step 1: Install Dependencies (One-time setup)
```bash
cd backend
npm install
```

This installs:
- `better-sqlite3` - SQLite database driver
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication

### Step 2: Configure Environment Variable
Open `backend/.env` and add:
```
JWT_SECRET=your_secure_secret_key_here_change_this
```

Or use the default (development only).

### Step 3: Start the Application
```bash
# Terminal 1: Start Backend
cd backend
npm start

# Terminal 2: Start Frontend
cd mp-frontend--main
npm run dev
```

**That's it!** The database will auto-initialize on first backend start.

---

## ✅ Verify It's Working

### Check 1: Database Created
```bash
# Should show: True
Test-Path backend/data/govmatch.db
```

### Check 2: Tables Created
```bash
cd backend/data
sqlite3 govmatch.db "SELECT name FROM sqlite_master WHERE type='table';"
```

Expected output:
```
users
user_profiles
```

### Check 3: Test Registration
1. Open app in browser
2. Click "Login" → "Register"
3. Fill: Name, Email, Password
4. Click "Create Account"
5. ✅ You should be logged in

### Check 4: Test Profile Persistence
1. Navigate to "Eligibility Assessment"
2. Fill all 8 steps
3. Click "Find Schemes"
4. Refresh browser (F5)
5. Navigate to "Profile"
6. ✅ Your data should be there

---

## 🎯 User Flow Example

```
1. Register
   → Name: Test User
   → Email: test@example.com  
   → Password: test1234
   → Click "Create Account"
   ✅ Logged in

2. Complete Questionnaire
   → Navigate to "Eligibility Assessment"
   → Fill all fields
   → Click "Find Schemes"
   ✅ Profile saved to database

3. View Results
   → Recommendations displayed
   ✅ Working exactly as before

4. Check Profile
   → Navigate to "Profile" page
   → See saved data
   ✅ Data persisted

5. Logout & Login Again
   → Click logout
   → Login with same email
   ✅ Profile automatically loads

6. Edit Profile
   → Change occupation, state, etc.
   → Click "Save Changes"
   ✅ Updates saved to database
```

---

## 🔍 Troubleshooting

### Issue: "Cannot find module 'better-sqlite3'"
**Solution:** Run `npm install` in backend directory

### Issue: Backend not starting
**Solution:** 
1. Check if port 5001 is free
2. Run `npm install` in backend
3. Check for errors in console

### Issue: Profile not saving
**Solution:**
1. Check if you're logged in (JWT token present)
2. Check browser console for errors
3. Check backend logs
4. Try logout → login again

### Issue: Database file not found
**Solution:**
1. Database creates automatically on first run
2. Check `backend/data/` directory exists
3. Restart backend server

---

## 📊 Quick Database Inspection

### View all users:
```bash
cd backend/data
sqlite3 govmatch.db "SELECT id, name, email, created_at FROM users;"
```

### View all profiles:
```bash
sqlite3 govmatch.db "SELECT user_id, age, state, occupation FROM user_profiles;"
```

### Count users:
```bash
sqlite3 govmatch.db "SELECT COUNT(*) FROM users;"
```

### See full schema:
```bash
sqlite3 govmatch.db ".schema"
```

---

## 🔒 Security Notes

✅ **Passwords are hashed** - Never stored as plain text  
✅ **JWT tokens** - Secure authentication  
✅ **Token expires** - After 7 days  
✅ **User isolation** - Can't access other users' data  

**For Production:**
- Change `JWT_SECRET` to a strong random string
- Use HTTPS
- Enable rate limiting
- Set up proper backup for database

---

## 📚 Need More Info?

- **Technical Details:** See `DATABASE_IMPLEMENTATION.md`
- **Testing Guide:** See `backend/TEST_DATABASE.md`
- **Complete Summary:** See `IMPLEMENTATION_SUMMARY.md`

---

## ✅ Success Checklist

After setup, verify:
- [ ] `npm install` completed without errors
- [ ] Backend starts on port 5001
- [ ] Frontend starts and shows homepage
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can complete questionnaire
- [ ] Profile data persists after refresh
- [ ] Can edit and save profile
- [ ] Recommendations still work
- [ ] Database file exists at `backend/data/govmatch.db`

---

## 🎉 You're Ready!

The database feature is now active. Users can:
- ✅ Register accounts
- ✅ Login securely
- ✅ Save profile data permanently
- ✅ Access data across sessions
- ✅ Update their information

All existing features continue working exactly as before!
