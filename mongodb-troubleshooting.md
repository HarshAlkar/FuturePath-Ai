# 🔧 MongoDB Atlas Troubleshooting Guide

## 🚨 Common Issues & Solutions

### **Issue 1: Database Not Showing Up**

#### **Symptoms:**
- Connection successful but no databases visible
- Empty database list
- Collections not showing

#### **Solutions:**

**1. Check if you're connected to the right cluster:**
```javascript
console.log('Connected to:', mongoose.connection.host);
console.log('Database name:', mongoose.connection.name);
```

**2. Create a database explicitly:**
```javascript
// This will create the database if it doesn't exist
const db = mongoose.connection.db;
await db.createCollection('users');
```

**3. Check network access:**
- Go to MongoDB Atlas → Network Access
- Add IP: `0.0.0.0/0` (allow all IPs)
- Or add your Render server IPs

### **Issue 2: Authentication Failed**

#### **Symptoms:**
- "Authentication failed" error
- "Invalid credentials" error

#### **Solutions:**

**1. Check database user:**
- Go to MongoDB Atlas → Database Access
- Verify user exists
- Check username and password

**2. Check user permissions:**
- User should have "Read and write to any database"
- Or specific database permissions

**3. Update connection string:**
```
mongodb+srv://username:password@cluster.mongodb.net/database_name
```

### **Issue 3: Connection Timeout**

#### **Symptoms:**
- Connection hangs
- Timeout errors
- Network errors

#### **Solutions:**

**1. Check cluster status:**
- Make sure cluster is running (not paused)
- Resume if paused

**2. Check network access:**
- Add your IP address to whitelist
- Use `0.0.0.0/0` for testing

**3. Check connection string:**
- Verify cluster URL is correct
- Check database name

## 🧪 Testing Your Connection

### **Step 1: Test Locally**
```bash
# Set your MongoDB URI
export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/futurepath_ai"

# Run the test
node test-mongodb-connection.js
```

### **Step 2: Test on Render**
1. Add `MONGODB_URI` to your Render environment variables
2. Deploy your backend
3. Check the logs for connection status

### **Step 3: Verify Database Creation**
```javascript
// This will create the database and collection
const userSchema = new mongoose.Schema({
  email: String,
  name: String
});

const User = mongoose.model('User', userSchema);

// Create a user (this will create the database)
const user = new User({ email: 'test@example.com', name: 'Test User' });
await user.save();
```

## 🔍 Debugging Steps

### **1. Check MongoDB Atlas Dashboard**
- Go to your cluster
- Check "Database" tab
- Look for your database name
- Check collections

### **2. Check Connection Logs**
```javascript
mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});
```

### **3. Test Database Operations**
```javascript
// Test if you can create documents
const testUser = new User({ email: 'test@example.com' });
await testUser.save();
console.log('✅ User created successfully');
```

## 🚀 Quick Fix Commands

### **1. Update Your Backend to Use MongoDB**
```bash
# Install mongoose if not already installed
npm install mongoose

# Update your server.js to use MongoDB instead of PostgreSQL
```

### **2. Set Environment Variables on Render**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/futurepath_ai
```

### **3. Test the Connection**
```bash
# Run the test script
node test-mongodb-connection.js
```

## 📞 Still Having Issues?

### **Common Solutions:**
1. **Double-check your connection string**
2. **Verify network access settings**
3. **Check if cluster is running**
4. **Verify database user permissions**
5. **Try creating a new database user**

### **MongoDB Atlas Checklist:**
- [ ] Cluster is running (not paused)
- [ ] Network access allows your IP (or 0.0.0.0/0)
- [ ] Database user exists with correct permissions
- [ ] Connection string is correct
- [ ] Database name is specified in connection string

---

**Need more help? Check the MongoDB Atlas documentation or contact support! 🚀**
