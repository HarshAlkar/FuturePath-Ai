# 🗄️ MongoDB Atlas Setup & Connection Guide

## 📋 Common MongoDB Atlas Issues & Solutions

### **Issue: Database Not Showing Up**

This usually happens due to:
1. **Network Access** not configured
2. **Database User** not created
3. **Connection String** incorrect
4. **Cluster** not properly set up

## 🔧 Step-by-Step Fix

### **Step 1: Check Your MongoDB Atlas Setup**

#### **1.1 Verify Cluster Status**
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Sign in to your account
3. Check if your cluster is **running** (not paused)
4. If paused, click **"Resume"** to start it

#### **1.2 Check Network Access**
1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Add **"0.0.0.0/0"** (allow all IPs) for testing
4. Or add your Render server IPs specifically

#### **1.3 Check Database User**
1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Create user with:
   - **Username**: `futurepath_user`
   - **Password**: `your_secure_password`
   - **Database User Privileges**: `Read and write to any database`

### **Step 2: Get Correct Connection String**

#### **2.1 Get Connection String**
1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** and **"3.6 or later"**
5. Copy the connection string

#### **2.2 Update Connection String**
Replace `<password>` with your actual password:
```
mongodb+srv://futurepath_user:<password>@cluster0.xxxxx.mongodb.net/futurepath_ai?retryWrites=true&w=majority
```

### **Step 3: Test Connection Locally**

Create a test file to verify connection:
